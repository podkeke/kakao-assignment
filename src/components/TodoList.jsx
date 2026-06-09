import React from 'react';
import TodoItem from './TodoItem';
import { getFormattedDateString, getDisplayDateString } from '../utils/dateUtils';

const TodoList = ({
  todos,
  currentDate,
  currentFilter,
  onToggleComplete,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  setErrorMessage,
}) => {
  const targetDateString = getFormattedDateString(currentDate);

  // 1차 필터: 선택한 날짜의 할 일만 선별
  // 2차 필터: 필터 탭 상태에 따라 선별
  const filteredTodos = todos.filter((todo) => {
    if (todo.date !== targetDateString) return false;

    if (currentFilter === 'active') {
      return !todo.completed;
    }
    if (currentFilter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  return (
    <section className="flex-1 flex flex-col min-h-0">
      <h3 className="mb-3 text-[1rem] font-bold text-primary text-left">
        {`${getDisplayDateString(currentDate)} 할 일`}
      </h3>
      
      <ul className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1 list-none todo-scrollbar">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={onToggleComplete}
            onStartEdit={onStartEdit}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            onDelete={onDelete}
            setErrorMessage={setErrorMessage}
          />
        ))}
        {filteredTodos.length === 0 && (
          <li className="text-center py-8 text-slate-400 text-[0.95rem]">
            등록된 할 일이 없습니다.
          </li>
        )}
      </ul>
    </section>
  );
};

export default TodoList;
