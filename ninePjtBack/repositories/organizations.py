from datetime import timedelta
from typing import Optional

from django.db import transaction
from django.utils import timezone

from apps.organizations.models import (
    Organization,
    OrganizationInvitation,
    OrganizationMembership,
)
from apps.users.models import Profile


class OrganizationRepository:
    # ============ 조직 관련 ============

    @staticmethod
    def get_by_id(pk: int) -> Optional[Organization]:
        try:
            return Organization.objects.get(pk=pk, is_deleted=False)
        except Organization.DoesNotExist:
            return None

    @staticmethod
    def get_user_organizations(user) -> list[Organization]:
        memberships = (
            OrganizationMembership.objects.select_related("organization")
            .filter(
                user=user,
                is_active=True,
                is_deleted=False,
                organization__is_active=True,
                organization__is_deleted=False,
            )
            .order_by("organization_id")
        )
        return [m.organization for m in memberships]

    @staticmethod
    @transaction.atomic
    def create(name: str, description: str, creator) -> Organization:
        """조직 생성 및 생성자를 멤버로 추가"""
        organization = Organization.objects.create(
            name=name,
            description=description,
        )
        profile = Profile.objects.create(user=creator)
        OrganizationMembership.objects.create(
            user=creator,
            organization=organization,
            profile=profile,
        )
        return organization

    @staticmethod
    def update(organization: Organization, name: Optional[str] = None, description: Optional[str] = None) -> Organization:
        """조직 정보 수정"""
        if name is not None:
            organization.name = name
        if description is not None:
            organization.description = description
        organization.save()
        return organization

    @staticmethod
    def soft_delete(organization: Organization) -> None:
        """조직 소프트 삭제"""
        organization.is_deleted = True
        organization.deleted_at = timezone.now()
        organization.save()

    # ============ 멤버 관련 ============

    @staticmethod
    def get_members(organization: Organization) -> list[OrganizationMembership]:
        """조직의 멤버 목록 조회"""
        return list(
            OrganizationMembership.objects.select_related("user", "profile")
            .filter(
                organization=organization,
                is_active=True,
                is_deleted=False,
            )
            .order_by("created_at")
        )

    @staticmethod
    def get_membership(user, organization: Organization) -> Optional[OrganizationMembership]:
        """특정 사용자의 멤버십 조회"""
        try:
            return OrganizationMembership.objects.get(
                user=user,
                organization=organization,
                is_deleted=False,
            )
        except OrganizationMembership.DoesNotExist:
            return None

    @staticmethod
    def get_membership_by_id(membership_id: int) -> Optional[OrganizationMembership]:
        """멤버십 ID로 조회"""
        try:
            return OrganizationMembership.objects.select_related("user", "organization").get(
                pk=membership_id,
                is_deleted=False,
            )
        except OrganizationMembership.DoesNotExist:
            return None

    @staticmethod
    def add_member(organization: Organization, user) -> OrganizationMembership:
        """멤버 추가"""
        membership, created = OrganizationMembership.objects.get_or_create(
            user=user,
            organization=organization,
            defaults={"is_active": True},
        )
        if created:
            profile = Profile.objects.create(user=user)
            membership.profile = profile
            membership.save()
        elif not membership.is_active:
            membership.is_active = True
            membership.is_deleted = False
            membership.deleted_at = None
            if not membership.profile_id:
                profile = Profile.objects.create(user=user)
                membership.profile = profile
            membership.save()
        return membership

    @staticmethod
    def remove_member(membership: OrganizationMembership) -> None:
        """멤버 제거 (소프트 삭제)"""
        membership.is_active = False
        membership.is_deleted = True
        membership.deleted_at = timezone.now()
        membership.save()

    @staticmethod
    def get_member_count(organization: Organization) -> int:
        """조직 멤버 수 조회"""
        return OrganizationMembership.objects.filter(
            organization=organization,
            is_active=True,
            is_deleted=False,
        ).count()


class OrganizationInvitationRepository:
    @staticmethod
    def create(
        organization: Organization,
        created_by,
        expires_hours: int = 24,
        max_uses: int = 0,
    ) -> OrganizationInvitation:
        """초대 코드 생성"""
        expires_at = timezone.now() + timedelta(hours=expires_hours)
        return OrganizationInvitation.objects.create(
            organization=organization,
            created_by=created_by,
            expires_at=expires_at,
            max_uses=max_uses,
        )

    @staticmethod
    def get_by_code(code: str) -> Optional[OrganizationInvitation]:
        """코드로 초대 조회"""
        try:
            return OrganizationInvitation.objects.select_related("organization").get(
                code=code.upper(),
                is_deleted=False,
            )
        except OrganizationInvitation.DoesNotExist:
            return None

    @staticmethod
    def get_by_id(pk: int) -> Optional[OrganizationInvitation]:
        """ID로 초대 조회"""
        try:
            return OrganizationInvitation.objects.get(pk=pk, is_deleted=False)
        except OrganizationInvitation.DoesNotExist:
            return None

    @staticmethod
    def get_organization_invitations(organization: Organization) -> list[OrganizationInvitation]:
        """조직의 초대 코드 목록"""
        return list(
            OrganizationInvitation.objects.filter(
                organization=organization,
                is_active=True,
                is_deleted=False,
            ).order_by("-created_at")
        )

    @staticmethod
    @transaction.atomic
    def use_invitation(invitation: OrganizationInvitation, user) -> Optional[OrganizationMembership]:
        """초대 코드 사용 (멤버 추가 + use_count 증가)"""
        if not invitation.is_valid():
            return None

        # 이미 멤버인지 확인
        existing = OrganizationRepository.get_membership(user, invitation.organization)
        if existing and existing.is_active:
            return existing

        # 멤버 추가
        membership = OrganizationRepository.add_member(invitation.organization, user)

        # use_count 증가
        invitation.use_count += 1
        invitation.save()

        return membership

    @staticmethod
    def deactivate(invitation: OrganizationInvitation) -> None:
        """초대 코드 비활성화"""
        invitation.is_active = False
        invitation.save()
