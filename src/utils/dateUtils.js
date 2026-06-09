/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환합니다.
 * @param {Date} date 
 * @returns {string} YYYY-MM-DD
 */
export function getFormattedDateString(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Date 객체를 화면 표시용 한글 포맷 문자열로 변환합니다.
 * @param {Date} date 
 * @returns {string} 예: 2026년 6월 2일 (화)
 */
export function getDisplayDateString(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = dayNames[d.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * 특정 날짜가 속한 주의 월요일 Date 객체를 반환합니다 (월요일 시작 기준).
 * @param {Date} date 
 * @returns {Date} 월요일 Date 객체
 */
export function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  // 일요일(0)이면 -6, 그 외에는 1 - day 만큼 날짜를 더함
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  // 시, 분, 초, 밀리초 초기화하여 날짜 비교 정합성 확보
  monday.setHours(0, 0, 0, 0);
  return monday;
}
