from ninja import Schema


class UserResponse(Schema):
    id: int
    username: str
    email: str
    name: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_name(obj) -> str:
        return getattr(obj, "first_name", "") or ""


class LoginResponse(Schema):
    id: int
    username: str
    email: str
    name: str
    access: str
    refresh: str

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_name(obj) -> str:
        return getattr(obj, "first_name", "") or ""


class MeResponse(Schema):
    id: int
    username: str
    email: str
    name: str
    is_staff: bool
    is_superuser: bool

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_name(obj) -> str:
        return getattr(obj, "first_name", "") or ""


class TokenRefreshResponse(Schema):
    access: str


class ProfileResponse(Schema):
    nickname: str
    profile_image_url: str

    @staticmethod
    def resolve_profile_image_url(obj) -> str:
        from django.conf import settings

        if obj.profile_image:
            return f"{settings.MEDIA_STORAGE_URL}{obj.profile_image}"
        return ""
