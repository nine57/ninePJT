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
    people = models.ManyToManyField("albums.Person", through="albums.ImagePerson")
    events = models.ManyToManyField("albums.Event", through="albums.ImageEvent")


class Person(models.Model):
    name = models.CharField(max_length=30)


class ImagePerson(models.Model):
    image = models.ForeignKey("albums.Image", on_delete=models.PROTECT)
    person = models.ForeignKey("albums.Person", on_delete=models.PROTECT)


class Event(models.Model):
    date = models.DateField(null=True, blank=True)
    name = models.CharField(max_length=100)


class ImageEvent(models.Model):
    image = models.ForeignKey("albums.Image", on_delete=models.PROTECT)
    event = models.ForeignKey("albums.Event", on_delete=models.PROTECT)
