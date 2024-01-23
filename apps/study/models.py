from ckeditor_uploader.fields import RichTextUploadingField
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        related_name="sub_category_set",
        on_delete=models.PROTECT,
    )


class Post(models.Model):
    created_at = models.DateTimeField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    title = models.CharField(max_length=255)
    content = RichTextUploadingField(null=True, blank=True)


class Link(models.Model):
    post = models.ForeignKey(Post, on_delete=models.PROTECT)
    url = models.URLField(max_length=1000)
    name = models.CharField(max_length=255, null=True, blank=True)
