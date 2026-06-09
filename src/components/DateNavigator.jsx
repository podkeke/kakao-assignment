import React from 'react';
import { getFormattedDateString, getMonday } from '../utils/dateUtils';

const DateNavigator = ({ currentDate, setCurrentDate, todos }) => {
  // 현재 선택된 날짜가 포함된 주의 월요일 계산
  const monday = getMonday(currentDate);
  
  // 일요일 계산 (월요일 + 6일)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // 주간 이동 핸들러
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // 월요일부터 일요일까지 7일간의 날짜 배열 생성
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });

  const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
  const todayString = getFormattedDateString(new Date());
  const selectedString = getFormattedDateString(currentDate);

  return (
    <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      {/* 캘린더 헤더 (주차 제어) */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevWeek}
          className="w-8 h-8 flex items-center justify-center rounded-full text-primary font-bold hover:bg-primary-light hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="이전 주차"
        >
          &lt;
        </button>
        <span className="text-[1.02rem] font-bold text-primary bg-primary-light px-3.5 py-1.5 rounded-full select-none">
          {`${monday.getMonth() + 1}/${monday.getDate()} ~ ${sunday.getMonth() + 1}/${sunday.getDate()}`}
        </span>
        <button
          onClick={handleNextWeek}
          className="w-8 h-8 flex items-center justify-center rounded-full text-primary font-bold hover:bg-primary-light hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="다음 주차"
        >
          &gt;
        </button>
      </div>

      {/* 주간 캘린더 요일 카드 목록 */}
      <div className="grid grid-cols-7 gap-1.5 justify-stretch">
        {weekDays.map((day, index) => {
          const formattedDate = getFormattedDateString(day);
          const isToday = formattedDate === todayString;
          const isSelected = formattedDate === selectedString;
          const todoCount = todos.filter(todo => todo.date === formattedDate).length;

          // 스타일 지정을 위한 클래스 조합
          let cardClass = "flex flex-col items-center py-2.5 px-1 rounded-xl cursor-pointer select-none transition-all duration-200 border relative hover:translate-y-[-2px] ";
          
          if (isSelected) {
            if (isToday) {
              cardClass += "bg-gradient-to-br from-primary to-violet-500 text-white shadow-md border-transparent";
            } else {
              cardClass += "bg-primary text-white shadow-md border-transparent";
            }
          } else if (isToday) {
            cardClass += "border-2 border-primary bg-primary-light";
          } else {
            cardClass += "border-transparent hover:bg-slate-50";
          }

          return (
            <div
              key={formattedDate}
              onClick={() => setCurrentDate(day)}
              className={cardClass}
            >
              {/* 오늘 날짜 표시 점 */}
              {isToday && (
                <span className={`absolute top-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
              )}
              
              <span className={`text-[0.75rem] font-semibold mb-1 uppercase ${
                isSelected ? 'text-white/80' : isToday ? 'text-primary' : 'text-slate-400'
              }`}>
                {dayLabels[index]}
              </span>
              
              <span className={`w-7 h-7 flex items-center justify-center text-[1.05rem] font-bold rounded-full mb-1 transition-all ${
                isSelected ? 'text-white' : isToday ? 'bg-primary text-white' : 'text-slate-700'
              }`}>
                {day.getDate()}
              </span>

              <span className={`text-[0.7rem] font-semibold px-1.5 py-0.5 rounded-full min-w-4 text-center transition-all ${
                isSelected 
                  ? 'bg-white/25 text-white' 
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {todoCount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DateNavigator;
