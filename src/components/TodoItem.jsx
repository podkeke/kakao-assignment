import React, { useState, useEffect, useRef } from 'react';

const TodoItem = ({
  todo,
  onToggleComplete,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  setErrorMessage,
}) => {
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef(null);

  // 수정 모드 활성화 시 자동 포커스
  useEffect(() => {
    if (todo.isEditing && editInputRef.current) {
      editInputRef.current.focus();
      // 텍스트 끝으로 커서 이동시키기 위해 값 초기화 후 재할당
      const length = editText.length;
      editInputRef.current.setSelectionRange(length, length);
    }
  }, [todo.isEditing]);

  // 수정 내용 저장 핸들러
  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setErrorMessage('수정할 내용을 입력해주세요.');
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
      return;
    }
    setErrorMessage('');
    onSaveEdit(todo.id, trimmed);
  };

  // 엔터 키 입력 시 저장 지원
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancelEdit(todo.id);
    }
  };

  return (
    <li
      className={`flex items-center gap-3.5 p-3.5 border rounded-xl transition-all duration-250 hover:shadow-[0_4px_12px_rgba(103,43,224,0.03)] hover:border-primary-light ${
        todo.completed
          ? 'bg-[#fcfaff] border-[#e8e3f7]'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* 1. 완료 토글 버튼 */}
      <button
        onClick={() => onToggleComplete(todo.id)}
        className={`w-5.5 h-5.5 border-2 rounded-full cursor-pointer relative transition-all flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 ${
          todo.completed
            ? 'border-primary bg-primary text-white'
            : 'border-slate-200 bg-white hover:border-primary hover:bg-primary-light'
        }`}
        aria-label={todo.completed ? '미완료로 변경' : '완료로 변경'}
      >
        {todo.completed && (
          <span className="text-[10px] font-bold select-none">✓</span>
        )}
      </button>

      {/* 2. 텍스트 / 수정창 영역 */}
      <div className="flex-1 min-w-0 flex items-center">
        {todo.isEditing ? (
          <input
            type="text"
            ref={editInputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2.5 py-1.5 border-2 border-primary rounded-lg text-[0.95rem] outline-none bg-white focus:shadow-sm"
          />
        ) : (
          <span
            className={`text-[0.95rem] text-slate-800 break-all whitespace-pre-wrap select-none transition-all duration-250 ${
              todo.completed ? 'line-through text-slate-400' : ''
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      {/* 3. 버튼 그룹 */}
      <div className="flex gap-1.5 flex-shrink-0">
        {todo.isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="text-[0.8rem] font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer bg-primary-light text-primary hover:bg-primary hover:text-white"
            >
              저장
            </button>
            <button
              onClick={() => {
                setEditText(todo.text); // 원래 텍스트로 복구
                setErrorMessage('');
                onCancelEdit(todo.id);
              }}
              className="text-[0.8rem] font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onStartEdit(todo.id)}
              className="text-[0.8rem] font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer bg-primary-light text-primary hover:bg-primary hover:text-white"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="text-[0.8rem] font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer bg-[#ffebeb] text-danger hover:bg-danger hover:text-white"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
