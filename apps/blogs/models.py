from ckeditor_uploader.fields import RichTextUploadingField
from django.db import models

# class Subcategory(models.Model):
#     name = models.CharField(max_length=255)


# class Category(models.Model):
#     name = models.CharField(max_length=255)
#     sub_category = models.ForeignKey(Subcategory)


class Post(models.Model):
    created_at = models.DateTimeField()
    title = models.CharField(max_length=255)
    content = RichTextUploadingField(null=True, blank=True)
    # category = models.ForeignKey(Category, on_delete=models.PROTECT, null=True)


# 분류 모델
# class Category
# class Subcategory
# class Subtype
