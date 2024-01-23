import os
import sys
from pathlib import Path

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", None)
DEBUG = False
ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_WHITELIST = ["http://localhost:8000", "http://127.0.0.1:8000"]


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

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Static files (CSS, JavaScript, Images)
AWS_S3_DOMAIN = os.environ.get("AWS_S3_DOMAIN", None)
STATIC_URL = f"https://{AWS_S3_DOMAIN}/static/"
MEDIA_URL = f"https://{AWS_S3_DOMAIN}/media/"
STATIC_ROOT = os.path.join(PROJECT_ROOT, "dist", "static")
MEDIA_ROOT = os.path.join(PROJECT_ROOT, "dist", "media")
