from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.base import AbstractBaseModel
from apps.organizations.models import Organization

User = get_user_model()


class Album(AbstractBaseModel):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="albums",
        verbose_name=_("조직"),
    )
    name = models.CharField(max_length=120, verbose_name=_("앨범명"))
    description = models.TextField(blank=True, verbose_name=_("설명"))
    is_active = models.BooleanField(default=True, verbose_name=_("활성화 여부"))

    class Meta:
        verbose_name = _("앨범")
        verbose_name_plural = _("앨범")

    def __str__(self) -> str:
        return self.name


class Picture(AbstractBaseModel):
    album = models.ForeignKey(
        Album,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="pictures",
        verbose_name=_("앨범"),
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="pictures",
        verbose_name=_("조직"),
    )
    file_path = models.CharField(max_length=255, verbose_name=_("파일 경로"))
    caption = models.TextField(blank=True, verbose_name=_("설명"))

    class Meta:
        verbose_name = _("사진")
        verbose_name_plural = _("사진")

    def __str__(self) -> str:
        return self.file_path
