from django.db import models


class BaseTimeStampModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, help_text="생성 일시")
    updated_at = models.DateTimeField(auto_now=True, help_text="수정 일시")
    is_deleted = models.BooleanField(default=False, help_text="삭제 여부")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="삭제 일시")

    class Meta:
        abstract = True
