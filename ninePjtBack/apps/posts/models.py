from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.base import AbstractBaseModel
from apps.organizations.models import Organization

User = get_user_model()


class HashTag(AbstractBaseModel):
    name = models.CharField(
        max_length=50,
        unique=True,
        verbose_name=_("해시태그")
    )

    class Meta:
        verbose_name = _("해시태그")
        verbose_name_plural = _("해시태그")

    def __str__(self) -> str:
        return f"#{self.name}"


class Post(AbstractBaseModel):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="posts",
        verbose_name=_("조직"),
        null=True,
        blank=True,
    )
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts",
        verbose_name=_("작성자"),
    )
    title = models.CharField(
        max_length=200,
        verbose_name=_("제목")
    )
    content = models.TextField(
        verbose_name=_("글 내용")
    )
    is_notice = models.BooleanField(
        default=False,
        verbose_name=_("공지 여부")
    )
    is_pinned = models.BooleanField(
        default=False,
        verbose_name=_("상단 고정")
    )

    class Meta:
        verbose_name = _("게시글")
        verbose_name_plural = _("게시글")

    def __str__(self) -> str:
        return self.title


class PostHashTag(AbstractBaseModel):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="hashtags",
        verbose_name=_("게시글")
    )
    hashtag = models.ForeignKey(
        HashTag,
        on_delete=models.CASCADE,
        related_name="posts",
        verbose_name=_("해시태그")
    )

    class Meta:
        verbose_name = _("게시글 해시태그")
        verbose_name_plural = _("게시글 해시태그")
