from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.base import AbstractBaseModel


class User(AbstractBaseModel, AbstractUser):
    
    objects = BaseUserManager()
    
    class Meta:
        verbose_name = _("사용자")
        verbose_name_plural = _("사용자")


class Profile(AbstractBaseModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name=_("사용자")
    )
    nickname = models.CharField(
        max_length=20,
        blank=True,
        default="",
        verbose_name=_("닉네임"),
    )
    profile_image = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name=_("프로필 이미지"),
    )

    class Meta:
        verbose_name = _("사용자 프로필")
        verbose_name_plural = _("사용자 프로필")
