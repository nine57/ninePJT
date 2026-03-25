from types import SimpleNamespace

from django.contrib.auth import authenticate
from ninja import Router

from apis.auth import JWTAuth, create_access_token, create_refresh_token, verify_refresh_token
from apis.schemas.base import ErrorSchema, MessageSchema
from apis.schemas.requests.users import LoginRequest, NicknameUpdateRequest, SignUpRequest, TokenRefreshRequest
from apis.schemas.responses.users import (
    LoginResponse,
    MeResponse,
    TokenRefreshResponse,
    UserResponse,
)
from integrations.slack.notifications import send_signup_notification
from repositories import UserRepository

router = Router(tags=["Auth"])


@router.post("/signup", response={201: UserResponse, 400: ErrorSchema})
def signup(request, payload: SignUpRequest):
    username = (payload.username or "").strip()
    password = payload.password or ""
    email = (payload.email or "").strip()

    if not username or not password:
        return 400, {"detail": "username과 password는 필수입니다."}

    if UserRepository.exists_by_username(username):
        return 400, {"detail": "이미 존재하는 사용자명입니다."}

    user = UserRepository.create(username=username, password=password, email=email)
    send_signup_notification(username=username, email=email)
    return 201, user


@router.post("/login", response={200: LoginResponse, 400: ErrorSchema, 401: ErrorSchema})
def login(request, payload: LoginRequest):
    username = (payload.username or "").strip()
    password = payload.password or ""

    if not username or not password:
        return 400, {"detail": "username과 password는 필수입니다."}

    user = authenticate(request, username=username, password=password)
    if user is None:
        return 401, {"detail": "자격 증명이 올바르지 않습니다."}

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return 200, SimpleNamespace(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name or "",
        access=access_token,
        refresh=refresh_token,
    )


@router.post("/logout", auth=JWTAuth(), response={200: MessageSchema})
def logout(request):
    return 200, {"detail": "로그아웃 되었습니다. 클라이언트에서 토큰을 삭제해주세요."}


@router.get("/me", auth=JWTAuth(), response={200: MeResponse, 401: ErrorSchema})
def me(request):
    return 200, request.auth


@router.patch("/me", auth=JWTAuth(), response={200: MeResponse, 400: ErrorSchema})
def update_me(request, payload: NicknameUpdateRequest):
    """내 닉네임(표시 이름) 변경"""
    nickname = (payload.nickname or "").strip()
    if not nickname or len(nickname) < 2 or len(nickname) > 20:
        return 400, {"detail": "닉네임은 2~20자여야 합니다."}

    user = request.auth
    user.first_name = nickname
    user.save(update_fields=["first_name"])
    return 200, user


@router.post("/refresh", response={200: TokenRefreshResponse, 400: ErrorSchema})
def token_refresh(request, payload: TokenRefreshRequest):
    refresh_token = payload.refresh

    if not refresh_token:
        return 400, {"detail": "refresh 토큰이 필요합니다."}

    user_id = verify_refresh_token(refresh_token)
    if user_id is None:
        return 400, {"detail": "유효하지 않은 토큰입니다."}

    access_token = create_access_token(user_id)
    return 200, {"access": access_token}
