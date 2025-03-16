from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "name", "email", "is_active", "is_staff")
    search_fields = ("username", "email")
