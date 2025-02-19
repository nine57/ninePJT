from django.db import models
from core.abstracts.models import BaseTimeStampModel


class User(BaseTimeStampModel):
    user_name = models.CharField(max_length=32)
    real_name = models.CharField(max_length=8)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "pf_user"


class Notice(BaseTimeStampModel):
    is_active = models.BooleanField(default=True)
    title = models.CharField(max_length=255)
    content = models.TextField()

    class Meta:
        db_table = "pf_notice"


class Poll(BaseTimeStampModel):
    is_active = models.BooleanField(default=True)
    title = models.CharField(max_length=255, help_text="투표 제목")
    description = models.TextField(blank=True, null=True, help_text="투표 설명")
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="polls", help_text="투표 생성자"
    )

    class Meta:
        db_table = "pf_poll"


class PollOption(BaseTimeStampModel):
    is_active = models.BooleanField(default=True)
    poll = models.ForeignKey(
        Poll, on_delete=models.CASCADE, related_name="options", help_text="연관된 투표"
    )
    text = models.CharField(max_length=255, help_text="투표 옵션 텍스트")

    class Meta:
        db_table = "pf_poll_option"


class Vote(models.Model):
    poll = models.ForeignKey(
        Poll, on_delete=models.CASCADE, related_name="votes", help_text="연관된 투표"
    )
    option = models.ForeignKey(
        PollOption, on_delete=models.CASCADE, related_name="votes", help_text="선택된 옵션"
    )
    voted_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="votes", help_text="투표한 사용자"
    )

    class Meta:
        db_table = "pf_vote"
