import os
import sys
from pathlib import Path

# ############### APP SERVER ###############
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", None)
DEBUG = False
ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_WHITELIST = ["http://localhost:8000", "http://127.0.0.1:8000"]


ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"


# # Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
# ############### PATH CONF ###############
DJANGO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(DJANGO_ROOT)
PROJECT_PARENT_ROOT = os.path.dirname(PROJECT_ROOT)
STATICFILES_DIRS = [os.path.join(PROJECT_ROOT, "static")]
PROJECT_TEMPLATES_DIRS = os.path.join(PROJECT_ROOT, "templates")
# add apps/ to the Python path
sys.path.append(os.path.normpath(os.path.join(PROJECT_ROOT, "apps")))

# Application definition
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
    "ckeditor",
    "ckeditor_uploader",
]

PROJECT_APPS = [
    "apps.diaries",
    "apps.front",
    "apps.lotteries",
    "apps.maps",
    "apps.albums",
    "apps.blogs",
    "apps.study",
]

INSTALLED_APPS = DJANGO_APPS + LIBRARY_APPS + PROJECT_APPS

# middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["RDS_DB_NAME"],
        "USER": os.environ["RDS_USERNAME"],
        "PASSWORD": os.environ["RDS_PASSWORD"],
        "HOST": os.environ["RDS_HOSTNAME"],
        "PORT": os.environ["RDS_PORT"],
    }
}

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Password validation
PASSWORD_VALIDATOR_NAMES = [
    "UserAttributeSimilarityValidator",
    "MinimumLengthValidator",
    "CommonPasswordValidator",
    "NumericPasswordValidator",
]
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": f"django.contrib.auth.password_validation.{name}"}
    for name in PASSWORD_VALIDATOR_NAMES
]


# Internationalization (i18n)
LANGUAGE_CODE = "ko-KR"
TIME_ZONE = "Asia/Seoul"
USE_I18N = True
USE_TZ = True


# templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [PROJECT_TEMPLATES_DIRS],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
MEDIA_URL = "/media/"
STATIC_ROOT = os.path.join(PROJECT_ROOT, "dist", "static")
MEDIA_ROOT = os.path.join(PROJECT_ROOT, "dist", "media")

# ckeditor
CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_IMAGE_BACKEND = "pillow"

# for responsive & code snippet
CKEDITOR_CONFIGS = {
    "default": {
        "toolbar": None,
        "width": "100%",
        "extraPlugins": ",".join(
            [
                "codesnippet",
            ]
        ),
    },
}
