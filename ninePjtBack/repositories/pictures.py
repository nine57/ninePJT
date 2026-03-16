from typing import Optional

from django.db import models
from django.db.models import Count
from django.utils import timezone

from apps.organizations.models import Organization
from apps.pictures.models import Album, Picture


class AlbumRepository:
    @staticmethod
    def get_by_id(pk: int) -> Optional[Album]:
        try:
            return Album.objects.get(pk=pk, is_deleted=False)
        except Album.DoesNotExist:
            return None

    @staticmethod
    def get_by_organization(organization_id: int) -> list[Album]:
        return list(
            Album.objects.filter(organization_id=organization_id, is_deleted=False)
            .annotate(
                picture_count=Count(
                    "pictures", filter=models.Q(pictures__is_deleted=False)
                )
            )
            .order_by("-created_at")
        )

    @staticmethod
    def create(
        organization: Organization,
        name: str,
        description: str = "",
    ) -> Album:
        return Album.objects.create(
            organization=organization,
            name=name,
            description=description,
        )

    @staticmethod
    def update(
        album: Album,
        name: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Album:
        if name is not None:
            album.name = name
        if description is not None:
            album.description = description
        album.save()
        return album

    @staticmethod
    def soft_delete(album: Album) -> Album:
        album.is_deleted = True
        album.deleted_at = timezone.now()
        album.save()
        return album


class PictureRepository:
    @staticmethod
    def get_list(
        organization_id: Optional[int] = None,
        album_id: Optional[int] = None,
    ) -> list[Picture]:
        qs = Picture.objects.select_related("organization", "album").filter(
            is_deleted=False
        )

        if organization_id:
            qs = qs.filter(organization_id=organization_id)
        if album_id:
            qs = qs.filter(album_id=album_id)

        return list(qs.order_by("-created_at"))

    @staticmethod
    def get_by_id(pk: int) -> Optional[Picture]:
        try:
            return Picture.objects.select_related("organization", "album").get(
                pk=pk, is_deleted=False
            )
        except Picture.DoesNotExist:
            return None

    @staticmethod
    def create(
        organization: Organization,
        file_path: str,
        album: Optional[Album] = None,
        caption: str = "",
    ) -> Picture:
        return Picture.objects.create(
            organization=organization,
            album=album,
            file_path=file_path,
            caption=caption,
        )

    @staticmethod
    def update(
        picture: Picture,
        caption: Optional[str] = None,
        album: Optional[Album] = None,
    ) -> Picture:
        if caption is not None:
            picture.caption = caption
        if album is not None:
            picture.album = album
        picture.save()
        return picture

    @staticmethod
    def soft_delete(picture: Picture) -> Picture:
        picture.is_deleted = True
        picture.deleted_at = timezone.now()
        picture.save()
        return picture
