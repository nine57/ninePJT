from django.test import TestCase
from django.utils import timezone

from apps.albums.models import Image, Person
from apps.albums.serialize import image_serializer, person_serializer


class AlbumSerializerTest(TestCase):
    def setUp(self):
        self.image_with_caption = Image.objects.create(
            created_at=timezone.now(),
            origin="test-image.jpg",
            caption="test caption",
        )
        self.image_with_none_caption = Image.objects.create(
            created_at=timezone.now(),
            origin="test-image.jpg",
            caption=None,
        )
        self.person = Person.objects.create(name="test")

    def test_image_serializer_for_image_with_caption(self):
        serialized_data = image_serializer(self.image_with_caption)
        expected_data = {
            "created_at": self.image_with_caption.created_at.astimezone().strftime(
                "%Y-%m-%d %H:%M"
            ),
            "origin": self.image_with_caption.origin.url,
            "caption": self.image_with_caption.caption,
        }
        self.assertEqual(serialized_data, expected_data)

    def test_image_serializer_for_image_with_none_caption(self):
        serialized_data = image_serializer(self.image_with_none_caption)
        expected_data = {
            "created_at": self.image_with_none_caption.created_at.astimezone().strftime(
                "%Y-%m-%d %H:%M"
            ),
            "origin": self.image_with_none_caption.origin.url,
            "caption": "",
        }
        self.assertEqual(serialized_data, expected_data)

    def test_person_serializer(self):
        serialized_data = person_serializer(self.person)
        expected_data = {"name": self.person.name}
        self.assertEqual(serialized_data, expected_data)
