import React from "react";


export default function TodosLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. 헤더 영역 스켈레톤 */}
      <div className="border-b border-slate-100 pb-5 space-y-3">
        <div className="h-9 w-36 bg-slate-200 rounded-2xl"></div>
        <div className="h-4 w-60 bg-slate-100 rounded-xl"></div>
      </div>

      {/* 2. 컨트롤러(필터 탭 및 추가 버튼) 영역 스켈레톤 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* 필터 탭 스켈레톤 */}
        <div className="h-9 w-56 bg-slate-100 rounded-2xl"></div>
        {/* 새 Todo 버튼 스켈레톤 */}
        <div className="h-10 w-28 bg-slate-200 rounded-2xl"></div>
      </div>

      {/* 3. 할 일 목록 아이템 스켈레톤 리스트 (3개 가상 아이템) */}
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex items-center gap-3.5 p-4 border border-slate-100 rounded-2xl bg-white"
          >
            {/* 체크박스 스켈레톤 */}
            <div className="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0"></div>

            {/* 텍스트 영역 스켈레톤 */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded-lg w-3/4"></div>
            </div>

            {/* 버튼 그룹 스켈레톤 */}
            <div className="flex gap-2 flex-shrink-0">
              <div className="w-12 h-8 bg-slate-100 rounded-xl"></div>
              <div className="w-12 h-8 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. 푸터 스켈레톤 */}
      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
        <div className="h-3 w-32 bg-slate-100 rounded-lg"></div>
        <div className="h-3 w-16 bg-slate-100 rounded-lg"></div>
      </div>
    </div>
  );
}
