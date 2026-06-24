"use client";


import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

interface TodosErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TodosError({ error, reset }: TodosErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // 실무 환경에서는 에러 로그 분석 서비스(예: Sentry)에 오류를 기록합니다.
    console.error("ErrorBoundary caught an uncaught exception:", error);
  }, [error]);

  return (
    <div className="py-8 text-center space-y-6">
      {/* 경고 그래픽 */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-danger border border-red-100">
          <span className="text-3xl font-bold">⚠️</span>
        </div>
      </div>

      {/* 에러 안내 문구 */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-800">
          문제가 발생했습니다
        </h2>
        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          데이터베이스 세션이 만료되었거나 백엔드 API 서버와 통신할 수 없습니다.
          잠시 후 다시 시도해 주세요.
        </p>
        {error.message && (
          <p className="text-xs bg-slate-100 p-2.5 rounded-xl text-slate-400 font-mono break-all max-w-[350px] mx-auto mt-2">
            Error: {error.message}
          </p>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3 max-w-[280px] mx-auto">
        <button
          onClick={() => router.push("/todos")}
          className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-2xl transition-all duration-200 cursor-pointer text-center"
        >
          메인으로 이동
        </button>
        <button
          onClick={() => reset()}
          className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-2xl shadow-[0_4px_12px_rgba(103,43,224,0.15)] hover:shadow-[0_6px_20px_rgba(103,43,224,0.25)] transition-all duration-250 cursor-pointer text-center"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
