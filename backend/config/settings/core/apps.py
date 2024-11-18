DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    "django.contrib.sites",
    "django.contrib.sitemaps",
]

LIBRARY_APPS = [
    "rest_framework",
    "corsheaders",
    "django_extensions",
    "requests",
    "ckeditor",
    "ckeditor_uploader",
    "collectfast",
    "storages",
]

PROJECT_APPS = [
    "accounts",
    "albums",
    "blogs",
    "diaries",
    "front",
    "lotteries",
    "maps",
]

PROJECT_API = ["main"]

INSTALLED_APPS = DJANGO_APPS + LIBRARY_APPS + PROJECT_APPS + PROJECT_API
