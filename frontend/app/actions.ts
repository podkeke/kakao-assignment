"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// -----------------------------------------------------------------------------
// 1. 표준 비동기 API 호출 함수 (Client Component 및 내부 호출용)
// -----------------------------------------------------------------------------

/**
 * getTodos
 * 서버 측에서 백엔드의 /todos API를 호출하여 전체 목록을 가져옵니다.
 */
export async function getTodos(): Promise<Todo[]> {
  try {
    const response = await api.get<Todo[]>("/todos");
    return response.data;
  } catch (error) {
    console.error("Error fetching todos in Server Action:", error);
    throw new Error("할 일 목록을 가져오는 중 오류가 발생했습니다.");
  }
}

/**
 * getTodoById
 * 특정 ID의 Todo 정보를 상세 조회합니다.
 */
export async function getTodoById(todoId: number): Promise<Todo> {
  try {
    const todos = await getTodos();
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) {
      throw new Error(`ID ${todoId}에 해당하는 할 일을 찾을 수 없습니다.`);
    }
    return todo;
  } catch (error) {
    console.error(`Error fetching todo by ID ${todoId} in Server Action:`, error);
    throw new Error("할 일 상세 정보를 가져오는 중 오류가 발생했습니다.");
  }
}

/**
 * createTodo
 * 새로운 할 일을 생성하고 캐시를 갱신합니다.
 */
export async function createTodo(title: string): Promise<Todo> {
  try {
    const response = await api.post<Todo>("/todos", {
      title,
      completed: false,
    });
    revalidatePath("/todos");
    return response.data;
  } catch (error) {
    console.error("Error creating todo in Server Action:", error);
    throw new Error("할 일을 생성하는 중 오류가 발생했습니다.");
  }
}

/**
 * updateTodo
 * 특정 ID의 할 일을 수정하고 캐시를 갱신합니다.
 */
export async function updateTodo(
  id: number,
  updates: { title?: string; completed?: boolean }
): Promise<Todo> {
  try {
    const response = await api.put<Todo>(`/todos/${id}`, updates);
    revalidatePath("/todos");
    revalidatePath(`/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error updating todo ${id} in Server Action:`, error);
    throw new Error("할 일을 수정하는 중 오류가 발생했습니다.");
  }
}

/**
 * deleteTodo
 * 특정 ID의 할 일을 삭제하고 캐시를 갱신합니다.
 */
export async function deleteTodo(id: number): Promise<{ message: string; id: number }> {
  try {
    const response = await api.delete<{ message: string; id: number }>(`/todos/${id}`);
    revalidatePath("/todos");
    return response.data;
  } catch (error) {
    console.error(`Error deleting todo ${id} in Server Action:`, error);
    throw new Error("할 일을 삭제하는 중 오류가 발생했습니다.");
  }
}


// -----------------------------------------------------------------------------
// 2. HTML Form 바인딩 전용 Server Actions (순수 Server Component 조작용)
// -----------------------------------------------------------------------------

/**
 * toggleTodoFormAction
 * 목록 화면의 순수 Server Component 내 HTML Form에서 제출 시 직접 실행되는 서버 액션입니다.
 * 
 * @param {FormData} formData - 폼 제출 데이터 (id, completed 포함)
 */
export async function toggleTodoFormAction(formData: FormData): Promise<void> {
  const idStr = formData.get("id");
  const completedStr = formData.get("completed");

  if (!idStr) return;

  const id = Number(idStr);
  const completed = completedStr === "true";

  try {
    await api.put(`/todos/${id}`, { completed });
    revalidatePath("/todos");
  } catch (error) {
    console.error("Error toggling todo status via Form Action:", error);
  }
}

/**
 * deleteTodoFormAction
 * 목록 화면의 순수 Server Component 내 HTML Form에서 제출 시 직접 실행되는 서버 액션입니다.
 * 
 * @param {FormData} formData - 폼 제출 데이터 (id 포함)
 */
export async function deleteTodoFormAction(formData: FormData): Promise<void> {
  const idStr = formData.get("id");
  if (!idStr) return;

  const id = Number(idStr);

  try {
    await api.delete(`/todos/${id}`);
    revalidatePath("/todos");
  } catch (error) {
    console.error("Error deleting todo via Form Action:", error);
  }
}
