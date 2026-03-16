from typing import Optional

from ninja import Schema


class PictureCreateRequest(Schema):
    """사진 생성 요청"""

    organization: int
    file_path: str
    caption: Optional[str] = None
    album: Optional[int] = None


class PictureUpdateRequest(Schema):
    """사진 수정 요청"""

    caption: Optional[str] = None
    album: Optional[int] = None


class AlbumCreateRequest(Schema):
    """앨범 생성 요청"""

    name: str
    description: str = ""


class AlbumUpdateRequest(Schema):
    """앨범 수정 요청"""

    name: Optional[str] = None
    description: Optional[str] = None
