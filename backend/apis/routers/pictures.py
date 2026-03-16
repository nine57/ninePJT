import os
import uuid
from typing import Optional

from django.conf import settings
from ninja import File, Router, UploadedFile

from apis.auth import JWTAuth
from apis.schemas.base import ErrorSchema, MessageSchema
from apis.schemas.requests.pictures import PictureCreateRequest, PictureUpdateRequest
from apis.schemas.responses.pictures import PictureResponse
from repositories import AlbumRepository, OrganizationRepository, PictureRepository

router = Router(tags=["Pictures"])


@router.get("", auth=JWTAuth(), response=list[PictureResponse])
def list_pictures(
    request,
    organization: Optional[int] = None,
    album: Optional[int] = None,
):
    return PictureRepository.get_list(
        organization_id=organization,
        album_id=album,
    )


@router.post("", auth=JWTAuth(), response={201: PictureResponse, 400: ErrorSchema})
def create_picture(request, payload: PictureCreateRequest):
    organization_id = payload.organization
    file_path = (payload.file_path or "").strip()
    caption = (payload.caption or "").strip()
    album_id = payload.album

    if not organization_id or not file_path:
        return 400, {"detail": "organization, file_path는 필수입니다."}

    organization = OrganizationRepository.get_by_id(organization_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    album = None
    if album_id:
        album = AlbumRepository.get_by_id(album_id)
        if not album:
            return 404, {"detail": "앨범을 찾을 수 없습니다."}
        if album.organization_id != organization.id:
            return 400, {"detail": "앨범과 조직이 일치하지 않습니다."}

    picture = PictureRepository.create(
        organization=organization,
        file_path=file_path,
        album=album,
        caption=caption,
    )
    return 201, picture


@router.post("/upload", auth=JWTAuth(), response={201: PictureResponse, 400: ErrorSchema})
def upload_picture(
    request,
    organization: int,
    image: UploadedFile = File(...),
    album: Optional[int] = None,
    caption: Optional[str] = None,
):
    """이미지 파일 업로드"""
    if not image:
        return 400, {"detail": "image 파일이 필요합니다."}

    org = OrganizationRepository.get_by_id(organization)
    if not org:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    album_obj = None
    if album:
        album_obj = AlbumRepository.get_by_id(album)
        if not album_obj:
            return 404, {"detail": "앨범을 찾을 수 없습니다."}
        if album_obj.organization_id != org.id:
            return 400, {"detail": "앨범과 조직이 일치하지 않습니다."}

    file_ext = os.path.splitext(image.name)[1] or ".jpg"
    allowed_exts = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    if file_ext.lower() not in allowed_exts:
        return 400, {"detail": f"지원하지 않는 파일 형식입니다: {file_ext}"}

    file_name = f"{uuid.uuid4()}{file_ext}"
    upload_dir = os.path.join(settings.BASE_DIR, "media", "pictures")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file_name)

    try:
        with open(file_path, "wb") as f:
            for chunk in image.chunks():
                f.write(chunk)
    except Exception as e:
        return 400, {"detail": f"파일 저장 실패: {str(e)}"}

    relative_path = f"pictures/{file_name}"

    picture = PictureRepository.create(
        organization=org,
        file_path=relative_path,
        album=album_obj,
        caption=(caption or "").strip(),
    )
    return 201, picture


@router.get("/{pk}", auth=JWTAuth(), response={200: PictureResponse, 404: ErrorSchema})
def get_picture(request, pk: int):
    picture = PictureRepository.get_by_id(pk)
    if not picture:
        return 404, {"detail": "사진을 찾을 수 없습니다."}
    return 200, picture


@router.patch("/{pk}", auth=JWTAuth(), response={200: PictureResponse, 404: ErrorSchema})
def update_picture(request, pk: int, payload: PictureUpdateRequest):
    """사진 수정"""
    picture = PictureRepository.get_by_id(pk)
    if not picture:
        return 404, {"detail": "사진을 찾을 수 없습니다."}

    album_obj = None
    if payload.album is not None:
        if payload.album > 0:
            album_obj = AlbumRepository.get_by_id(payload.album)
            if not album_obj:
                return 404, {"detail": "앨범을 찾을 수 없습니다."}

    picture = PictureRepository.update(
        picture=picture,
        caption=payload.caption,
        album=album_obj,
    )
    return 200, picture


@router.delete("/{pk}", auth=JWTAuth(), response={200: MessageSchema, 404: ErrorSchema})
def delete_picture(request, pk: int):
    """사진 삭제"""
    picture = PictureRepository.get_by_id(pk)
    if not picture:
        return 404, {"detail": "사진을 찾을 수 없습니다."}

    PictureRepository.soft_delete(picture)
    return 200, {"message": "사진이 삭제되었습니다."}
