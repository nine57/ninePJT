from typing import Optional

from django.utils import timezone

from apps.organizations.models import Organization
from apps.posts.models import HashTag, Post, PostHashTag


class HashTagRepository:
    @staticmethod
    def get_by_ids(ids: list[int]) -> list[HashTag]:
        return list(HashTag.objects.filter(id__in=ids, is_deleted=False))

    @staticmethod
    def get_list() -> list[HashTag]:
        return list(HashTag.objects.filter(is_deleted=False).order_by("name"))

    @staticmethod
    def get_or_create(name: str) -> HashTag:
        hashtag, _ = HashTag.objects.get_or_create(
            name=name.lower().strip(),
            defaults={"is_deleted": False},
        )
        return hashtag

    @staticmethod
    def create(name: str) -> HashTag:
        return HashTag.objects.create(name=name.lower().strip())


class PostRepository:
    @staticmethod
    def get_list(
        organization_id: Optional[int] = None,
        is_notice: Optional[bool] = None,
        author_id: Optional[int] = None,
    ) -> list[Post]:
        qs = Post.objects.select_related("organization", "author").prefetch_related(
            "hashtags__hashtag"
        ).filter(is_deleted=False)

        if organization_id:
            qs = qs.filter(organization_id=organization_id)
        if is_notice is not None:
            qs = qs.filter(is_notice=is_notice)
        if author_id:
            qs = qs.filter(author_id=author_id)

        return list(qs.order_by("-is_pinned", "-created_at"))

    @staticmethod
    def get_by_id(pk: int) -> Optional[Post]:
        try:
            return Post.objects.select_related("organization", "author").prefetch_related(
                "hashtags__hashtag"
            ).get(pk=pk, is_deleted=False)
        except Post.DoesNotExist:
            return None

    @staticmethod
    def create(
        organization: Organization,
        author,
        title: str,
        content: str,
        is_notice: bool = False,
        is_pinned: bool = False,
        hashtag_names: Optional[list[str]] = None,
    ) -> Post:
        post = Post.objects.create(
            organization=organization,
            author=author,
            title=title,
            content=content,
            is_notice=is_notice,
            is_pinned=is_pinned,
        )

        if hashtag_names:
            for name in hashtag_names:
                hashtag = HashTagRepository.get_or_create(name)
                PostHashTag.objects.get_or_create(post=post, hashtag=hashtag)

        return Post.objects.select_related("organization", "author").prefetch_related(
            "hashtags__hashtag"
        ).get(pk=post.pk)

    @staticmethod
    def update(
        post: Post,
        title: Optional[str] = None,
        content: Optional[str] = None,
        is_notice: Optional[bool] = None,
        is_pinned: Optional[bool] = None,
        hashtag_names: Optional[list[str]] = None,
    ) -> Post:
        if title is not None:
            post.title = title
        if content is not None:
            post.content = content
        if is_notice is not None:
            post.is_notice = is_notice
        if is_pinned is not None:
            post.is_pinned = is_pinned
        post.save()

        if hashtag_names is not None:
            PostHashTag.objects.filter(post=post).delete()
            for name in hashtag_names:
                hashtag = HashTagRepository.get_or_create(name)
                PostHashTag.objects.get_or_create(post=post, hashtag=hashtag)

        return Post.objects.select_related("organization", "author").prefetch_related(
            "hashtags__hashtag"
        ).get(pk=post.pk)

    @staticmethod
    def soft_delete(post: Post) -> Post:
        post.is_deleted = True
        post.deleted_at = timezone.now()
        post.save()
        return post
