from apps.albums.models import Image


# TODO: query classification
def get_image_data(limit=5):
    image_set = Image.objects.all().order_by("-id")[:limit]
    return image_set
