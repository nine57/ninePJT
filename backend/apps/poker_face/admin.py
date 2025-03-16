from django.contrib import admin

from .models import Notice, Poll, PollOption


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_at", "is_active")
    search_fields = ("title",)
    list_filter = ("is_active",)


@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_at", "is_active")
    search_fields = ("title",)
    list_filter = ("is_active",)


@admin.register(PollOption)
class PollOptionAdmin(admin.ModelAdmin):
    list_display = ("id", "poll", "text", "is_active")
    search_fields = ("text",)
    list_filter = ("is_active",)
