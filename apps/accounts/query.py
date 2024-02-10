from apps.accounts.models import User


def get_user(username: str):
    user = User.objects.filter(username=username).get()
    return user
