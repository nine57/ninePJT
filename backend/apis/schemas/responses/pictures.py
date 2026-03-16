from typing import Optional

from django.conf import settings
from ninja import Schema


class PictureResponse(Schema):
    id: int
    organization: int
    album: Optional[int]
    album_name: Optional[str]
    file_url: str
    caption: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_organization(obj) -> int:
        return obj.organization_id

    @staticmethod
    def resolve_album(obj) -> Optional[int]:
        return obj.album_id

    @staticmethod
    def resolve_album_name(obj) -> Optional[str]:
        return obj.album.name if obj.album else None

    @staticmethod
    def resolve_file_url(obj) -> str:
        base_url = settings.MEDIA_STORAGE_URL.rstrip("/")
        return f"{base_url}/{obj.file_path}"

    @staticmethod
    def resolve_caption(obj) -> str:
        return obj.caption or ""

    @staticmethod
    def resolve_created_at(obj) -> str:
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj) -> str:
        return obj.updated_at.isoformat()


class AlbumResponse(Schema):
    """앨범 목록 응답"""

    id: int
    name: str
    description: str
    picture_count: int
    created_at: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_description(obj) -> str:
        return obj.description or ""

    @staticmethod
    def resolve_picture_count(obj) -> int:
        return getattr(obj, "picture_count", 0) or 0

    @staticmethod
    def resolve_created_at(obj) -> str:
        return obj.created_at.isoformat()


class AlbumDetailResponse(Schema):
    """앨범 상세 응답"""

    id: int
    name: str
    description: str
    organization_id: int
    is_active: bool
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_description(obj) -> str:
        return obj.description or ""

    @staticmethod
    def resolve_organization_id(obj) -> int:
        return obj.organization_id

    @staticmethod
    def resolve_created_at(obj) -> str:
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj) -> str:
        return obj.updated_at.isoformat()
