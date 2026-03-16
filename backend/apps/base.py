from django.db import models
from django.utils.translation import gettext_lazy as _


class AbstractBaseModel(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("생성일시")
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("수정일시")
    )
    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("삭제일시")
    )
    is_deleted = models.BooleanField(
        default=False,
        verbose_name=_("삭제 여부")
    )

    class Meta:
        abstract = True
