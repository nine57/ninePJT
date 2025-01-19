# Node.js 이미지를 기반으로 빌드
FROM node:20 as builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package.json package-lock.json ./

# 종속성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# Vite 빌드
RUN npm run build

# Nginx에서 제공할 정적 파일만 저장
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]