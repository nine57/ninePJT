from __future__ import annotations

import traceback
from typing import Optional

from integrations.slack.constants import SlackChannel
from integrations.slack.client import SlackClient

_client: Optional[SlackClient] = None


def _get_client() -> SlackClient:
    global _client  # noqa: PLW0603
    if _client is None:
        _client = SlackClient()
    return _client


# ---- 서버 에러 알림 ----


def send_error_notification(
    method: str,
    path: str,
    status_code: int,
    exception: Exception,
    user_id: Optional[int] = None,
) -> None:
    """5xx 서버 에러 발생 시 Slack에 알림."""
    tb = traceback.format_exception(type(exception), exception, exception.__traceback__)
    tb_text = "".join(tb)[-1500:]

    text = (
        f":rotating_light: *서버 에러 발생*\n"
        f"*Method*: `{method}`\n"
        f"*Path*: `{path}`\n"
        f"*Status*: `{status_code}`\n"
        f"*User ID*: `{user_id or 'Anonymous'}`\n"
        f"*Error*: `{type(exception).__name__}: {exception}`\n"
        f"```{tb_text}```"
    )
    _get_client().send_message(channel=SlackChannel.TEST, text=text)


# ---- 비즈니스 이벤트 알림 ----


def send_signup_notification(username: str, email: str) -> None:
    """회원가입 완료 알림."""
    text = (
        f":tada: *신규 회원가입*\n"
        f"*Username*: `{username}`\n"
        f"*Email*: `{email or '미입력'}`"
    )
    _get_client().send_message(channel=SlackChannel.TEST, text=text)


def send_organization_created_notification(
    org_name: str, creator_username: str
) -> None:
    """조직 생성 알림."""
    text = (
        f":office: *새 조직 생성*\n"
        f"*조직명*: `{org_name}`\n"
        f"*생성자*: `{creator_username}`"
    )
    _get_client().send_message(channel=SlackChannel.TEST, text=text)
