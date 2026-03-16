# ninePjtBack

개인 서비스 백엔드 (Python 3.12, Django 4.2 LTS, uv)

## 개발 환경
- Python: 3.12
- Django: 4.2 LTS
- 패키지/가상환경: uv

## 기본 사용법
```bash
# 가상환경 생성 및 동기화
uv venv --python 3.12
uv sync

# 개발 서버 실행
uv run python manage.py runserver

# 헬스체크
curl http://127.0.0.1:8000/health
```


