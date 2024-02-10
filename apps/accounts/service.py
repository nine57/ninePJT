from typing import Union
from django.http.request import QueryDict
from django.utils import timezone

from apps.accounts.models import User


def create_user(request_body: Union[QueryDict, dict]):
    time_now = timezone.now()
    username = User.normalize_username(request_body.get("username"))
    user = User(
        created_at=time_now,
        name=request_body.get("name"),
        username=username,
    )
    user.set_password(request_body.get("password"))
    user.save()


def update_login_success_user(user: User):
    user.last_login = timezone.now()
    user.save()
