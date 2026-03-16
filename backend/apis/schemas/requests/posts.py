from typing import Optional

from ninja import Schema


class PostCreateRequest(Schema):
    """게시글 생성 요청"""

    title: str
    content: str
    is_notice: bool = False
    is_pinned: bool = False
    hashtags: Optional[list[str]] = None


class PostUpdateRequest(Schema):
    """게시글 수정 요청"""

    title: Optional[str] = None
    content: Optional[str] = None
    is_notice: Optional[bool] = None
    is_pinned: Optional[bool] = None
    hashtags: Optional[list[str]] = None
