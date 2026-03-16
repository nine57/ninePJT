import os
from typing import Optional

from dotenv import load_dotenv


class EnvError(Exception):
    pass


def load_env(
    dotenv_path: str = ".env",
    override: bool = False
) -> None:
    load_dotenv(dotenv_path=dotenv_path, override=override)


def get_env(
    name: str,
    default: Optional[str] = None,
    required: bool = False,
) -> str:
    value = os.getenv(name)
    if value is None or value.strip() == "":
        if required:
            raise EnvError(f"환경변수 '{name}' 가 설정되어 있지 않습니다.")
        return default or ""
    return value.strip()
