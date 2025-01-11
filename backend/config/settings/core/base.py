import os
import sys
from pathlib import Path

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", None)
DEBUG = True
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

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"


# # Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
# ############### PATH CONF ###############
DJANGO_ROOT = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
PROJECT_ROOT = os.path.dirname(DJANGO_ROOT)
PROJECT_PARENT_ROOT = os.path.dirname(PROJECT_ROOT)
STATICFILES_DIRS = [os.path.join(PROJECT_ROOT, "static")]
PROJECT_TEMPLATES_DIRS = os.path.join(PROJECT_ROOT, "templates")
# add apps/ to the Python path
sys.path.append(os.path.normpath(os.path.join(PROJECT_ROOT, "apps")))
sys.path.append(os.path.normpath(os.path.join(PROJECT_ROOT, "api")))

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Static files (CSS, JavaScript, Images)
AWS_S3_DOMAIN = os.environ.get("AWS_S3_DOMAIN", None)
# STATIC_URL = f"https://{AWS_S3_DOMAIN}/static/"
STATIC_URL = "/static/"
MEDIA_URL = f"https://{AWS_S3_DOMAIN}/media/"
STATIC_ROOT = os.path.join(PROJECT_ROOT, "dist", "static")
MEDIA_ROOT = os.path.join(PROJECT_ROOT, "dist", "media")
