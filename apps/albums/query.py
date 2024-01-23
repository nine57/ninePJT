from apps.albums.models import Image


# TODO: query classification
def get_image_data():
    image_set = Image.objects.all().order_by("-id")[:3]
    return image_set
