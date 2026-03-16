"""Settings package dispatcher.

DJANGO_ENV 환경변수 값을 읽어 dev 또는 prod 모듈을 로드합니다.
기본값은 dev 입니다.
"""

import os

env = os.getenv("DJANGO_ENV", "dev").lower()

if env == "prod":  # pragma: no cover - 단순 분기
    from .prod import *  # noqa: F401,F403
else:
    from .dev import *  # noqa: F401,F403


