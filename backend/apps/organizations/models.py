import secrets

from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.base import AbstractBaseModel
from apps.users.models import Profile

User = get_user_model()


def generate_invitation_code():
    """8자리 영숫자 초대 코드 생성"""
    return secrets.token_urlsafe(6)[:8].upper()


class Organization(AbstractBaseModel):
    name = models.CharField(
        max_length=100,
        verbose_name=_("조직명"),
        help_text=_("조직 또는 모임의 이름")
    )
    description = models.TextField(
        blank=True,
        verbose_name=_("설명"),
        help_text=_("조직에 대한 상세 설명")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("활성화 여부")
    )

    class Meta:
        verbose_name = _("조직")
        verbose_name_plural = _("조직")


class OrganizationMembership(AbstractBaseModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name=_("사용자"),
        related_name="organization_memberships"
    )
    profile = models.ForeignKey(
        Profile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="organization_memberships",
        verbose_name=_("사용자 프로필"),
        help_text=_("해당 조직에서 사용하는 사용자 프로필")
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        verbose_name=_("조직"),
        related_name="memberships"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("활성 멤버 여부")
    )

    class Meta:
        verbose_name = _("조직 멤버")
        verbose_name_plural = _("조직 멤버")
        unique_together = ["user", "organization"]


class OrganizationInvitation(AbstractBaseModel):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="invitations",
        verbose_name=_("조직")
    )
    code = models.CharField(
        max_length=8,
        unique=True,
        default=generate_invitation_code,
        verbose_name=_("초대 코드")
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_invitations",
        verbose_name=_("생성자")
    )
    expires_at = models.DateTimeField(
        verbose_name=_("만료일"),
        help_text=_("초대 코드 만료 시간")
    )
    max_uses = models.PositiveIntegerField(
        default=0,
        verbose_name=_("최대 사용 횟수"),
        help_text=_("0 = 무제한")
    )
    use_count = models.PositiveIntegerField(
        default=0,
        verbose_name=_("사용 횟수")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("활성화 여부")
    )

    class Meta:
        verbose_name = _("조직 초대")
        verbose_name_plural = _("조직 초대")

    def is_valid(self):
        """초대 코드가 유효한지 확인"""
        if not self.is_active or self.is_deleted:
            return False
        if timezone.now() > self.expires_at:
            return False
        if self.max_uses > 0 and self.use_count >= self.max_uses:
            return False
        return True
