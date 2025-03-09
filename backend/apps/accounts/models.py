from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, PermissionsMixin
from django.db import models


class User(PermissionsMixin, AbstractBaseUser):
    created_at = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class UserManager(BaseUserManager):
        def get_by_natural_key(self, username):
            return self.get(username=username)

    objects = UserManager()

    USERNAME_FIELD = "username"


class UserType(models.Model):
    code = models.CharField(max_length=150)
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=150, blank=True, null=True)


class UserTypeAssignment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_type = models.ForeignKey(UserType, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "user_type")
