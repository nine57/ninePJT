from typing import Optional

from ninja import Router

from apis.auth import JWTAuth
from apis.schemas.base import ErrorSchema, MessageSchema
from apis.schemas.requests.posts import PostCreateRequest, PostUpdateRequest
from apis.schemas.responses.posts import HashTagResponse, PostResponse
from repositories import HashTagRepository, OrganizationRepository, PostRepository

router = Router(tags=["Posts"])


@router.get("", auth=JWTAuth(), response=list[PostResponse])
def list_posts(
    request,
    organization: Optional[int] = None,
    is_notice: Optional[bool] = None,
):
    return PostRepository.get_list(
        organization_id=organization,
        is_notice=is_notice,
    )


@router.post("", auth=JWTAuth(), response={201: PostResponse, 400: ErrorSchema, 404: ErrorSchema})
def create_post(request, organization: int, payload: PostCreateRequest):
    user = request.auth
    title = (payload.title or "").strip()
    content = (payload.content or "").strip()

    if not title or not content:
        return 400, {"detail": "title과 content는 필수입니다."}

    org = OrganizationRepository.get_by_id(organization)
    if not org:
        return 404, {"detail": "조직을 찾을 수 없습니다."}

    post = PostRepository.create(
        organization=org,
        author=user,
        title=title,
        content=content,
        is_notice=bool(payload.is_notice),
        is_pinned=bool(payload.is_pinned),
        hashtag_names=payload.hashtags,
    )
    return 201, post


@router.get("/{pk}", auth=JWTAuth(), response={200: PostResponse, 404: ErrorSchema})
def get_post(request, pk: int):
    post = PostRepository.get_by_id(pk)
    if not post:
        return 404, {"detail": "게시글을 찾을 수 없습니다."}
    return 200, post


@router.patch("/{pk}", auth=JWTAuth(), response={200: PostResponse, 404: ErrorSchema})
def update_post(request, pk: int, payload: PostUpdateRequest):
    post = PostRepository.get_by_id(pk)
    if not post:
        return 404, {"detail": "게시글을 찾을 수 없습니다."}

    post = PostRepository.update(
        post=post,
        title=payload.title,
        content=payload.content,
        is_notice=payload.is_notice,
        is_pinned=payload.is_pinned,
        hashtag_names=payload.hashtags,
    )
    return 200, post


@router.delete("/{pk}", auth=JWTAuth(), response={200: MessageSchema, 404: ErrorSchema})
def delete_post(request, pk: int):
    post = PostRepository.get_by_id(pk)
    if not post:
        return 404, {"detail": "게시글을 찾을 수 없습니다."}

    PostRepository.soft_delete(post)
    return 200, {"message": "게시글이 삭제되었습니다."}


@router.get("/hashtags/list", auth=JWTAuth(), response=list[HashTagResponse])
def list_hashtags(request):
    return HashTagRepository.get_list()
