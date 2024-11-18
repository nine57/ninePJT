from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class User(PermissionsMixin, AbstractBaseUser):
    created_at = models.DateTimeField()
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "username"
