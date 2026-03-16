from typing import Optional

from ninja import Schema


class HashTagResponse(Schema):
    id: int
    name: str

    class Config:
        from_attributes = True


class PostResponse(Schema):
    id: int
    organization_id: Optional[int]
    author_id: Optional[int]
    author_username: Optional[str]
    title: str
    content: str
    is_notice: bool
    is_pinned: bool
    hashtags: list[HashTagResponse]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_organization_id(obj) -> Optional[int]:
        return obj.organization_id

    @staticmethod
    def resolve_author_id(obj) -> Optional[int]:
        return obj.author_id

    @staticmethod
    def resolve_author_username(obj) -> Optional[str]:
        return obj.author.username if obj.author else None

    @staticmethod
    def resolve_hashtags(obj) -> list[dict]:
        return [
            {"id": pht.hashtag.id, "name": pht.hashtag.name}
            for pht in obj.hashtags.select_related("hashtag").all()
        ]

    @staticmethod
    def resolve_created_at(obj) -> str:
        return obj.created_at.isoformat()

    @staticmethod
    def resolve_updated_at(obj) -> str:
        return obj.updated_at.isoformat()
