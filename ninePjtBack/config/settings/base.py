import os
from pathlib import Path

from config.env import load_env

# .env 파일 로드
load_env()

BASE_DIR = Path(__file__).resolve().parents[2]

# Security
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "")

# Hosts / CSRF
_allowed_hosts_env = os.getenv("DJANGO_ALLOWED_HOSTS", "")
# ALLOWED_HOSTS = ["127.0.0.1", "localhost", "0.0.0.0"]
ALLOWED_HOSTS = ["*"]
if _allowed_hosts_env:
    ALLOWED_HOSTS = [
        h.strip() for h in _allowed_hosts_env.split(",") if h.strip()
    ]

_csrf_trusted_origins_env = os.getenv("DJANGO_CSRF_TRUSTED_ORIGINS", "")
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    # "http://nine015.iptime.org",
]
if _csrf_trusted_origins_env:
    CSRF_TRUSTED_ORIGINS = [
        o.strip() for o in _csrf_trusted_origins_env.split(",") if o.strip()
    ]

_cors_allowed_origins_env = os.getenv("DJANGO_CORS_ALLOWED_ORIGINS", "")
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    # "http://nine015.iptime.org",
]
if _cors_allowed_origins_env:
    CORS_ALLOWED_ORIGINS = [
        o.strip() for o in _cors_allowed_origins_env.split(",") if o.strip()
    ]

CORS_ALLOW_CREDENTIALS = True

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "django_extensions",
    "apps.users",
    "apps.organizations",
    "apps.settlements",
    "apps.pictures",
    "apps.posts",
]

MIDDLEWARE = [
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

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

_db_engine = os.getenv("DB_ENGINE", "sqlite")
if _db_engine == "postgresql":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DB_NAME", "ninepjt"),
            "USER": os.getenv("DB_USER", "ninepjt"),
            "PASSWORD": os.getenv("DB_PASSWORD", ""),
            "HOST": os.getenv("DB_HOST", "postgres"),
            "PORT": os.getenv("DB_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

LANGUAGE_CODE = "ko-kr"
TIME_ZONE = "Asia/Seoul"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# 미디어 파일의 전체 URL 접두사 (S3, CDN 등 외부 스토리지 지원)
MEDIA_STORAGE_URL = os.getenv("MEDIA_STORAGE_URL", "http://localhost:8000/media/")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "console": {
            "format": "%(levelname)s %(asctime)s %(name)s %(message)s",
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "console",
        }
    },
    "root": {"handlers": ["console"], "level": "INFO"},
    "loggers": {
        "django.server": {
            "handlers": ["console"], "level": "INFO", "propagate": False
        },
        "django.request": {
            "handlers": ["console"], "level": "WARNING", "propagate": True
        },
    },
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Custom User Model
AUTH_USER_MODEL = "users.User"
