from datetime import datetime

from ninja import Schema


class OrganizationResponse(Schema):
    id: int
    name: str
    description: str

    class Config:
        from_attributes = True


class OrganizationDetailResponse(Schema):
    id: int
    name: str
    description: str
    member_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class MemberResponse(Schema):
    id: int
    user_id: int
    username: str
    display_name: str
    nickname: str
    name: str
    profile_image_url: str
    joined_at: datetime

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_user_id(obj):
        return obj.user.id

    @staticmethod
    def resolve_username(obj):
        return obj.user.username

    @staticmethod
    def resolve_display_name(obj):
        """닉네임 → 이름 → 아이디 fallback"""
        if obj.profile and not obj.profile.is_deleted and obj.profile.nickname:
            return obj.profile.nickname
        if obj.user.first_name:
            return obj.user.first_name
        return obj.user.username

    @staticmethod
    def resolve_nickname(obj):
        if obj.profile and not obj.profile.is_deleted:
            return obj.profile.nickname or ""
        return ""

    @staticmethod
    def resolve_name(obj):
        return obj.user.first_name or ""

    @staticmethod
    def resolve_profile_image_url(obj):
        from django.conf import settings

        if obj.profile and not obj.profile.is_deleted and obj.profile.profile_image:
            return f"{settings.MEDIA_STORAGE_URL}{obj.profile.profile_image}"
        return ""

    @staticmethod
    def resolve_joined_at(obj):
        return obj.created_at


class InvitationResponse(Schema):
    id: int
    code: str
    expires_at: datetime
    max_uses: int
    use_count: int
    is_active: bool

    class Config:
        from_attributes = True
