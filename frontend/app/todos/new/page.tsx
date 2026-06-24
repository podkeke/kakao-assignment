"use client";

/**
 * -----------------------------------------------------------------------------
 * [ "use client" 지시어가 필요한 이유 ]
 * -----------------------------------------------------------------------------
 * 1. 상태 관리 (State Management): 입력 폼 필드의 사용자 입력값(title) 및 
 *    유효성 검증 실패 시 에러 메시지(errorMessage)를 동적으로 트래킹하기 위해 useState 훅이 필수적입니다.
 * 2. 양식 제출 및 브라우저 이벤트: onSubmit 양식 제출 동작을 가로채서(preventDefault) 
 *    비동기 처리(Server Action 호출)를 수행해야 합니다.
 * 3. 클라이언트 사이드 라우팅: 작성 완료 혹은 취소 시 목록 화면(/todos)으로 
 *    페이지를 되돌리기 위해 useRouter 훅을 사용해야 합니다.
 * -----------------------------------------------------------------------------
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createTodo } from "../../actions";

export default function NewTodoPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createTodo(trimmedTitle);
      router.push("/todos");
    } catch (error) {
      console.error("Error creating todo:", error);
      setErrorMessage("할 일을 추가하는 중에 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-slate-100 pb-5">
        <h1 className="text-[2rem] font-bold text-slate-800 tracking-tight mb-1.5 leading-none">
          새 할 일 추가
        </h1>
        <p className="text-[0.95rem] text-slate-400 font-light">
          새로운 일정을 깔끔하게 작성해보세요.
        </p>
      </header>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-danger rounded-2xl text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="todo-title"
            className="block text-sm font-bold text-slate-600"
          >
            할 일 제목
          </label>
          <input
            id="todo-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setErrorMessage("");
            }}
            placeholder="예: 백엔드 API 명세서 작성하기"
            disabled={isSubmitting}
            className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl text-[0.95rem] outline-none bg-white focus:border-primary transition-all duration-200"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
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
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
