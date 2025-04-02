FROM python:3.11-slim

WORKDIR /apps

ENV PYTHONPATH=/apps
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_CREATE=false

COPY pyproject.toml poetry.lock ./

RUN pip install --upgrade pip \
    && pip install poetry==1.8.3 \
    && poetry install --no-root

RUN poetry install --no-root --only=main

COPY . .

# 포트 노출
EXPOSE 8000

CMD ["poetry", "run", "gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--log-level", "debug"]
