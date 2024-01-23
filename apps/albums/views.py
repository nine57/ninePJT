from typing import Any

from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.generic import TemplateView

from apps.albums.models import Image
from apps.albums.query import get_image_data
from apps.albums.serialize import image_serializer


# from django.views import View
class ImageUploadView(TemplateView):
    template_name = "albums/upload.html"

    def post(self, request, *args, **kwargs):
        time_now = timezone.now().astimezone()
        image_origin = self.request.FILES.get("image_origin")
        print("-" * 5, "image_info", "-" * 5)
        print(image_origin)
        print(image_origin.size)
        caption = self.request.POST.get("caption")
        image = Image(created_at=time_now, origin=image_origin, caption=caption)
        image.save()
        return redirect("albums:list")


class ImageListView(TemplateView):
    template_name = "albums/main.html"

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        image_set = get_image_data()
        context_data["data"] = [image_serializer(image) for image in image_set]
        return context_data
