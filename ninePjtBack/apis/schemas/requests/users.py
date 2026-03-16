from typing import Optional

from ninja import Schema


class SignUpRequest(Schema):
    """회원가입 요청"""

    username: str
    password: str
    name: str
    email: Optional[str] = None


class LoginRequest(Schema):
    """로그인 요청"""

    username: str
    password: str


class TokenRefreshRequest(Schema):
    """토큰 갱신 요청"""

    refresh: str


class NicknameUpdateRequest(Schema):
    """닉네임 변경 요청"""

    nickname: str
