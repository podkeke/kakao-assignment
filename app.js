/**
 * ==========================================
 * TaskFlow - Vanilla JS Todo Web App
 * 파일 역할: 애플리케이션의 데이터 제어 및 이벤트 관리 (로컬스토리지 연동 추가)
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------
    // 1. DOM 요소 캐싱
    // ------------------------------------------
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const errorMessage = document.getElementById('error-message');
    const filterTabs = document.querySelector('.filter-tabs');
    
    // 날짜 제어 관련 DOM 요소 캐싱
    const prevDateBtn = document.getElementById('prev-date-btn');
    const nextDateBtn = document.getElementById('next-date-btn');
    const currentDateDisplay = document.getElementById('current-date-display');

    // ------------------------------------------
    // 2. 애플리케이션 상태 (State) 및 상수 관리
    // ------------------------------------------
    // 로컬스토리지에 저장할 키 이름 상수 정의
    const LOCAL_STORAGE_KEY = 'taskflow_todos';

    // 할 일 목록 데이터를 저장하는 배열
    // 각 아이템 구조: { id: number, text: string, completed: boolean, isEditing: boolean, date: string (YYYY-MM-DD) }
    let todoItems = []; 

    // 현재 선택된 필터 상태 ('all' | 'active' | 'completed')
    let currentFilter = 'all';

    // 현재 선택된 기준 날짜 (Date 객체 형태)
    let currentDate = new Date();

    // ------------------------------------------
    // 3. 비즈니스 로직 및 이벤트 핸들러 함수
    // ------------------------------------------

    /**
     * 애플리케이션 초기화
     */
    function initializeApp() {
        console.log('TaskFlow App has been initialized!');
        
        // 1. 로컬스토리지에서 기존 Todo 로드
        todoItems = loadTodosFromLocalStorage();
        
        // 2. 화면 날짜 표시 갱신
        updateDateDisplay();
        
        // 3. 전체 리스너 등록
        registerEventListeners();
        
        // 4. 로드된 데이터 화면 렌더링
        renderTodoItems();
    }

    /**
     * 전체 이벤트 리스너 등록
     */
    function registerEventListeners() {
        // 할 일 등록 (Submit) 이벤트
        todoForm.addEventListener('submit', handleAddTodo);

        // 입력창 글자 입력 시 에러 메시지 초기화 이벤트
        todoInput.addEventListener('input', handleClearError);

        // Todo 리스트 영역 클릭 이벤트 위임 (완료, 수정, 저장, 취소, 삭제 처리)
        todoList.addEventListener('click', handleListClick);

        // 필터 탭 클릭 이벤트 리스너 등록
        filterTabs.addEventListener('click', handleFilterChange);

        // 날짜 네비게이션 버튼 클릭 이벤트 리스너 등록
        prevDateBtn.addEventListener('click', handlePrevDate);
        nextDateBtn.addEventListener('click', handleNextDate);
    }

    // ------------------------------------------
    // 3-1. 로컬스토리지 유틸리티 함수
    // ------------------------------------------

    /**
     * 로컬스토리지에서 Todo 목록 데이터를 가져와 파싱하는 함수
     * @returns {Array} Todo 배열
     */
    function loadTodosFromLocalStorage() {
        const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
        try {
            // 저장된 JSON 데이터가 존재하면 파싱하여 반환, 없으면 빈 배열 반환
            const parsedTodos = storedTodos ? JSON.parse(storedTodos) : [];
            
            // 보안/정합성 관리: 새로고침 로드 시 모든 수정(isEditing) 플래그를 false로 초기화
            return parsedTodos.map(todo => ({ ...todo, isEditing: false }));
        } catch (error) {
            console.error('로컬스토리지 데이터 파싱 실패:', error);
            return [];
        }
    }

    /**
     * 현재 상태(todoItems)를 JSON 문자열로 변환하여 로컬스토리지에 저장하는 함수
     */
    function saveTodosToLocalStorage() {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoItems));
        } catch (error) {
            console.error('로컬스토리지 저장 실패:', error);
        }
    }

    // ------------------------------------------
    // 3-2. 날짜 유틸리티 및 핸들러 함수
    // ------------------------------------------

    /**
     * Date 객체를 받아 비교용 문자열(YYYY-MM-DD)로 변환해주는 유틸리티 함수
     * @param {Date} date 
     * @returns {string} YYYY-MM-DD 형식 문자열
     */
    function getFormattedDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Date 객체를 받아 화면 표시용 한글 포맷 문자열로 변환해주는 유틸리티 함수
     * @param {Date} date 
     * @returns {string} 예: 2026년 6월 2일 (화)
     */
    function getDisplayDateString(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // 요일 배열 정의
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = dayNames[date.getDay()];

        return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
    }

    /**
     * 날짜 표시부의 텍스트를 현재 상태(currentDate)에 맞춰 갱신하는 함수
     */
    function updateDateDisplay() {
        currentDateDisplay.textContent = getDisplayDateString(currentDate);
    }

    /**
     * 이전 날짜로 이동하는 핸들러 함수
     */
    function handlePrevDate() {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
        renderTodoItems();
    }

    /**
     * 다음 날짜로 이동하는 핸들러 함수
     */
    function handleNextDate() {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
        renderTodoItems();
    }

    // ------------------------------------------
    // 3-3. CRUD 로직 관련 함수
    // ------------------------------------------

    /**
     * 에러 메시지 표시 함수
     * @param {string} message - 화면에 표시할 경고 메시지
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }

    /**
     * 에러 메시지 숨김 함수
     */
    function hideError() {
        errorMessage.textContent = '';
        errorMessage.classList.remove('show');
    }

    /**
     * 입력 필드 입력 시작 시 에러 숨김 핸들러
     */
    function handleClearError() {
        if (errorMessage.classList.contains('show')) {
            hideError();
        }
    }

    /**
     * [CREATE] 새로운 할 일을 추가하는 함수
     */
    function handleAddTodo(event) {
        event.preventDefault();
        
        const todoText = todoInput.value.trim();
        
        // 1. 비어있는 입력값 검증 (경고 메시지 노출)
        if (!todoText) {
            showError('할 일 내용을 입력해주세요.');
            todoInput.focus();
            return;
        }

        // 에러 상태 초기화
        hideError();

        // 2. 신규 Todo 객체 생성
        const newTodo = {
            id: Date.now(),                                     // 고유 ID (밀리초 단위 타임스탬프)
            text: todoText,                                     // 입력값
            completed: false,                                   // 완료 여부 기본값
            isEditing: false,                                   // 수정 모드 상태 기본값
            date: getFormattedDateString(currentDate)           // 현재 할 일이 종속될 대상 날짜 지정
        };

        // 3. 상태 업데이트
        todoItems.push(newTodo);

        // 4. 로컬스토리지에 저장 반영
        saveTodosToLocalStorage();

        // 5. 화면 렌더링
        renderTodoItems();
        
        // 6. 입력 필드 초기화 및 포커스 복원
        todoInput.value = '';
        todoInput.focus();
    }

    /**
     * [UPDATE / DELETE] 리스트 영역의 클릭 동작을 처리하는 이벤트 위임 함수
     */
    function handleListClick(event) {
        const target = event.target;
        // 클릭된 요소가 위치한 부모 li 엘리먼트에서 Todo ID 추출
        const todoItemEl = target.closest('.todo-item');
        if (!todoItemEl) return;

        const todoId = parseInt(todoItemEl.dataset.id, 10);

        // 1. 완료 토글 버튼 클릭 시
        if (target.classList.contains('toggle-btn')) {
            toggleTodoComplete(todoId);
        }
        
        // 2. 수정 버튼 클릭 시
        else if (target.classList.contains('edit-btn')) {
            // 저장 버튼이 아닌 수정 버튼일 때만 수정 모드로 변경
            if (target.textContent === '수정') {
                enableEditMode(todoId);
            } else if (target.textContent === '저장') {
                saveEditedTodo(todoId, todoItemEl);
            }
        }
        
        // 3. 취소 버튼 클릭 시 (수정 취소)
        else if (target.classList.contains('cancel-btn')) {
            disableEditMode(todoId);
        }

        // 4. 삭제 버튼 클릭 시
        else if (target.classList.contains('delete-btn')) {
            deleteTodo(todoId);
        }
    }

    /**
     * [FILTER] 필터 탭 클릭 시 필터 상태를 변경하고 UI를 갱신하는 함수
     */
    function handleFilterChange(event) {
        const target = event.target;
        
        // 버튼을 올바르게 클릭했는지 확인
        if (!target.classList.contains('filter-btn')) return;

        // 1. 기존 활성화된 탭의 active 클래스 제거 및 클릭된 탭에 추가
        const currentActiveBtn = filterTabs.querySelector('.filter-btn.active');
        if (currentActiveBtn) {
            currentActiveBtn.classList.remove('active');
        }
        target.classList.add('active');

        // 2. 선택된 필터 상태 업데이트 ('all', 'active', 'completed')
        currentFilter = target.dataset.filter;

        // 3. 필터 변경에 따른 목록 재렌더링
        renderTodoItems();
    }

    /**
     * [UPDATE] 할 일 완료 여부를 토글하는 함수
     */
    function toggleTodoComplete(id) {
        todoItems = todoItems.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodosToLocalStorage();
        renderTodoItems();
    }

    /**
     * [UPDATE] 할 일 수정 모드를 활성화하는 함수
     */
    function enableEditMode(id) {
        todoItems = todoItems.map(todo => 
            todo.id === id ? { ...todo, isEditing: true } : todo
        );
        renderTodoItems();
    }

    /**
     * [UPDATE] 할 일 수정 모드를 취소(비활성화)하는 함수
     */
    function disableEditMode(id) {
        todoItems = todoItems.map(todo => 
            todo.id === id ? { ...todo, isEditing: false } : todo
        );
        renderTodoItems();
    }

    /**
     * [UPDATE] 수정된 텍스트를 저장하는 함수
     */
    function saveEditedTodo(id, todoItemEl) {
        const editInput = todoItemEl.querySelector('.todo-edit-input');
        const updatedText = editInput.value.trim();

        // 수정 시에도 빈 값 검증 수행
        if (!updatedText) {
            showError('수정할 내용을 입력해주세요.');
            editInput.focus();
            return;
        }

        hideError();

        todoItems = todoItems.map(todo => 
            todo.id === id ? { ...todo, text: updatedText, isEditing: false } : todo
        );
        saveTodosToLocalStorage();
        renderTodoItems();
    }

    /**
     * [DELETE] 할 일을 삭제하는 함수
     */
    function deleteTodo(id) {
        todoItems = todoItems.filter(todo => todo.id !== id);
        saveTodosToLocalStorage();
        renderTodoItems();
    }

    /**
     * [READ] 현재 todoItems 상태 배열을 바탕으로 UI 화면을 렌더링하는 함수 (날짜 필터 및 상태 필터링 동시 적용)
     */
    function renderTodoItems() {
        todoList.innerHTML = '';

        // 기준 날짜 문자열 가져오기
        const targetDateString = getFormattedDateString(currentDate);

        // 1차 필터링: 선택된 날짜와 일치하는 Todo만 선별
        // 2차 필터링: 현재 필터 상태에 맞춰 완료 여부 선별
        const filteredTodos = todoItems.filter(todo => {
            // 날짜 불일치 시 제외
            if (todo.date !== targetDateString) return false;

            // 상태 탭에 따른 분기
            if (currentFilter === 'active') {
                return !todo.completed; // 진행 중
            }
            if (currentFilter === 'completed') {
                return todo.completed;  // 완료
            }
            return true; // 전체
        });

        // 필터링된 목록을 순회하며 DOM 요소 생성
        filteredTodos.forEach(todo => {
            // li 엘리먼트 생성
            const todoItemEl = document.createElement('li');
            todoItemEl.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItemEl.dataset.id = todo.id;

            // 1. 완료 토글 버튼
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-btn';
            todoItemEl.appendChild(toggleBtn);

            // 2. 텍스트 / 인풋 영역 컨테이너
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'todo-content-wrapper';

            if (todo.isEditing) {
                // 수정 모드일 때: input 요소 삽입
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.className = 'todo-edit-input';
                editInput.value = todo.text;
                contentWrapper.appendChild(editInput);
                
                // 마운트 후 바로 포커스 및 엔터키 저장 지원
                setTimeout(() => {
                    editInput.focus();
                    // input 내에서 엔터 키 입력 시 바로 저장
                    editInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            saveEditedTodo(todo.id, todoItemEl);
                        }
                    });
                }, 0);
            } else {
                // 일반 모드일 때: span 요소 삽입
                const todoText = document.createElement('span');
                todoText.className = 'todo-text';
                todoText.textContent = todo.text;
                contentWrapper.appendChild(todoText);
            }
            todoItemEl.appendChild(contentWrapper);

            // 3. 버튼 그룹 영역 (수정, 삭제 등)
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';

            if (todo.isEditing) {
                // 수정 중일 때: [저장] [취소] 버튼
                const saveBtn = document.createElement('button');
                saveBtn.className = 'action-btn edit-btn';
                saveBtn.textContent = '저장';
                buttonGroup.appendChild(saveBtn);

                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'action-btn cancel-btn';
                cancelBtn.textContent = '취소';
                buttonGroup.appendChild(cancelBtn);
            } else {
                // 일반 상태일 때: [수정] [삭제] 버튼
                const editBtn = document.createElement('button');
                editBtn.className = 'action-btn edit-btn';
                editBtn.textContent = '수정';
                buttonGroup.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'action-btn delete-btn';
                deleteBtn.textContent = '삭제';
                buttonGroup.appendChild(deleteBtn);
            }
            todoItemEl.appendChild(buttonGroup);

            // 최종 리스트 추가
            todoList.appendChild(todoItemEl);
        });
    }

    // ------------------------------------------
    // 4. 앱 실행
    // ------------------------------------------
    initializeApp();
});
