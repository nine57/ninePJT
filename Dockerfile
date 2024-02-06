FROM python:3.10.9

COPY . /app

WORKDIR /app

RUN pip install --upgrade pip==23.2.1 && pip install -r requirements.txt
