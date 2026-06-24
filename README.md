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

## 4. 과제 핵심 이론 답변 요약 (보고서용)

### ① App Router란 무엇인가?
Next.js 13부터 표준이 되어 Next.js 15에 도입된 **React Server Components(RSC) 기반의 새로운 파일 시스템 라우팅 아키텍처**입니다. `app/` 디렉토리를 물리적 기준으로 하며 폴더의 네임스페이스가 브라우저 URL 경로와 일치됩니다. 또한 라우팅 폴더 마다 약속된 특수 용도 파일인 `page.tsx` (페이지), `layout.tsx` (공통 레이아웃), `loading.tsx` (점진적 로딩), `error.tsx` (런타임 예외 처리) 등을 배치하면 프레임워크가 이를 자동 융합하여 부드럽고 안전한 렌더링 파이프라인을 조립합니다.

### ② Server Component와 Client Component 차이
*   **Server Component (RSC)**: Next.js의 모든 컴포넌트의 기본 상태입니다. **서버 상에서 단 1회 빌드 및 실행**되며 그 결과인 HTML 구조만 전달하기 때문에 브라우저로 흐르는 JS 번들이 전혀 없습니다. 외부 유출이 민감한 DB 커넥션이나 FastAPI API 연동 로직을 프론트 브라우저에 드러내지 않고 은닉하기에 유리합니다.
*   **Client Component**: 코드 첫머리에 `"use client"` 지시어를 선언해야 동작합니다. **브라우저(클라이언트) 환경에서 실행**되므로 사용자 이벤트 처리(onClick 등)와 React Hook(useState, useEffect) 제어 등 동적 리렌더링 인터랙션을 관리합니다.

### ③ API Route (`route.ts`)의 역할
Next.js 프레임워크 안에 소형 게이트웨이 Endpoints를 직접 구성해주는 도구입니다. 본 서비스에서 `route.ts`는 **백엔드 프록시(Proxy) 역할**을 수행합니다. 클라이언트 브라우저가 외부 도메인(`http://localhost:8000`)에 직접 접근하면 보안 침해 위협이나 CORS(Cross-Origin Resource Sharing) 위배 제약이 일어납니다. 이 주소를 드러내지 않기 위해 클라이언트는 Next.js 내부 API인 `/api/todos`로만 접근하고, 서버 환경변수(`BACKEND_URL`)를 쥐고 있는 `route.ts`가 백엔드로 대리 전송한 결과를 반환하여 보안 확보와 브라우저 CORS 회피를 달성합니다.

### ④ Server Actions (`actions.ts`)의 역할
RESTful API 엔드포인트를 매번 라우트로 설계하는 복거리를 거치지 않고, **서버에서 안전하게 가동되는 비동기 함수를 클라이언트 파일에서 다이렉트로 임포트해 호출**할 수 있도록 구현하는 기술입니다.
데이터를 삽입/갱신한 뒤 Next.js의 `revalidatePath` API를 호출하면 해당 세그먼트의 페칭 캐시가 즉시 소멸되어 목록 화면이 가장 신선한 데이터베이스 정보로 갱신됩니다.

### ⑤ 로컬스토리지 방식과 FastAPI 방식의 차이
*   **로컬스토리지(LocalStorage) 방식**: 데이터가 브라우저 캐시 저장소 영역에만 평문으로 남아 있습니다. 브라우저 정리가 일어나거나, 기기 및 브라우저를 이동하는 즉시 기존 데이터는 유실되고 공유가 불가능합니다.
*   **FastAPI + SQLite 방식**: 독립된 관계형 데이터베이스 파일에 데이터가 안전하게 영속 기록됩니다. 백엔드에서 보안, 트랜잭션, 정합성을 제어하므로 다중 사용자 협업 및 이기종 멀티 플랫폼 간 동시 데이터 공유가 가능합니다.

### ⑥ 환경변수를 사용하는 이유
민감하거나 변동성이 높은 주요 접속 경로 정보(DB 주소, 백엔드 IP 주소)를 외부에 공개되지 않도록 소스 코드 밖의 분리된 설정 파일(`.env.local`)에 캡슐화하여 보호하기 위함입니다. 소스가 깃허브 등에 개방되어도 정보가 유출되지 않으며 개발(Local), 빌드(Stage), 배포(Production) 단계마다 기기별 세팅을 유연하게 대치시킬 수 있습니다.

### ⑦ FastAPI + Next.js 데이터 흐름
```text
[사용자 행동 (완료 토글 / 생성 / 삭제)]
       │
       ▼
[Next.js Client Component] (TodoList, TodoItem)
       │
       ├─── (Axios 요청 송신) ───► [Next.js API Route Proxy] (route.ts)
       │                                       │ (BACKEND_URL 환경변수 활용)
       │                                       ▼
       │                                  [FastAPI Server] (main.py)
       │                                       │ (SQLAlchemy ORM 구동)
       │                                       ▼
       │                               [SQLite Database] (todos.db)
       │                                       │
       ▼                                       ▼
[Next.js Server Component] ◄─── (revalidatePath) ◄─── (처리 결과 역반환)
(todos/page.tsx)
       │
       ▼ (서버에서 최신 데이터가 반영된 완성 HTML 렌더링)
[브라우저 화면 갱신 완료]
```
