# Build 단계 - 정적 파일만 생성
FROM node:20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 개발 환경 (docker-compose에서 target으로 지정 가능)
FROM node:20 AS development
WORKDIR /app
COPY --from=builder /app .
CMD ["npm", "run", "dev"]
