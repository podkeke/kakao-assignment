"use client";

/**
 * -----------------------------------------------------------------------------
 * [ "use client" 지시어가 필요한 이유 ]
 * -----------------------------------------------------------------------------
 * 1. React 19 비동기 API 및 Hook 사용: Next.js 15 규격에 맞춰 전달받은 `params` Promise를
 *    클라이언트 환경에서 React.use() 훅으로 해제하고, 데이터 적재를 위해 useState, useEffect 훅을 사용합니다.
 * 2. 실시간 데이터 바인딩 및 폼 입력 트래킹: 로드된 기존 Todo 상세 정보(title, completed)를 
 *    로컬 입력값과 양방향 바인딩하여 사용자가 실시간으로 텍스트를 수정할 수 있도록 합니다.
 * 3. 비동기 데이터 갱신 및 라우팅: 수정이 완료되면 Server Action인 updateTodo를 호출하고, 
 *    성공 시 Next.js의 useRouter를 사용해 목록 화면(/todos)으로 효율적인 네비게이션을 수행합니다.
 * -----------------------------------------------------------------------------
 */

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getTodoById, updateTodo } from "../../actions";

interface EditTodoPageProps {
  params: Promise<{
    todoId: string;
  }>;
}

export default function EditTodoPage({ params }: EditTodoPageProps) {
  // 1. Next.js 15 규격에 맞춰 클라이언트 단에서 params Promise를 React.use()로 비동기 해제합니다.
  const { todoId } = use(params);
  const parsedTodoId = Number(todoId);
  const router = useRouter();

  // 2. 입력 및 상태 관리를 위한 로컬 상태 정의
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 3. 진입 시 기존 Todo 데이터 상세 조회 (Server Action 연동)
  useEffect(() => {
    async function loadTodo() {
      if (isNaN(parsedTodoId)) {
        setErrorMessage("올바르지 않은 Todo ID입니다.");
        setIsLoading(false);
        return;
      }

      try {
        const todo = await getTodoById(parsedTodoId);
        setTitle(todo.title);
        setCompleted(todo.completed);
      } catch (error: any) {
        console.error("Error loading todo:", error);
        setErrorMessage("할 일 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTodo();
  }, [parsedTodoId]);

  // 4. 수정 저장 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage("할 일 제목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Server Action 을 호출하여 백엔드 DB에 수정 사항 반영
      await updateTodo(parsedTodoId, {
        title: trimmedTitle,
        completed: completed,
      });
      // 완료 시 목록 화면으로 복귀
      router.push("/todos");
    } catch (error) {
      console.error("Error updating todo:", error);
      setErrorMessage("할 일을 수정하는 중에 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <span className="text-sm font-medium text-slate-500 animate-pulse">상세 정보를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 영역 - 시맨틱 마크업 */}
      <header className="border-b border-slate-100 pb-5">
        <h1 className="text-[2rem] font-bold text-slate-800 tracking-tight mb-1.5 leading-none">
          할 일 수정
        </h1>
        <p className="text-[0.95rem] text-slate-400 font-light">
          등록한 일정을 수정하고 업데이트해보세요.
        </p>
      </header>

      {/* 에러 피드백 */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-danger rounded-2xl text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* 수정 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. 제목 입력 필드 */}
        <div className="space-y-2">
          <label 
            htmlFor="edit-todo-title" 
            className="block text-sm font-bold text-slate-600"
          >
            할 일 제목 수정
          </label>
          <input
            id="edit-todo-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setErrorMessage("");
            }}
            placeholder="수정할 내용을 입력해 주세요"
            disabled={isSubmitting}
            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl text-[0.95rem] outline-none bg-white focus:border-primary transition-all duration-200"
          />
        </div>

        {/* 2. 완료 상태 체크박스 */}
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <button
            type="button"
            onClick={() => setCompleted(!completed)}
            disabled={isSubmitting}
            className={`w-6 h-6 border-2 rounded-full cursor-pointer relative transition-all flex items-center justify-center flex-shrink-0 disabled:opacity-50 ${
              completed
                ? "border-primary bg-primary text-white"
                : "border-slate-300 bg-white hover:border-primary"
            }`}
          >
            {completed && <span className="text-[11px] font-bold">✓</span>}
          </button>
          <span 
            className={`text-sm font-bold select-none cursor-pointer ${
              completed ? "text-slate-400 line-through" : "text-slate-700"
            }`}
            onClick={() => setCompleted(!completed)}
          >
            {completed ? "이미 완료된 항목입니다" : "아직 완료되지 않은 항목입니다"}
          </span>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/todos")}
            disabled={isSubmitting}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-2xl transition-all duration-200 text-center cursor-pointer disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-2xl shadow-[0_4px_12px_rgba(103,43,224,0.15)] hover:shadow-[0_6px_20px_rgba(103,43,224,0.25)] transition-all duration-250 disabled:opacity-50 text-center cursor-pointer"
          >
            {isSubmitting ? "수정 저장 중..." : "수정 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
