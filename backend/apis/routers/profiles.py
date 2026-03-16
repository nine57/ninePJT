import os
import uuid

from django.conf import settings
from ninja import File, Router, UploadedFile

from apis.auth import JWTAuth
from apis.schemas.base import ErrorSchema, MessageSchema
from apis.schemas.requests.users import NicknameUpdateRequest
from apis.schemas.responses.users import ProfileResponse
from repositories import OrganizationRepository, ProfileRepository

router = Router(tags=["Profiles"])


@router.get(
    "/{org_id}/profile",
    auth=JWTAuth(),
    response={200: ProfileResponse, 404: ErrorSchema},
)
def get_my_profile(request, org_id: int):
    """내 조직 프로필 조회"""
    organization = OrganizationRepository.get_by_id(org_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(request.auth, organization)
    if not membership:
        return 404, {"detail": "멤버십을 찾을 수 없습니다."}

    profile = ProfileRepository.get_or_create_for_membership(membership)
    return 200, profile


@router.put(
    "/{org_id}/profile/nickname",
    auth=JWTAuth(),
    response={200: ProfileResponse, 400: ErrorSchema, 404: ErrorSchema},
)
def update_nickname(request, org_id: int, payload: NicknameUpdateRequest):
    """닉네임 설정/변경"""
    organization = OrganizationRepository.get_by_id(org_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(request.auth, organization)
    if not membership:
        return 404, {"detail": "멤버십을 찾을 수 없습니다."}

    nickname = (payload.nickname or "").strip()
    if not nickname or len(nickname) < 2 or len(nickname) > 20:
        return 400, {"detail": "닉네임은 2~20자여야 합니다."}

    profile = ProfileRepository.get_or_create_for_membership(membership)
    ProfileRepository.update_nickname(profile, nickname)
    return 200, profile


@router.post(
    "/{org_id}/profile/image",
    auth=JWTAuth(),
    response={200: ProfileResponse, 400: ErrorSchema, 404: ErrorSchema},
)
def upload_profile_image(request, org_id: int, image: UploadedFile = File(...)):
    """프로필 이미지 업로드"""
    organization = OrganizationRepository.get_by_id(org_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(request.auth, organization)
    if not membership:
        return 404, {"detail": "멤버십을 찾을 수 없습니다."}

    if not image:
        return 400, {"detail": "image 파일이 필요합니다."}

    file_ext = os.path.splitext(image.name)[1] or ".jpg"
    allowed_exts = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    if file_ext.lower() not in allowed_exts:
        return 400, {"detail": f"지원하지 않는 파일 형식입니다: {file_ext}"}

    file_name = f"{uuid.uuid4()}{file_ext}"
    upload_dir = os.path.join(settings.BASE_DIR, "media", "profiles")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file_name)

    try:
        with open(file_path, "wb") as f:
            for chunk in image.chunks():
                f.write(chunk)
    except Exception as e:
        return 400, {"detail": f"파일 저장 실패: {str(e)}"}

    relative_path = f"profiles/{file_name}"

    profile = ProfileRepository.get_or_create_for_membership(membership)
    ProfileRepository.update_profile_image(profile, relative_path)
    return 200, profile


@router.delete(
    "/{org_id}/profile/image",
    auth=JWTAuth(),
    response={200: MessageSchema, 404: ErrorSchema},
)
def delete_profile_image(request, org_id: int):
    """프로필 이미지 삭제"""
    organization = OrganizationRepository.get_by_id(org_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    membership = OrganizationRepository.get_membership(request.auth, organization)
    if not membership:
        return 404, {"detail": "멤버십을 찾을 수 없습니다."}

    profile = ProfileRepository.get_or_create_for_membership(membership)
    ProfileRepository.update_profile_image(profile, "")
    return 200, {"message": "프로필 이미지가 삭제되었습니다."}
