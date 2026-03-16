# ninePjt 배포 스크립트 (Windows PowerShell)
# 실행: .\deploy.ps1
# 실행 정책 오류 시: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

$ErrorActionPreference = "Stop"

function Write-Info    { Write-Host "[INFO] $args" -ForegroundColor Cyan }
function Write-Success { Write-Host "[OK]   $args" -ForegroundColor Green }
function Write-Warn    { Write-Host "[WARN] $args" -ForegroundColor Yellow }
function Write-Err     { Write-Host "[ERROR] $args" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "         ninePjt 배포 스크립트" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Docker 실행 확인
try {
    docker info | Out-Null
} catch {
    Write-Err "Docker가 실행 중이지 않습니다. Docker Desktop을 시작하세요."
}
Write-Success "Docker 실행 확인"

# .env 파일 확인
if (-not (Test-Path ".env")) {
    Write-Warn ".env 파일이 없습니다. .env.example을 복사합니다."
    Copy-Item ".env.example" ".env"
    Write-Err ".env 파일을 설정한 후 다시 실행하세요. (notepad .env)"
}
Write-Success ".env 파일 확인"

# entrypoint.sh CRLF → LF 변환
$entrypoint = "ninePjtBack\entrypoint.sh"
if (Test-Path $entrypoint) {
    $content = Get-Content $entrypoint -Raw
    if ($content -match "`r`n") {
        Write-Warn "entrypoint.sh에 CRLF 감지 → LF로 변환합니다."
        $content = $content -replace "`r`n", "`n"
        [System.IO.File]::WriteAllText((Resolve-Path $entrypoint), $content)
        Write-Success "변환 완료"
    }
}

# 모드 선택
Write-Host ""
Write-Host "배포 모드를 선택하세요:"
Write-Host "  1) HTTP  - http://nine015.iptime.org  (포트 80, 8000)"
Write-Host "  2) HTTPS - https://nine015.iptime.org (포트 80, 443)"
Write-Host ""
$mode = Read-Host "선택 (1/2) [기본: 1]"
if ($mode -eq "") { $mode = "1" }

if ($mode -eq "2") {
    $composeFile = "docker-compose.https.yml"

    # SSL 인증서 확인
    $certPath = ".\data\certbot\conf\live\nine015.iptime.org\fullchain.pem"
    if (-not (Test-Path $certPath)) {
        Write-Warn "SSL 인증서가 없습니다. Let's Encrypt 인증서를 발급합니다."
        Write-Host ""
        $certEmail = Read-Host "이메일 주소를 입력하세요"
        if ($certEmail -eq "") { Write-Err "이메일을 입력해야 합니다." }

        Write-Info "certbot 실행 중..."
        docker compose -f $composeFile run --rm certbot `
            certonly --webroot `
            --webroot-path=/var/www/certbot `
            -d nine015.iptime.org `
            --email $certEmail `
            --agree-tos --no-eff-email
        Write-Success "인증서 발급 완료"
    } else {
        Write-Success "SSL 인증서 확인"
    }
} else {
    $composeFile = "docker-compose.yml"
}

# 빌드 및 배포
Write-Host ""
Write-Info "이미지 빌드 및 컨테이너 시작 중..."
docker compose -f $composeFile up -d --build

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "              배포 완료" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

docker compose -f $composeFile ps

Write-Host ""
if ($mode -eq "2") {
    Write-Success "접속 주소: https://nine015.iptime.org"
} else {
    Write-Success "프론트엔드: http://nine015.iptime.org"
    Write-Success "백엔드 API: http://nine015.iptime.org:8000/api/docs"
}
Write-Host ""
Write-Info "로그 확인: docker compose -f $composeFile logs -f"
