def image_serializer(image):
    caption = image.caption if image.caption is not None else ""
    data = {
        "created_at": image.created_at.astimezone().strftime("%Y-%m-%d %H:%M"),
        "origin": image.origin.url,
        "caption": caption,
    }
    return data
