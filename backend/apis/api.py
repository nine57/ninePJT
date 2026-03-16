import logging

from ninja import NinjaAPI

from apis.routers import (
    albums,
    auth,
    expenses,
    organizations,
    pictures,
    posts,
    profiles,
    settlement_groups,
    system,
)
from integrations.slack.notifications import send_error_notification

logger = logging.getLogger(__name__)

api = NinjaAPI(
    title="Nine Project API",
    version="1.0.0",
    description="Nine Project 백엔드 API 문서",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# Router 등록
api.add_router("/auth", auth.router)
api.add_router("/organizations", organizations.router)
api.add_router("/organizations", settlement_groups.router)
api.add_router("/organizations", albums.router)
api.add_router("/expenses", expenses.router)
api.add_router("/pictures", pictures.router)
api.add_router("/posts", posts.router)
api.add_router("/organizations", profiles.router)
api.add_router("", system.router)


@api.exception_handler(Exception)
def global_exception_handler(request, exc):
    """처리되지 않은 예외를 잡아 500 응답 + Slack 알림."""
    logger.error("Unhandled exception: %s", exc, exc_info=True)

    user_id = None
    if hasattr(request, "auth") and request.auth:
        user_id = getattr(request.auth, "id", None)

    send_error_notification(
        method=request.method,
        path=request.path,
        status_code=500,
        exception=exc,
        user_id=user_id,
    )

    return api.create_response(
        request,
        {"detail": "서버 내부 오류가 발생했습니다."},
        status=500,
    )
