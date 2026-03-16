#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

echo -e "${GREEN}"
echo "============================================"
echo "         ninePjt 배포 스크립트"
echo "============================================"
echo -e "${NC}"

# Docker 실행 확인
command -v docker >/dev/null 2>&1 || error "Docker가 설치되어 있지 않습니다."
docker info >/dev/null 2>&1 || error "Docker가 실행 중이지 않습니다."

# .env 파일 확인
if [ ! -f ".env" ]; then
    warn ".env 파일이 없습니다. .env.example을 복사합니다."
    cp .env.example .env
    error ".env 파일을 설정한 후 다시 실행하세요. (vi .env)"
fi
success ".env 파일 확인"

# entrypoint.sh 줄바꿈 보정 (CRLF → LF)
if file ninePjtBack/entrypoint.sh | grep -q CRLF; then
    warn "entrypoint.sh에 CRLF 감지 → LF로 변환합니다."
    sed -i 's/\r//' ninePjtBack/entrypoint.sh
fi

# 모드 선택
echo ""
echo "배포 모드를 선택하세요:"
echo "  1) HTTP  - http://nine015.iptime.org  (포트 80, 8000)"
echo "  2) HTTPS - https://nine015.iptime.org (포트 80, 443)"
echo ""
read -p "선택 (1/2) [기본: 1]: " MODE
MODE=${MODE:-1}

if [ "$MODE" = "2" ]; then
    COMPOSE_FILE="docker-compose.https.yml"

    # SSL 인증서 확인
    CERT_PATH="./data/certbot/conf/live/nine015.iptime.org/fullchain.pem"
    if [ ! -f "$CERT_PATH" ]; then
        warn "SSL 인증서가 없습니다. Let's Encrypt 인증서를 발급합니다."
        echo ""
        read -p "이메일 주소를 입력하세요: " CERT_EMAIL
        [ -z "$CERT_EMAIL" ] && error "이메일을 입력해야 합니다."

        info "certbot 실행 중..."
        docker compose -f $COMPOSE_FILE run --rm certbot \
            certonly --webroot \
            --webroot-path=/var/www/certbot \
            -d nine015.iptime.org \
            --email "$CERT_EMAIL" \
            --agree-tos --no-eff-email
        success "인증서 발급 완료"
    else
        success "SSL 인증서 확인"
    fi
else
    COMPOSE_FILE="docker-compose.yml"
fi

# 기존 컨테이너 상태 확인
echo ""
RUNNING=$(docker compose -f $COMPOSE_FILE ps -q 2>/dev/null | wc -l)
if [ "$RUNNING" -gt 0 ]; then
    warn "실행 중인 컨테이너가 있습니다. 재배포합니다."
fi

# 빌드 및 배포
info "이미지 빌드 및 컨테이너 시작 중..."
docker compose -f $COMPOSE_FILE up -d --build

echo ""
echo -e "${GREEN}"
echo "============================================"
echo "              배포 완료"
echo "============================================"
echo -e "${NC}"

docker compose -f $COMPOSE_FILE ps

echo ""
if [ "$MODE" = "2" ]; then
    success "접속 주소: https://nine015.iptime.org"
else
    success "프론트엔드: http://nine015.iptime.org"
    success "백엔드 API: http://nine015.iptime.org:8000/api/docs"
fi
echo ""
info "로그 확인: docker compose -f $COMPOSE_FILE logs -f"
