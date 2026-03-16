FROM python:3.12-slim

WORKDIR /app

# 시스템 의존성 설치 (libpq-dev: psycopg2 빌드용)
RUN apt-get update && apt-get install -y \
    curl \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# uv 설치
RUN pip install --no-cache-dir uv

# 의존성 파일 복사
COPY pyproject.toml uv.lock ./

# 의존성 설치
RUN uv sync --frozen --no-dev

# 프로젝트 파일 복사
COPY . .

RUN chmod +x entrypoint.sh

# 포트 노출
EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]

