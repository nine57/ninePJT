from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

from config.env import get_env

logger = logging.getLogger(__name__)


@dataclass
class SlackConfig:
    """Slack 클라이언트 설정."""

    bot_token: str
    enabled: bool = True

    @classmethod
    def from_env(cls) -> SlackConfig:
        enabled = get_env("SLACK_ENABLED", default="false").lower() == "true"
        if not enabled:
            return cls(bot_token="", enabled=False)
        bot_token = get_env("SLACK_BOT_TOKEN", required=True)
        return cls(bot_token=bot_token, enabled=True)


class SlackClient:
    """
    Slack Web API 클라이언트.

    SLACK_ENABLED=false 이면 모든 메서드가 no-op.
    """

    def __init__(self, config: Optional[SlackConfig] = None) -> None:
        self.config = config or SlackConfig.from_env()
        self._client: Optional[WebClient] = None
        if self.config.enabled:
            self._client = WebClient(token=self.config.bot_token)

    def send_message(
        self,
        channel: str,
        text: str,
        blocks: Optional[list] = None,
    ) -> None:
        """메시지 전송. 실패해도 예외를 던지지 않고 로그만 남긴다."""
        if not self.config.enabled or self._client is None:
            logger.debug("Slack 비활성화 상태. 메시지 전송 건너뜀.")
            return

        try:
            self._client.chat_postMessage(
                channel=channel,
                text=text,
                blocks=blocks,
            )
        except SlackApiError as exc:
            logger.warning("Slack 메시지 전송 실패: %s", exc.response["error"])
        except Exception as exc:  # noqa: BLE001
            logger.warning("Slack 메시지 전송 중 예외 발생: %s", exc)
