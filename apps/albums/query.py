from apps.albums.models import Image, Person


# TODO: query classification
def get_image_data(person=None):
    image_set = Image.objects.all()
    if person:
        image_set = image_set.filter(people__name=person)
    image_set = image_set.order_by("-id")
    return image_set


def get_people_data():
    people_set = Person.objects.all()
    return people_set
