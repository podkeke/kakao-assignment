import React, { useState, useRef, useEffect } from 'react';

const TodoForm = ({ onAddTodo, errorMessage, setErrorMessage }) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);

  // 폼 제출 이벤트 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedText = inputText.trim();

    if (!trimmedText) {
      setErrorMessage('할 일 내용을 입력해주세요.');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    setErrorMessage('');
    onAddTodo(trimmedText);
    setInputText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 입력 변경 시 에러 메시지 해제
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // 마운트 시 포커스
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <section className="mb-5">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-2.5">
          <input
            type="text"
            ref={inputRef}
            value={inputText}
            onChange={handleInputChange}
            placeholder="새로운 할 일을 입력하세요..."
            autoComplete="off"
            className="flex-1 px-4.5 py-3.5 border-2 border-slate-200 rounded-xl text-[0.95rem] outline-none transition-all duration-250 focus:border-primary"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white border-none rounded-xl px-6 text-[0.95rem] font-semibold transition-all duration-250 active:translate-y-0 hover:-translate-y-[1px] cursor-pointer"
          >
            추가
          </button>
        </div>
        {/* 입력값 누락 시 표시될 안내 메시지 */}
        <p
          className={`text-danger text-[0.85rem] mt-2 ml-1 min-h-[20px] font-medium transition-opacity duration-200 ${
            errorMessage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {errorMessage}
        </p>
      </form>
    </section>
  );
};

export default TodoForm;
