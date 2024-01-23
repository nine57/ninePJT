CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_IMAGE_BACKEND = "pillow"

# for responsive & code snippet
CKEDITOR_CONFIGS = {
    "default": {
        "toolbar": None,
        "width": "100%",
        "extraPlugins": ",".join(["codesnippet"]),
    },
}
