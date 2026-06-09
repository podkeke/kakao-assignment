# 📝 과제 2. React로 Todo 앱 만들기

과제 1에서 Vanilla JavaScript로 구현했던 Todo 앱을 React로 마이그레이션한 프로젝트입니다.

React의 컴포넌트 구조와 상태 관리 방식을 적용하여 Todo CRUD 기능을 구현하고, 상태별 필터링, 날짜별 Todo 관리, 로컬 스토리지 저장 기능을 추가했습니다.

---

## 🚀 실행 방법

1. 저장소를 클론합니다.

```bash
git clone 저장소 주소
cd kakao-assignment-2
```

2. 패키지를 설치합니다.

```bash
npm install
```

3. 개발 서버를 실행합니다.

```bash
npm run dev
```

4. 브라우저에서 아래 주소로 접속합니다.

```text
http://localhost:5173
```

---

## 📁 프로젝트 구조

```text
src/
├── assets/
├── components/
│   ├── DateNavigator.jsx   # 날짜 이동 및 현재 날짜 표시
│   ├── FilterTabs.jsx      # 전체 / 진행 중 / 완료 필터
│   ├── TodoForm.jsx        # Todo 입력 폼
│   ├── TodoItem.jsx        # Todo 항목 (수정, 완료, 삭제)
│   └── TodoList.jsx        # Todo 목록
├── utils/
│   └── dateUtils.js        # 날짜 관련 유틸 함수
├── App.jsx                 # 전체 상태 관리
├── index.css               # 전역 스타일
└── main.jsx                # React 진입점
```

---

## ✅ 구현 기능

### Todo CRUD

* Todo 추가
* Todo 수정 (인라인 입력 방식)
* Todo 완료 처리
* Todo 삭제
* 완료된 Todo 취소선 표시

---

## 🛠️ 사용 기술

* React
* Vite
* JavaScript
* Tailwind CSS v4
* localStorage

---

## 📌 참고사항

* AI 도구(ChatGPT)를 활용하여 구현했습니다.
* 생성된 코드를 그대로 사용하지 않고 직접 수정 및 디버깅하며 기능을 완성했습니다.
* 과제 1(Vanilla JavaScript)에서 구현한 기능을 React 기반으로 재구현한 프로젝트입니다.
