FROM python:3.10-alpine

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip==23.2.1 && pip install -r requirements.txt
