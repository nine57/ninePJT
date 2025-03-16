from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def get_by_natural_key(self, username):
        return self.get(username=username)

    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username field must be set")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, password, **extra_fields)


class User(PermissionsMixin, AbstractBaseUser):
    created_at = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

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
