from enum import Enum


class SlackChannel(str, Enum):
    """Slack 채널 ID 매핑."""

    # 테스트 채널
    TEST = "C0AF152ADC2"
