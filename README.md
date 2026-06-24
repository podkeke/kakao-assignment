# TaskFlow - Next.js 15 + FastAPI 풀스택 Todo 서비스

본 프로젝트는 기존 Vite 기반 React Todo 애플리케이션을 **Next.js 15 App Router(TypeScript + Tailwind CSS v4)**와 **FastAPI(SQLAlchemy + SQLite)** 기반의 현대적인 풀스택 아키텍처로 마이그레이션한 결과물입니다.

---

## 1. 프로젝트 폴더 구조 및 파일 역할

```text
kakao-assignment-3/
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   └── todos/
│   │   │       └── route.ts       # API Route (백엔드 프록시)
│   │   ├── todos/
│   │   │   ├── [todoId]/
│   │   │   │   └── page.tsx       # Todo 수정 페이지
│   │   │   ├── new/
│   │   │   │   └── page.tsx       # Todo 생성 페이지
│   │   │   ├── error.tsx          # 에러 바운더리 컴포넌트
│   │   │   ├── loading.tsx        # Skeleton UI 로딩 컴포넌트
│   │   │   └── page.tsx           # Todo 목록 페이지
│   │   ├── actions.ts             # Server Actions (CRUD 로직)
│   │   ├── globals.css            # Tailwind v4 글로벌 스타일
│   │   ├── layout.tsx             # 루트 레이아웃 (SEO & 메타데이터)
│   │   └── page.tsx               # 루트 리다이렉트
│   ├── .env.local                 # 프론트엔드 환경변수
│   ├── .gitignore                 # Git 제외 설정
│   ├── next-env.d.ts              # Next.js 타입 참조 선언
│   ├── next.config.mjs            # Next.js ESM 설정
│   ├── postcss.config.mjs         # PostCSS 플러그인 설정
│   ├── package.json               # 프론트엔드 의존성 목록
│   ├── tsconfig.json              # TypeScript 컴파일 옵션
│   └── README.md                  # 프로젝트 설명서 (본 파일)
│
└── backend/
    ├── main.py                    # FastAPI 앱 + 모든 로직 (라우터, DB, 모델, 스키마)
    ├── requirements.txt           # 백엔드 의존성 목록
    └── .env.local                 # 백엔드 환경변수
```

---

## 2. 의존성 패키지 설치 목록

### 📦 Backend
*   **`fastapi (>=0.111.0)`**: 고성능 비동기 API 프레임워크
*   **`uvicorn[standard] (>=0.29.0)`**: ASGI 서버 실행기
*   **`sqlalchemy (>=2.0.0)`**: ORM을 활용한 데이터베이스 관리 도구
*   **`pydantic (>=2.0.0)`**: 스키마 정의 및 데이터 유효성 검증

### 📦 Frontend
*   **`next (15.0.3)`**: 최신 Next.js 프레임워크
*   **`react (19.0.0-rc)` / `react-dom`**: 최신 React 엔진
*   **`axios`**: 브라우저 API 프록시 통신용 클라이언트
*   **`tailwindcss (4.0.0)`** / **`@tailwindcss/postcss`**: 설정 파일이 필요 없는 차세대 빌드 엔진 및 PostCSS 연동 플러그인
*   **`typescript`**: 정적 타입 검사 라이브러리

---

## 3. 로컬 서버 구동 가이드

백엔드와 프론트엔드를 각각 다른 터미널에서 구동합니다.

### 1) 백엔드(FastAPI) 실행
```bash
# backend/ 디렉토리로 이동
cd backend

# 가상환경 생성
python -m venv .venv

# 가상환경 활성화
source .venv/bin/activate        # Mac/Linux
.venv\Scripts\activate           # Windows

# 패키지 설치
pip install -r requirements.txt

# FastAPI 개발 서버 가동 (8000 포트)
uvicorn main:app --reload --port 8000
```
*서버 가동 즉시 `backend/todos.db` 데이터베이스가 자동 생성되고 SQLAlchemy 테이블 매핑이 초기화됩니다.*

### 2) 프론트엔드(Next.js) 실행
```bash
cd frontend

# Node.js 패키지 의존성 설치
npm install

# Next.js 개발 서버 가동 (3000 포트)
npm run dev
```
*브라우저로 [http://localhost:3000](http://localhost:3000) 접속 시 자동으로 `/todos` 목록 페이지로 리다이렉트됩니다.*

---
