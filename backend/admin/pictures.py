from django.contrib import admin

from apps.pictures.models import Album, Picture


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ["name", "organization", "is_active", "created_at", "updated_at"]
    list_filter = ["is_active", "organization"]
    search_fields = ["name", "description", "organization__name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(Picture)
class PictureAdmin(admin.ModelAdmin):
    list_display = ["file_path", "album", "organization", "created_at"]
    list_filter = ["organization", "album"]
    search_fields = ["file_path", "caption", "organization__name", "album__name"]
    readonly_fields = ["created_at", "updated_at"]
