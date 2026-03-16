from django.contrib import admin

from apps.organizations.models import Organization, OrganizationMembership


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ["name", "is_active", "created_at", "updated_at"]
    list_filter = ["is_active"]
    search_fields = ["name", "description"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["name"]


@admin.register(OrganizationMembership)
class OrganizationMembershipAdmin(admin.ModelAdmin):
    list_display = ["user", "organization", "created_at", "is_active"]
    list_filter = ["is_active", "organization"]
    search_fields = ["user__username", "organization__name"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]
