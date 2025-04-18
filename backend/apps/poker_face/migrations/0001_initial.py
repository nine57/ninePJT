# Generated by Django 4.2.3 on 2025-03-16 07:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Notice",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, help_text="생성 일시"),
                ),
                ("updated_at", models.DateTimeField(auto_now=True, help_text="수정 일시")),
                ("is_deleted", models.BooleanField(default=False, help_text="삭제 여부")),
                (
                    "deleted_at",
                    models.DateTimeField(blank=True, help_text="삭제 일시", null=True),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("title", models.CharField(max_length=255)),
                ("content", models.TextField()),
            ],
            options={
                "db_table": "pf_notice",
            },
        ),
        migrations.CreateModel(
            name="Poll",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, help_text="생성 일시"),
                ),
                ("updated_at", models.DateTimeField(auto_now=True, help_text="수정 일시")),
                ("is_deleted", models.BooleanField(default=False, help_text="삭제 여부")),
                (
                    "deleted_at",
                    models.DateTimeField(blank=True, help_text="삭제 일시", null=True),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("title", models.CharField(help_text="투표 제목", max_length=255)),
                (
                    "description",
                    models.TextField(blank=True, help_text="투표 설명", null=True),
                ),
                (
                    "created_by",
                    models.ForeignKey(
                        help_text="투표 생성자",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="polls",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "pf_poll",
            },
        ),
        migrations.CreateModel(
            name="PollOption",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, help_text="생성 일시"),
                ),
                ("updated_at", models.DateTimeField(auto_now=True, help_text="수정 일시")),
                ("is_deleted", models.BooleanField(default=False, help_text="삭제 여부")),
                (
                    "deleted_at",
                    models.DateTimeField(blank=True, help_text="삭제 일시", null=True),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("text", models.CharField(help_text="투표 옵션 텍스트", max_length=255)),
                (
                    "poll",
                    models.ForeignKey(
                        help_text="연관된 투표",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="options",
                        to="poker_face.poll",
                    ),
                ),
            ],
            options={
                "db_table": "pf_poll_option",
            },
        ),
        migrations.CreateModel(
            name="Vote",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, help_text="생성 일시"),
                ),
                ("updated_at", models.DateTimeField(auto_now=True, help_text="수정 일시")),
                ("is_deleted", models.BooleanField(default=False, help_text="삭제 여부")),
                (
                    "deleted_at",
                    models.DateTimeField(blank=True, help_text="삭제 일시", null=True),
                ),
                ("is_active", models.BooleanField(default=True)),
                (
                    "option",
                    models.ForeignKey(
                        help_text="선택된 옵션",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="votes",
                        to="poker_face.polloption",
                    ),
                ),
                (
                    "poll",
                    models.ForeignKey(
                        help_text="연관된 투표",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="votes",
                        to="poker_face.poll",
                    ),
                ),
                (
                    "voted_by",
                    models.ForeignKey(
                        help_text="투표한 사용자",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="votes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "pf_vote",
            },
        ),
    ]
