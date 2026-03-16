# Nine Community Frontend

모임을 위한 커뮤니티 성격의 웹사이트 프론트엔드 프로젝트입니다.

## 기술 스택

- **React** 18.2.0 (LTS)
- **TypeScript** 5.2.2
- **Vite** 5.0.8
- **TailwindCSS** (유틸리티 퍼스트 CSS 프레임워크)
- **ESLint** (코드 품질 관리)

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 프로젝트 구조

일반적인 레이어 아키텍처를 따르는 구조로 구성되어 있습니다:

```
ninePjtFront/
├── public/              # 정적 파일
├── src/
│   ├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   ├── hooks/           # 커스텀 React 훅
│   ├── utils/           # 유틸리티 함수
│   ├── types/           # TypeScript 타입 정의
│   ├── services/        # API 서비스 레이어
│   ├── contexts/        # React Context API
│   ├── constants/       # 상수 정의
│   ├── assets/          # 이미지, 폰트 등 정적 자산
│   ├── App.tsx          # 메인 앱 컴포넌트
│   ├── main.tsx         # 진입점
│   └── index.css        # TailwindCSS 전역 스타일
├── index.html           # HTML 템플릿
├── package.json         # 프로젝트 의존성
├── tsconfig.json        # TypeScript 설정
├── tailwind.config.js   # TailwindCSS 설정
├── postcss.config.js    # PostCSS 설정
└── vite.config.ts       # Vite 설정
```

### 레이어 설명

- **components/**: 재사용 가능한 UI 컴포넌트 (Button, Card, Modal 등)
- **pages/**: 라우팅에 사용되는 페이지 컴포넌트
- **hooks/**: 비즈니스 로직을 캡슐화한 커스텀 훅
- **utils/**: 프로젝트 전반에서 사용되는 유틸리티 함수
- **types/**: TypeScript 인터페이스 및 타입 정의
- **services/**: API 호출 및 외부 서비스 통신
- **contexts/**: 전역 상태 관리를 위한 Context
- **constants/**: 프로젝트에서 사용하는 상수 값
- **assets/**: 이미지, 아이콘, 폰트 등 정적 자산

