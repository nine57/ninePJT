from typing import Optional

from django.contrib.auth import get_user_model

from apps.users.models import Profile

User = get_user_model()


class UserRepository:
    @staticmethod
    def exists_by_username(username: str) -> bool:
        return User.objects.filter(username=username, is_deleted=False).exists()

    @staticmethod
    def create(
        username: str,
        password: str,
        email: str = "",
        name: str = "",
    ):
        user = User(username=username, email=email, first_name=name)
        user.set_password(password)
        user.save()
        return user

    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        try:
            return User.objects.get(id=user_id, is_deleted=False)
        except User.DoesNotExist:
            return None


class ProfileRepository:
    @staticmethod
    def create(user, nickname: str = "") -> Profile:
        return Profile.objects.create(user=user, nickname=nickname)

    @staticmethod
    def get_or_create_for_membership(membership) -> Profile:
        """멤버십에 연결된 프로필 조회/생성"""
        if membership.profile and not membership.profile.is_deleted:
            return membership.profile
        profile = Profile.objects.create(user=membership.user)
        membership.profile = profile
        membership.save()
        return profile

    @staticmethod
    def get_by_membership(membership) -> Optional[Profile]:
        """멤버십에 연결된 프로필 조회"""
        if membership.profile_id and not getattr(membership.profile, "is_deleted", True):
            return membership.profile
        return None

    @staticmethod
    def update_nickname(profile: Profile, nickname: str) -> Profile:
        profile.nickname = nickname
        profile.save()
        return profile

    @staticmethod
    def update_profile_image(profile: Profile, file_path: str) -> Profile:
        profile.profile_image = file_path
        profile.save()
        return profile
