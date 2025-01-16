import os
import sys

from django.contrib.messages import constants as messages_constants

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", None)
DEBUG = True

# # Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
# add apps/ to the Python path
sys.path.append(os.path.normpath(os.path.join(BASE_DIR, "apps")))
sys.path.append(os.path.normpath(os.path.join(BASE_DIR, "api")))

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

ALLOWED_HOSTS = [
    "*",
    # "nine-pjt.info",
    # "https://nine-pjt.info",
]
CORS_ALLOW_ALL_ORIGINS = True
CORS_ORIGIN_WHITELIST = [
    "http://localhost:5173",
    # "nine-pjt.info",
    # "https://nine-pjt.info",
]
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1",
    # "nine-pjt.info",
    # "https://nine-pjt.info",
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    "django.contrib.sites",
    "django.contrib.sitemaps",
    "rest_framework",
    "corsheaders",
    "django_extensions",
    "requests",
    "ckeditor",
    "ckeditor_uploader",
    "collectfast",
    "storages",
    "accounts",
    "albums",
    "blogs",
    "diaries",
    "front",
    "lotteries",
    "maps",
    "main"
]

MIDDLEWARE = [
    "utilities.middleware.HealthCheckMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"


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

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
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

MESSAGE_LEVEL = messages_constants.INFO

# Static files (CSS, JavaScript, Images)
AWS_S3_DOMAIN = os.environ.get("AWS_S3_DOMAIN", None)
# STATIC_URL = "/static/"
STATIC_URL = f"https://{AWS_S3_DOMAIN}/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")
# STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

MEDIA_URL = f"https://{AWS_S3_DOMAIN}/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

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
AUTH_USER_MODEL = "accounts.User"

LOGIN_REDIRECT_URL = "accounts:redirect"

# Internationalization
LANGUAGE_CODE = "ko-KR"

TIME_ZONE = "Asia/Seoul"

USE_I18N = True

USE_TZ = True

# AWS S3
USE_AWS_S3_AS_STORAGE = os.environ.get("REMOTE_STORAGE_SERVICE", None) == "AWS_S3"
if USE_AWS_S3_AS_STORAGE:
    # a custom storage file, so we can easily put static and media in one bucket
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", None)
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", None)
    AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", None)
    AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME", None)

    MEDIA_FILES_STORAGE = "utilities.storages.S3MediaFilesStorage"
    STATICFILES_STORAGE = "utilities.storages.S3StaticFilesStorage"
    DEFAULT_FILE_STORAGE = MEDIA_FILES_STORAGE
    COLLECTFAST_STRATEGY = "collectfast.strategies.boto3.Boto3Strategy"
    COLLECTFAST_THREADS = 20

    # either None or from the list of canned ACLs.
    # if set to None then all files will inherit the bucket’s ACL.
    AWS_DEFAULT_ACL = None

    # The maximum amount of memory a file can take up before being rolled over into a temporary file on disk.
    AWS_S3_MAX_MEMORY_SIZE = 0

    # Setting AWS_QUERYSTRING_AUTH to False to remove query parameter authentication from generated URLs.
    # This can be useful if your S3 buckets are public.
    AWS_QUERYSTRING_AUTH = False

    # The number of seconds that a generated URL is valid for.
    AWS_QUERYSTRING_EXPIRE = 3600

    # Enable server-side file encryption while at rest.
    AWS_S3_ENCRYPTION = False

    # if False it will create unique file names for every image_uploaded file
    AWS_S3_FILE_OVERWRITE = True

    # # As of boto3 version 1.4.4 the default signature version is s3v4.
    AWS_S3_SIGNATURE_VERSION = "s3v4"
    S3_USE_SIGV4 = True


# CKEditor
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
