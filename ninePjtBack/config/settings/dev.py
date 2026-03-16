from config.settings.base import *  # noqa: F401,F403

DEBUG = True
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# 개발 환경 인증 우회 설정
# True로 설정하면 모든 API 요청이 인증 없이 통과
DEV_AUTH_BYPASS = True
# 인증 우회 시 사용할 기본 사용자 ID (None이면 첫 번째 사용자 사용)
DEV_AUTH_USER_ID = None
