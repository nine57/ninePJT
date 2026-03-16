from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Dict, Optional

from google import genai
from google.genai import types

from config.env import get_env


class GeminiClientError(Exception):
    """Gemini 클라이언트 관련 예외."""


@dataclass
class GeminiConfig:
    """Gemini 클라이언트 설정 값."""

    api_key: str
    model: str = "gemini-2.5-flash"

    @classmethod
    def from_env(cls) -> "GeminiConfig":
        """환경변수에서 설정을 로드한다."""
        api_key = get_env("GOOGLE_API_KEY", required=True)
        model = get_env("GEMINI_MODEL", default="gemini-2.5-flash")
        return cls(api_key=api_key, model=model)


class GeminiClient:
    """
    Google Gemini API 클라이언트.

    - 환경변수 `GOOGLE_API_KEY` 를 사용해 인증
    - 기본 모델은 `gemini-2.5-flash`
    """

    def __init__(self, config: Optional[GeminiConfig] = None) -> None:
        self.config = config or GeminiConfig.from_env()
        try:
            self._client = genai.Client(api_key=self.config.api_key)
        except Exception as exc:  # noqa: BLE001
            raise GeminiClientError(
                f"Gemini 클라이언트 초기화 실패: {exc}"
            ) from exc

    def analyze_image_raw(
        self,
        image_bytes: bytes,
        prompt: str,
        mime_type: str = "image/jpeg",
        **generate_kwargs: Any,
    ) -> Any:
        """
        이미지 + 프롬프트를 그대로 Gemini에 전달하고 원본 응답을 반환한다.
        """
        try:
            response = self._client.models.generate_content(
                model=self.config.model,
                contents=[
                    types.Part.from_bytes(
                        data=image_bytes,
                        mime_type=mime_type,
                    ),
                    prompt,
                ],
                **generate_kwargs,
            )
        except Exception as exc:  # noqa: BLE001
            raise GeminiClientError(f"Gemini 요청 실패: {exc}") from exc

        return response

    def analyze_image_json(
        self,
        image_bytes: bytes,
        prompt: str,
        mime_type: str = "image/jpeg",
        **generate_kwargs: Any,
    ) -> Dict[str, Any]:
        """
        이미지 분석 결과를 JSON으로 파싱해 반환한다.

        - 프롬프트에서 "반드시 유효한 JSON만 반환"하도록 지시하는 것을 권장.
        - JSON 파싱에 실패하면 `GeminiClientError` 를 발생시킨다.
        """
        response = self.analyze_image_raw(
            image_bytes=image_bytes,
            prompt=prompt,
            mime_type=mime_type,
            **generate_kwargs,
        )

        text: str = getattr(response, "text", "") or ""
        if not text:
            raise GeminiClientError("Gemini 응답에 text가 없습니다.")

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # ```json ... ``` 형태로 오는 경우 정리 시도
            cleaned = text.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.strip("`\n")
                if cleaned.lstrip().lower().startswith("json"):
                    parts = cleaned.split("\n", 1)
                    if len(parts) == 2:
                        cleaned = parts[1]

            try:
                return json.loads(cleaned)
            except json.JSONDecodeError as exc:  # noqa: B904
                raise GeminiClientError(
                    "Gemini 응답을 JSON으로 파싱하지 못했습니다."
                ) from exc
