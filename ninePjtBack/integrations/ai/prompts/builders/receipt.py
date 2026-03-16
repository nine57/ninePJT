from __future__ import annotations

from integrations.ai.prompts.builders.base import BasePromptBuilder
from integrations.ai.prompts.static_texts.receipt import RECEIPT_ANALYSIS_SYSTEM_PROMPT


class ReceiptPromptBuilder(BasePromptBuilder):
    """결제/거래 내역 이미지 분석에 사용할 프롬프트 빌더."""

    def build(self, additional_instruction: str | None = None) -> str:
        base = RECEIPT_ANALYSIS_SYSTEM_PROMPT
        if additional_instruction:
            return base + "\n\n추가 지시사항:\n" + additional_instruction.strip()
        return base
