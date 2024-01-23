from django.db import models
from django.utils import timezone


def origin_path(instance, filename):
    time_now = timezone.now().astimezone()
    date = time_now.date().strftime("%y%m%d")
    time = time_now.strftime("%H%M%S")
    origin_path = f"images/{date}/{time}/{filename}"
    return origin_path


class Image(models.Model):
    created_at = models.DateTimeField()
    origin = models.ImageField(upload_to=origin_path)
    caption = models.CharField(max_length=255, null=True, blank=True)
