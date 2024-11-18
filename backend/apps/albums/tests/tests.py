from apps.albums.serialize import image_serializer, person_serializer


def test_image_serializer_for_image_with_caption(image_with_caption):
    function_return = image_serializer(image_with_caption)
    expected_output = {
        "created_at": image_with_caption.created_at.astimezone().strftime(
            "%Y-%m-%d %H:%M"
        ),
        "origin": image_with_caption.origin.url,
        "caption": image_with_caption.caption,
    }
    assert function_return == expected_output


def test_image_serializer_for_image_with_none_caption(image_with_none_caption):
    function_return = image_serializer(image_with_none_caption)
    expected_output = {
        "created_at": image_with_none_caption.created_at.astimezone().strftime(
            "%Y-%m-%d %H:%M"
        ),
        "origin": image_with_none_caption.origin.url,
        "caption": "",
    }
    assert function_return == expected_output


def test_person_serializer(person):
    function_return = person_serializer(person)
    expected_output = {"name": person.name}
    assert function_return == expected_output
