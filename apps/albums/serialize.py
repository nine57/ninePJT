from apps.albums.models import Image, Person


def image_serializer(image: Image) -> dict:
    caption = image.caption if image.caption is not None else ""
    data = {
        "created_at": image.created_at.astimezone().strftime("%Y-%m-%d %H:%M"),
        "origin": image.origin.url,
        "caption": caption,
    }
    return data


def person_serializer(person: Person) -> dict:
    data = {"name": person.name}
    return data


def page_serializer(
    page: int,
    limit: int,
    person: Person,
    image_count: int,
) -> dict:
    person_query = f"&person={person}" if person else ""
    if page == 1:
        prev_query = ""
    else:
        prev_query = f"?page={page-1}" + person_query
    if image_count <= page * limit:
        next_query = ""
    else:
        next_query = f"?page={page+1}" + person_query
    data = {
        "prev": prev_query,
        "current": page,
        "next": next_query,
    }
    return data
