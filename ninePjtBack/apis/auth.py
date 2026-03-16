from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from ninja.security import HttpBearer


class JWTAuth(HttpBearer):
    """JWT Bearer 토큰 인증 클래스"""

    def __call__(self, request):
        # 개발 환경 인증 우회 (토큰 없이도 통과)
        if getattr(settings, "DEV_AUTH_BYPASS", False):
            return self._get_dev_user()
        return super().__call__(request)

    def authenticate(self, request, token: str):
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"],
            )
            # access 토큰인지 확인
            if payload.get("type") != "access":
                return None
            user_id = payload.get("user_id")
            if not user_id:
                return None
            User = get_user_model()
            user = User.objects.get(id=user_id)
            return user
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        except get_user_model().DoesNotExist:
            return None

    def _get_dev_user(self):
        """개발 환경에서 사용할 테스트 사용자 반환"""
        User = get_user_model()
        dev_user_id = getattr(settings, "DEV_AUTH_USER_ID", None)

        try:
            if dev_user_id:
                return User.objects.get(id=dev_user_id)
            # 첫 번째 사용자 반환
            return User.objects.first()
        except User.DoesNotExist:
            return None


def create_access_token(user_id: int) -> str:
    """Access Token 생성 (1시간 유효)"""
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def create_refresh_token(user_id: int) -> str:
    """Refresh Token 생성 (7일 유효)"""
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "iat": datetime.now(timezone.utc),
        "type": "refresh",
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def verify_refresh_token(token: str) -> int | None:
    """Refresh Token 검증 및 user_id 반환"""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"],
        )
        if payload.get("type") != "refresh":
            return None
        return payload.get("user_id")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
