import { NextResponse } from "next/server";
import axios from "axios";

// 백엔드 서버 URL 환경변수 로드
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // API Route 프록시 내부 통신 시 에러 발생 시에도 상태 코드를 그대로 전달하기 위해 true 설정
  validateStatus: () => true,
});

/**
 * GET /api/todos
 * 클라이언트의 조회 요청을 백엔드의 GET /todos 로 전달합니다.
 */
export async function GET() {
  try {
    const response = await api.get("/todos");
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy GET Error:", error.message);
    return NextResponse.json(
      { error: "백엔드 서버로부터 데이터를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/todos
 * 클라이언트의 생성 요청을 백엔드의 POST /todos 로 전달합니다.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await api.post("/todos", body);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy POST Error:", error.message);
    return NextResponse.json(
      { error: "백엔드 서버에 데이터를 추가하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/todos?id=X
 * 클라이언트의 수정 요청을 백엔드의 PUT /todos/X 로 전달합니다.
 * 쿼리 스트링에서 'id' 매개변수를 추출하여 백엔드의 경로 변수로 바인딩합니다.
 */
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "수정할 할 일의 ID가 제공되지 않았습니다. (?id=ID 형식 필요)" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const response = await api.put(`/todos/${id}`, body);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy PUT Error:", error.message);
    return NextResponse.json(
      { error: "백엔드 서버의 데이터를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/todos?id=X
 * 클라이언트의 삭제 요청을 백엔드의 DELETE /todos/X 로 전달합니다.
 * 쿼리 스트링에서 'id' 매개변수를 추출하여 백엔드의 경로 변수로 바인딩합니다.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "삭제할 할 일의 ID가 제공되지 않았습니다. (?id=ID 형식 필요)" },
        { status: 400 }
      );
    }

    const response = await api.delete(`/todos/${id}`);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy DELETE Error:", error.message);
    return NextResponse.json(
      { error: "백엔드 서버의 데이터를 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
