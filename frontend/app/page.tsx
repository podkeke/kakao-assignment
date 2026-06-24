import { redirect } from "next/navigation";

/**
 * 루트 페이지 (/)
 * 서비스 진입 시 메인 비즈니스 도메인인 /todos 로 안전하게 리다이렉트합니다.
 */
export default function RootPage() {
  redirect("/todos");
}
