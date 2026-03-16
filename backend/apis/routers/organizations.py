from ninja import Router

from apis.auth import JWTAuth
from apis.schemas.requests.organizations import (
    InvitationCreateRequest,
    JoinByCodeRequest,
    OrganizationCreateRequest,
    OrganizationUpdateRequest,
)
from apis.schemas.responses.organizations import (
    InvitationResponse,
    MemberResponse,
    OrganizationDetailResponse,
    OrganizationResponse,
)
from integrations.slack.notifications import send_organization_created_notification
from repositories import OrganizationInvitationRepository, OrganizationRepository

router = Router(tags=["Organizations"])


# ============ 조직 CRUD ============


@router.get("", auth=JWTAuth(), response=list[OrganizationResponse])
def list_organizations(request):
    """내 조직 목록"""
    user = request.auth
    return OrganizationRepository.get_user_organizations(user)


@router.post("", auth=JWTAuth(), response={201: OrganizationDetailResponse})
def create_organization(request, payload: OrganizationCreateRequest):
    """조직 생성"""
    user = request.auth
    organization = OrganizationRepository.create(
        name=payload.name,
        description=payload.description,
        creator=user,
    )
    send_organization_created_notification(
        org_name=organization.name,
        creator_username=user.username,
    )
    return 201, {
        "id": organization.id,
        "name": organization.name,
        "description": organization.description,
        "member_count": 1,
        "created_at": organization.created_at,
    }


@router.get("/{organization_id}", auth=JWTAuth(), response={200: OrganizationDetailResponse, 404: dict})
def get_organization(request, organization_id: int):
    """조직 상세 조회"""
    user = request.auth
    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(user, organization)
    if not membership or not membership.is_active:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    member_count = OrganizationRepository.get_member_count(organization)
    return 200, {
        "id": organization.id,
        "name": organization.name,
        "description": organization.description,
        "member_count": member_count,
        "created_at": organization.created_at,
    }


@router.patch("/{organization_id}", auth=JWTAuth(), response={200: OrganizationDetailResponse, 404: dict})
def update_organization(request, organization_id: int, payload: OrganizationUpdateRequest):
    """조직 수정"""
    user = request.auth
    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(user, organization)
    if not membership or not membership.is_active:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    organization = OrganizationRepository.update(
        organization,
        name=payload.name,
        description=payload.description,
    )
    member_count = OrganizationRepository.get_member_count(organization)
    return 200, {
        "id": organization.id,
        "name": organization.name,
        "description": organization.description,
        "member_count": member_count,
        "created_at": organization.created_at,
    }


@router.delete("/{organization_id}", auth=JWTAuth(), response={204: None, 404: dict})
def delete_organization(request, organization_id: int):
    """조직 삭제"""
    user = request.auth
    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(user, organization)
    if not membership or not membership.is_active:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    OrganizationRepository.soft_delete(organization)
    return 204, None


# ============ 멤버 관리 ============


@router.get("/{organization_id}/members", auth=JWTAuth(), response={200: list[MemberResponse], 404: dict})
def list_members(request, organization_id: int):
    """멤버 목록"""
    user = request.auth
    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(user, organization)
    if not membership or not membership.is_active:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    members = OrganizationRepository.get_members(organization)
    return 200, members


@router.delete("/{organization_id}/members/{member_id}", auth=JWTAuth(), response={204: None, 404: dict})
def remove_member(request, organization_id: int, member_id: int):
    """멤버 제거"""
    user = request.auth
    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    my_membership = OrganizationRepository.get_membership(user, organization)
    if not my_membership or not my_membership.is_active:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    target_membership = OrganizationRepository.get_membership_by_id(member_id)
    if not target_membership or target_membership.organization_id != organization_id:
        return 404, {"detail": "멤버를 찾을 수 없습니다."}

    OrganizationRepository.remove_member(target_membership)
    return 204, None


@router.post("/{organization_id}/leave", auth=JWTAuth(), response={204: None, 404: dict})
def leave_organization(request, organization_id: int):
    """조직 탈퇴"""
    user = request.auth
    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(user, organization)
    if not membership or not membership.is_active:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    OrganizationRepository.remove_member(membership)
    return 204, None


# ============ 초대 코드 ============


@router.post("/{organization_id}/invitations", auth=JWTAuth(), response={201: InvitationResponse, 404: dict})
def create_invitation(request, organization_id: int, payload: InvitationCreateRequest):
    """초대 코드 생성"""
    user = request.auth
    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(user, organization)
    if not membership or not membership.is_active:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    invitation = OrganizationInvitationRepository.create(
        organization=organization,
        created_by=user,
        expires_hours=payload.expires_hours,
        max_uses=payload.max_uses,
    )
    return 201, invitation


@router.get("/{organization_id}/invitations", auth=JWTAuth(), response={200: list[InvitationResponse], 404: dict})
def list_invitations(request, organization_id: int):
    """초대 코드 목록"""
    user = request.auth
    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(user, organization)
    if not membership or not membership.is_active:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    invitations = OrganizationInvitationRepository.get_organization_invitations(organization)
    return 200, invitations


@router.delete("/{organization_id}/invitations/{invitation_id}", auth=JWTAuth(), response={204: None, 404: dict})
def deactivate_invitation(request, organization_id: int, invitation_id: int):
    """초대 코드 비활성화"""
    user = request.auth
    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(user, organization)
    if not membership or not membership.is_active:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    invitation = OrganizationInvitationRepository.get_by_id(invitation_id)
    if not invitation or invitation.organization_id != organization_id:
        return 404, {"detail": "초대 코드를 찾을 수 없습니다."}

    OrganizationInvitationRepository.deactivate(invitation)
    return 204, None


@router.post("/join", auth=JWTAuth(), response={200: OrganizationDetailResponse, 400: dict, 404: dict})
def join_by_code(request, payload: JoinByCodeRequest):
    """초대 코드로 조직 가입"""
    user = request.auth
    invitation = OrganizationInvitationRepository.get_by_code(payload.code)
    if not invitation:
        return 404, {"detail": "유효하지 않은 초대 코드입니다."}

    if not invitation.is_valid():
        return 400, {"detail": "만료되었거나 사용할 수 없는 초대 코드입니다."}

    membership = OrganizationInvitationRepository.use_invitation(invitation, user)
    if not membership:
        return 400, {"detail": "가입에 실패했습니다."}

    organization = invitation.organization
    member_count = OrganizationRepository.get_member_count(organization)
    return 200, {
        "id": organization.id,
        "name": organization.name,
        "description": organization.description,
        "member_count": member_count,
        "created_at": organization.created_at,
    }
