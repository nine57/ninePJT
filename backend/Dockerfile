#FROM python:3.11-alpine
#
#ENV PYTHONDONTWRITEBYTECODE=1
#ENV PYTHONUNBUFFERED=1
#
#RUN mkdir /backend
#COPY .. /backend
#WORKDIR /backend
#
#RUN pip install --upgrade pip \
#    && pip install poetry==1.8.3 \
#    && poetry install
#
#
#ENTRYPOINT ["sh", "./entrypoint.sh"]


# Python 기반 백엔드 예시
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /apps

## Poetry 설치
#RUN apt-get update && apt-get install -y curl && \
#    curl -sSL https://install.python-poetry.org | python3 - && \
#    ln -s /root/.local/bin/poetry /usr/local/bin/poetry && \
#    apt-get clean && rm -rf /var/lib/apt/lists/* \

ENV PYTHONPATH=/apps
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_CREATE=false

# 종속성 파일 복사 및 설치
COPY backend/pyproject.toml backend/poetry.lock ./

RUN pip install --upgrade pip \
    && pip install poetry==1.8.3 \
    && poetry install --no-root

RUN poetry install --no-root --only=main

# 소스코드 복사
COPY . .

# 포트 노출
EXPOSE 8000

CMD ["poetry", "run", "gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--log-level", "debug"]
#, "--reload", "--log-level", "debug"]
