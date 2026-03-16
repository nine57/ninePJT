from __future__ import annotations

from typing import Any, Dict

from integrations.ai.prompts.builders.base import BasePromptBuilder
from integrations.ai.prompts.builders.receipt import ReceiptPromptBuilder
from integrations.ai.prompts.builders.transaction import TransactionPromptBuilder
from integrations.ai.providers.gemini import GeminiClient


def analyze_image_to_json(
    image_bytes: bytes,
    prompt_builder: BasePromptBuilder,
    additional_instruction: str | None = None,
    mime_type: str = "image/jpeg",
) -> Dict[str, Any]:
    """
    이미지를 분석하여 JSON으로 반환하는 범용 함수.

    Args:
        image_bytes: 분석할 이미지의 바이트 데이터
        prompt_builder: 프롬프트를 생성할 빌더 인스턴스
        additional_instruction: 추가 지시사항 (선택)
        mime_type: 이미지 MIME 타입 (기본값: "image/jpeg")

    Returns:
        분석 결과를 담은 딕셔너리

    사용 예시:

    >>> from integrations.ai.prompts.builders.receipt import ReceiptPromptBuilder
    >>> with open("receipt.jpg", "rb") as f:
    ...     data = analyze_image_to_json(f.read(), ReceiptPromptBuilder())
    """
    client = GeminiClient()
    prompt = prompt_builder.build(
        additional_instruction=additional_instruction
    )
    return client.analyze_image_json(
        image_bytes=image_bytes,
        prompt=prompt,
        mime_type=mime_type,
    )


def analyze_image_file_to_json(
    file_path: str,
    prompt_builder: BasePromptBuilder,
    additional_instruction: str | None = None,
    mime_type: str = "image/jpeg",
) -> Dict[str, Any]:
    """
    파일 경로를 받아 이미지를 분석하는 범용 함수.

    Args:
        file_path: 분석할 이미지 파일 경로
        prompt_builder: 프롬프트를 생성할 빌더 인스턴스
        additional_instruction: 추가 지시사항 (선택)
        mime_type: 이미지 MIME 타입 (기본값: "image/jpeg")

    Returns:
        분석 결과를 담은 딕셔너리

    사용 예시:

    >>> from integrations.ai.prompts.builders.receipt import ReceiptPromptBuilder
    >>> builder = ReceiptPromptBuilder()
    >>> data = analyze_image_file_to_json("receipt.jpg", builder)
    """
    with open(file_path, "rb") as f:
        image_bytes = f.read()
    return analyze_image_to_json(
        image_bytes=image_bytes,
        prompt_builder=prompt_builder,
        additional_instruction=additional_instruction,
        mime_type=mime_type,
    )


# Receipt (결제/영수증) 분석 함수들
def analyze_payment_image_to_json(
    image_bytes: bytes,
    additional_instruction: str | None = None,
    mime_type: str = "image/jpeg",
) -> Dict[str, Any]:
    """
    결제/거래 내역(영수증) 이미지에서 정보를 추출해 JSON으로 반환한다.

    사용 예시:

    >>> with open("receipt.jpg", "rb") as f:
    ...     data = analyze_payment_image_to_json(f.read())
    """
    return analyze_image_to_json(
        image_bytes=image_bytes,
        prompt_builder=ReceiptPromptBuilder(),
        additional_instruction=additional_instruction,
        mime_type=mime_type,
    )


def analyze_payment_image_file_to_json(
    file_path: str,
    additional_instruction: str | None = None,
    mime_type: str = "image/jpeg",
) -> Dict[str, Any]:
    """
    파일 경로를 받아 결제/거래 내역(영수증) 이미지를 분석한다.

    사용 예시:

    >>> data = analyze_payment_image_file_to_json("receipt.jpg")
    """
    return analyze_image_file_to_json(
        file_path=file_path,
        prompt_builder=ReceiptPromptBuilder(),
        additional_instruction=additional_instruction,
        mime_type=mime_type,
    )


# Transaction (은행 거래내역) 분석 함수들
def analyze_transaction_image_to_json(
    image_bytes: bytes,
    additional_instruction: str | None = None,
    mime_type: str = "image/jpeg",
) -> Dict[str, Any]:
    """
    은행 거래내역 이미지에서 정보를 추출해 JSON으로 반환한다.

    사용 예시:

    >>> with open("transaction.jpg", "rb") as f:
    ...     data = analyze_transaction_image_to_json(f.read())
    """
    return analyze_image_to_json(
        image_bytes=image_bytes,
        prompt_builder=TransactionPromptBuilder(),
        additional_instruction=additional_instruction,
        mime_type=mime_type,
    )


def analyze_transaction_image_file_to_json(
    file_path: str,
    additional_instruction: str | None = None,
    mime_type: str = "image/jpeg",
) -> Dict[str, Any]:
    """
    파일 경로를 받아 은행 거래내역 이미지를 분석한다.

    사용 예시:

    >>> data = analyze_transaction_image_file_to_json("transaction.jpg")
    """
    return analyze_image_file_to_json(
        file_path=file_path,
        prompt_builder=TransactionPromptBuilder(),
        additional_instruction=additional_instruction,
        mime_type=mime_type,
    )
