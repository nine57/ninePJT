# Generated by Django 4.2.3 on 2024-01-22 15:16

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("albums", "0002_image_content_image_title"),
    ]

    operations = [
        migrations.RenameField(
            model_name="image",
            old_name="title",
            new_name="caption",
        ),
        migrations.RemoveField(
            model_name="image",
            name="content",
        ),
    ]
