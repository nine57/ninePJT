from django.conf import settings
from django.db import transaction
from django.shortcuts import redirect
from django.utils import timezone
from django.utils.http import urlencode
from django.views.generic import TemplateView

from apps.albums.models import Image
from apps.albums.query import get_image_data, get_people_data
from apps.albums.serialize import image_serializer, page_serializer, person_serializer


class ImageUploadView(TemplateView):
    template_name = "albums/upload.html"

    def post(self, request, *args, **kwargs):
        time_now = timezone.now().astimezone()
        image_origin = self.request.FILES.get("image_origin")
        caption = self.request.POST.get("caption")
        people = self.request.POST.get("people")
        people_list = list(map(lambda x: x.strip(), people.split(",")))
        people_set = get_people_data()
        image_people_list = []
        for person_name in people_list:
            for person in people_set:
                if person_name == person.name:
                    image_people_list.append(person.id)
        with transaction.atomic():
            image = Image(created_at=time_now, origin=image_origin, caption=caption)
            image.save()
            for person in image_people_list:
                image.people.add(person)
        return redirect("albums:list")


class ImageListView(TemplateView):
    template_name = "albums/main.html"

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        page = int(self.request.GET.get("page", 1))
        limit = int(self.request.GET.get("limit", 6))
        person = self.request.GET.get("person", "")
        image_set = get_image_data(person)
        image_count = image_set.count()
        paged_image_set = image_set[(page - 1) * limit : page * limit]
        people_set = get_people_data()
        context_data["is_test"] = settings.DEBUG
        context_data["person"] = person
        context_data["data"] = [image_serializer(image) for image in paged_image_set]
        context_data["people"] = [person_serializer(person) for person in people_set]
        context_data["page"] = page_serializer(page, limit, person, image_count)
        return context_data
