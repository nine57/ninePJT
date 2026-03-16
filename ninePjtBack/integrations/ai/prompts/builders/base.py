from __future__ import annotations

from abc import ABC, abstractmethod


class BasePromptBuilder(ABC):
    """프롬프트 빌더의 추상 베이스 클래스"""

    @abstractmethod
    def build(self, additional_instruction: str | None = None) -> str:
        """프롬프트 문자열을 생성한다."""
        msg = "build() must be implemented by subclasses"
        raise NotImplementedError(msg)
