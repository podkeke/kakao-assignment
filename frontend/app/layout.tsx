import type { Metadata } from "next";
import "./globals.css";

// SEO 최적화 메타데이터 정의
export const metadata: Metadata = {
  title: "TaskFlow | Next-Gen 풀스택 Todo 서비스",
  description: "Next.js 15 App Router와 FastAPI, SQLite를 활용한 강력하고 심플한 할 일 관리 애플리케이션입니다.",
  keywords: ["Todo", "TaskFlow", "Next.js 15", "FastAPI", "SQLite", "풀스택", "포트폴리오"],
  authors: [{ name: "노은서" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 모바일 뷰포트 및 탭 아이콘 추가 보장 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* 메인 레이아웃 박스 (보라색 그림자 및 둥근 모서리) */}
        <main className="w-full max-w-[500px] bg-white px-6 py-8 sm:px-8 sm:py-10 rounded-3xl shadow-[0_10px_25px_-5px_rgba(103,43,224,0.08),0_8px_16px_-6px_rgba(103,43,224,0.04)]">
          {children}
        </main>
      </body>
    </html>
  );
}
