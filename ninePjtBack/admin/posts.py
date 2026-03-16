from django.contrib import admin

from apps.posts.models import HashTag, Post, PostHashTag


@admin.register(HashTag)
class HashTagAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at"]
    search_fields = ["name"]
    list_filter = ["created_at"]
    readonly_fields = ["created_at"]


class PostHashTagInline(admin.TabularInline):
    model = PostHashTag
    extra = 1
    autocomplete_fields = ["hashtag"]


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "is_notice", "created_at", "updated_at"]
    search_fields = ["title", "content"]
    list_filter = ["is_notice", "created_at", "updated_at"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [PostHashTagInline]
    fieldsets = (
        (None, {
            "fields": ("title", "content", "is_notice")
        }),
        ("타임스탬프", {
            "fields": ("created_at", "updated_at")
        }),
    )


@admin.register(PostHashTag)
class PostHashTagAdmin(admin.ModelAdmin):
    list_display = ["post", "hashtag", "created_at"]
    search_fields = ["post__title", "hashtag__name"]
    list_filter = ["created_at", "hashtag"]
    readonly_fields = ["created_at"]
    autocomplete_fields = ["post", "hashtag"]
