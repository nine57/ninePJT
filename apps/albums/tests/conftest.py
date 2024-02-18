import pytest
from django.utils import timezone

from apps.albums.models import Image, Person


@pytest.fixture
def image_with_caption():
    return Image(
        created_at=timezone.now(),
        origin="test-image.jpg",
        caption="test caption",
    )


@pytest.fixture
def image_with_none_caption():
    return Image(
        created_at=timezone.now(),
        origin="test-image.jpg",
        caption=None,
    )


@pytest.fixture
def person():
    return Person(name="test")
