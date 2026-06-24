import React from "react";
import Link from "next/link";
import { getTodos, toggleTodoFormAction, deleteTodoFormAction } from "../actions";

export const dynamic = "force-dynamic";

interface TodosPageProps {
  searchParams: Promise<{
    filter?: string;
  }>;
}

/**
 * Todo 목록 화면 (/todos/page.tsx)
 * 
 * [ Server Component 역할 ]
 * - 이 페이지는 순수한 React Server Component(RSC)입니다.
 * - Next.js 15 표준에 따라 `searchParams`를 비동기 Promise로 받아내고, 쿼리 파라미터(?filter=all|active|completed)를 분석합니다.
 * - 서버 환경에서 getTodos()를 호출하여 직접 DB 데이터를 조회한 후, 쿼리 필터에 맞춰 서버 단에서 데이터를 필터링합니다.
 * - 클라이언트 단의 자바스크립트 이벤트(onClick) 없이 완료 토글 및 삭제 처리를 제공하기 위해, 
 *   HTML <form> 태그와 Server Actions(toggleTodoFormAction, deleteTodoFormAction)를 결합하여 처리합니다.
 * - 이 설계는 브라우저 자바스크립트 번들을 최소화하여 로딩 속도를 최상으로 끌어올리며 SEO 최적화에 강력합니다.
 */
export default async function TodosPage({ searchParams }: TodosPageProps) {
  // 1. Next.js 15 규격에 맞춰 searchParams 를 await 처리합니다.
  const { filter = "all" } = await searchParams;

  // 2. 서버 단에서 백엔드 API를 호출해 목록을 조회합니다.
  // 에러 발생 시 throw하면 error.tsx(Error Boundary)가 자동으로 트리거됩니다.
  const todos = await getTodos();

  // 3. 서버 사이드 필터링 적용
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // "all"
  });

  // 4. 완료 통계 계산
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* 헤더 영역 - 시맨틱 마크업 */}
      <header className="border-b border-slate-100 pb-5">
        <h1 className="text-[2rem] font-bold text-slate-800 tracking-tight mb-1.5 leading-none">
          TaskFlow
        </h1>
        <p className="text-[0.95rem] text-slate-400 font-light">
          오늘의 할 일을 깔끔하게 관리해보세요.
        </p>
      </header>

      {/* 컨트롤러(필터 탭 & 추가 링크) 영역 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* 필터 탭 (URL Query Parameter 기반 리다이렉션으로 동작) */}
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
          {[
            { key: "all", label: "전체" },
            { key: "active", label: "진행 중" },
            { key: "completed", label: "완료됨" },
          ].map((tab) => {
            const isActive = filter === tab.key;
            return (
              <Link
                key={tab.key}
                href={`/todos?filter=${tab.key}`}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white text-primary shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* 새 Todo 생성 링크 */}
        <Link
          href="/todos/new"
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-2xl shadow-[0_4px_12px_rgba(103,43,224,0.15)] hover:shadow-[0_6px_20px_rgba(103,43,224,0.25)] transition-all duration-250 flex items-center justify-center gap-1.5 text-center"
        >
          <span className="text-lg font-bold leading-none">+</span>
          <span>새 할 일 추가</span>
        </Link>
      </div>

      {/* 할 일 목록 영역 */}
      <section aria-label="할 일 목록 영역">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 font-light text-sm">
              {filter === "all"
                ? "등록된 할 일이 없습니다."
                : filter === "active"
                ? "진행 중인 할 일이 없습니다."
                : "완료된 할 일이 없습니다."}
            </p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-1 todo-scrollbar">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center gap-3.5 p-4 border rounded-2xl transition-all duration-250 hover:shadow-[0_4px_12px_rgba(103,43,224,0.03)] hover:border-primary/30 ${
                  todo.completed
                    ? "bg-[#fcfaff] border-[#e8e3f7]"
                    : "bg-white border-slate-200"
                }`}
              >
                {/* 1. 완료 상태 변경 Form (RSC 전용 Form Action 연동) */}
                <form action={toggleTodoFormAction}>
                  <input type="hidden" name="id" value={todo.id} />
                  <input type="hidden" name="completed" value={String(!todo.completed)} />
                  <button
                    type="submit"
                    className={`w-6 h-6 border-2 rounded-full cursor-pointer relative transition-all flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 ${
                      todo.completed
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-white hover:border-primary"
                    }`}
                    aria-label={todo.completed ? "미완료로 변경" : "완료로 변경"}
                  >
                    {todo.completed && (
                      <span className="text-[11px] font-bold select-none">✓</span>
                    )}
                  </button>
                </form>

                {/* 2. 할 일 제목 영역 (수정 화면으로의 단순 링크 연동) */}
                <div className="flex-1 min-w-0 flex items-center">
                  <Link
                    href={`/todos/${todo.id}`}
                    className={`text-[0.95rem] text-slate-800 break-all whitespace-pre-wrap select-none transition-all duration-250 cursor-pointer hover:text-primary ${
                      todo.completed ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {todo.title}
                  </Link>
                </div>

                {/* 3. 액션 버튼 그룹 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* 수정 이동 버튼 */}
                  <Link
                    href={`/todos/${todo.id}`}
                    className="text-[0.8rem] font-bold px-3 py-1.5 rounded-xl transition-all bg-primary-light text-primary hover:bg-primary hover:text-white text-center"
                  >
                    수정
                  </Link>
                  
                  {/* 삭제 처리 Form (RSC 전용 Form Action 연동) */}
                  <form action={deleteTodoFormAction}>
                    <input type="hidden" name="id" value={todo.id} />
                    <button
                      type="submit"
                      className="text-[0.8rem] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer bg-[#ffebeb] text-danger hover:bg-danger hover:text-white"
                    >
                      삭제
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 하단 통계 정보 */}
      <footer className="flex justify-between items-center text-xs text-slate-400 font-light pt-2 border-t border-slate-100">
        <span>총 {totalCount}개 중 {completedCount}개 완료됨</span>
        <span>TaskFlow v2.0</span>
      </footer>
    </div>
  );
}
