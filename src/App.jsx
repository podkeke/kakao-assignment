import React, { useState, useEffect } from 'react';
import DateNavigator from './components/DateNavigator';
import TodoForm from './components/TodoForm';
import FilterTabs from './components/FilterTabs';
import TodoList from './components/TodoList';
import { getFormattedDateString } from './utils/dateUtils';

const LOCAL_STORAGE_KEY = 'taskflow_todos';

function App() {
  // 1. 상태 관리
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 보안/정합성 관리: 새로고침 시 모든 수정 모드 비활성화
        return parsed.map(todo => ({ ...todo, isEditing: false }));
      }
    } catch (error) {
      console.error('로컬스토리지 데이터 로드 에러:', error);
    }
    return [];
  });

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  // 2. 로컬스토리지 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('로컬스토리지 데이터 저장 에러:', error);
    }
  }, [todos]);

  // 3. 할 일 추가(Create) 핸들러
  const handleAddTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      isEditing: false,
      date: getFormattedDateString(currentDate),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  // 4. 완료 여부 토글(Update) 핸들러
  const handleToggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 5. 수정 모드 시작(Update) 핸들러
  const handleStartEdit = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  // 6. 수정 모드 취소(Update) 핸들러
  const handleCancelEdit = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isEditing: false } : todo
      )
    );
  };

  // 7. 수정 모드 저장(Update) 핸들러
  const handleSaveEdit = (id, newText) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
      )
    );
  };

  // 8. 삭제(Delete) 핸들러
  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 select-none">
      <div className="bg-white w-full max-w-[500px] px-7.5 py-10 rounded-3xl shadow-[0_10px_25px_-5px_rgba(103,43,224,0.08),0_8px_16px_-6px_rgba(103,43,224,0.04)]">
        {/* 헤더 영역 */}
        <header className="mb-7.5">
          <div className="mb-4 text-left">
            <h1 className="text-[2.2rem] font-bold text-slate-800 tracking-tight mb-1.5 leading-none">
              TaskFlow
            </h1>
            <p className="text-[0.95rem] text-slate-400 font-light">
              오늘의 할 일을 깔끔하게 관리해보세요.
            </p>
          </div>

          {/* 주간 캘린더 네비게이터 */}
          <DateNavigator
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            todos={todos}
          />
        </header>

        {/* 할 일 입력 폼 */}
        <TodoForm
          onAddTodo={handleAddTodo}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />

        {/* 필터 탭 */}
        <FilterTabs currentFilter={filter} setCurrentFilter={setFilter} />

        {/* 할 일 리스트 */}
        <TodoList
          todos={todos}
          currentDate={currentDate}
          currentFilter={filter}
          onToggleComplete={handleToggleComplete}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDelete}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </div>
  );
}

export default App;
