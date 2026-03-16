from ninja import Router

from apis.auth import JWTAuth
from apis.schemas.base import ErrorSchema, MessageSchema
from apis.schemas.requests.pictures import AlbumCreateRequest, AlbumUpdateRequest
from apis.schemas.responses.pictures import AlbumDetailResponse, AlbumResponse
from repositories import AlbumRepository, OrganizationRepository

router = Router(tags=["Albums"])


@router.get(
    "/{org_id}/albums",
    auth=JWTAuth(),
    response=list[AlbumResponse],
)
def list_albums(request, org_id: int):
    """조직의 앨범 목록 조회"""
    return AlbumRepository.get_by_organization(org_id)


@router.post(
    "/{org_id}/albums",
    auth=JWTAuth(),
    response={201: AlbumDetailResponse, 400: ErrorSchema, 404: ErrorSchema},
)
def create_album(request, org_id: int, payload: AlbumCreateRequest):
    """앨범 생성"""
    organization = OrganizationRepository.get_by_id(org_id)
    if not organization:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    name = (payload.name or "").strip()
    if not name:
        return 400, {"detail": "앨범 이름은 필수입니다."}

    album = AlbumRepository.create(
        organization=organization,
        name=name,
        description=payload.description or "",
    )
    return 201, album


@router.get(
    "/{org_id}/albums/{album_id}",
    auth=JWTAuth(),
    response={200: AlbumDetailResponse, 404: ErrorSchema},
)
def get_album(request, org_id: int, album_id: int):
    """앨범 상세 조회"""
    album = AlbumRepository.get_by_id(album_id)
    if not album or album.organization_id != org_id:
        return 404, {"detail": "앨범을 찾을 수 없습니다."}
    return 200, album


@router.patch(
    "/{org_id}/albums/{album_id}",
    auth=JWTAuth(),
    response={200: AlbumDetailResponse, 404: ErrorSchema},
)
def update_album(request, org_id: int, album_id: int, payload: AlbumUpdateRequest):
    """앨범 수정"""
    album = AlbumRepository.get_by_id(album_id)
    if not album or album.organization_id != org_id:
        return 404, {"detail": "앨범을 찾을 수 없습니다."}

    album = AlbumRepository.update(
        album=album,
        name=payload.name,
        description=payload.description,
    )
    return 200, album


@router.delete(
    "/{org_id}/albums/{album_id}",
    auth=JWTAuth(),
    response={200: MessageSchema, 404: ErrorSchema},
)
def delete_album(request, org_id: int, album_id: int):
    """앨범 삭제"""
    album = AlbumRepository.get_by_id(album_id)
    if not album or album.organization_id != org_id:
        return 404, {"detail": "앨범을 찾을 수 없습니다."}

    AlbumRepository.soft_delete(album)
    return 200, {"message": "앨범이 삭제되었습니다."}
