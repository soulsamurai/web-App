/**
 * Модуль для работы с интерфейсом
 */

// Текущие фильтры расписания
let currentFilters = {
    faculty: '',
    group: ''
};

/**
 * Инициализирует интерфейс приложения
 */
function initializeUI() {
    initializeNavigation();
    initializeForms();
    initializeSchedule();
    initializeConsultations();
    initializeExams();
    initializeAdminPanel();
    initializeNotifications();
    initializeUserProfile();
    initializeScheduleFilters();
    initializeWeekNavigation();
}

/**
 * Инициализирует навигацию
 */
function initializeNavigation() {
    // Обработчики для основной навигации
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            setActiveTab(tab);
        });
    });
    
    // Обработчики для мобильной навигации
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            setActiveTab(tab);
            toggleMobileMenu();
        });
    });
    
    // Кнопка мобильного меню
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Кнопка профиля пользователя
    const userProfileBtn = document.getElementById('user-profile-btn');
    userProfileBtn.addEventListener('click', toggleUserMenu);
    
    // Кнопка уведомлений
    const notificationsBtn = document.getElementById('notifications-btn');
    notificationsBtn.addEventListener('click', toggleNotificationsMenu);
    
    // Обработчики для кнопок профиля
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
    });
    
    document.getElementById('mobile-logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
    });
    
    document.getElementById('profile-link').addEventListener('click', (e) => {
        e.preventDefault();
        showUserProfile();
    });
    
    document.getElementById('mobile-profile-link').addEventListener('click', (e) => {
        e.preventDefault();
        showUserProfile();
        toggleMobileMenu();
    });
    
    document.getElementById('settings-link').addEventListener('click', (e) => {
        e.preventDefault();
        showUserSettings();
    });
    
    document.getElementById('mobile-settings-link').addEventListener('click', (e) => {
        e.preventDefault();
        showUserSettings();
        toggleMobileMenu();
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        const userMenu = document.getElementById('user-menu');
        const notificationsMenu = document.getElementById('notifications-menu');
        
        if (!userProfileBtn.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.add('hidden');
        }
        
        if (notificationsBtn && !notificationsBtn.contains(e.target) && !notificationsMenu.contains(e.target)) {
            notificationsMenu.classList.add('hidden');
        }
    });
}

/**
 * Устанавливает активную вкладку
 */
function setActiveTab(tab) {
    // Скрываем все страницы
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        page.classList.add('hidden');
    });
    
    // Показываем выбранную страницу
    const activePage = document.getElementById(`${tab}-page`);
    if (activePage) {
        activePage.classList.remove('hidden');
    }
    
    // Обновляем активные ссылки в навигации
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-tab') === tab) {
            link.classList.add('bg-blue-700');
        } else {
            link.classList.remove('bg-blue-700');
        }
    });
    
    // Обновляем активные ссылки в мобильной навигации
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        if (link.getAttribute('data-tab') === tab) {
            link.classList.add('bg-gray-100');
        } else {
            link.classList.remove('bg-gray-100');
        }
    });
    
    // Обновляем данные на странице
    switch (tab) {
        case 'schedule':
            updateScheduleUI();
            break;
        case 'consultations':
            updateConsultationsUI();
            break;
        case 'exams':
            updateExamsUI();
            break;
        case 'admin':
            updateAdminUI();
            break;
    }
}

/**
 * Переключает мобильное меню
 */
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
}

/**
 * Переключает меню пользователя
 */
function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    userMenu.classList.toggle('hidden');
}

/**
 * Переключает меню уведомлений
 */
function toggleNotificationsMenu() {
    const notificationsMenu = document.getElementById('notifications-menu');
    notificationsMenu.classList.toggle('hidden');
    
    // Если меню открыто, отмечаем уведомления как прочитанные
    if (!notificationsMenu.classList.contains('hidden')) {
        markAllNotificationsAsRead();
        updateNotificationsUI();
    }
}

/**
 * Инициализирует формы
 */
function initializeForms() {
    // Форма входа
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(loginForm)) {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            try {
                login(email, password);
                showApp();
                showToast('Вы успешно вошли в систему', 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
    
    // Форма регистрации
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(registerForm)) {
            const name = document.getElementById('register-name').value;
            const surname = document.getElementById('register-surname').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const role = document.getElementById('register-role').value;
            
            try {
                register({
                    name,
                    surname,
                    email,
                    password,
                    role
                });
                
                showApp();
                showToast('Регистрация успешна', 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
    
    // Кнопки переключения между формами
    document.getElementById('go-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterPage();
    });
    
    document.getElementById('back-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginPage();
    });
    
    // Форма добавления консультации
    const consultationForm = document.getElementById('consultation-form');
    consultationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(consultationForm)) {
            const date = document.getElementById('consultation-date').value;
            const time = document.getElementById('consultation-time').value;
            const subject = document.getElementById('consultation-subject').value;
            const room = document.getElementById('consultation-room').value;
            const teacher = document.getElementById('consultation-teacher').value || getCurrentUser().surname + ' ' + getCurrentUser().name[0] + '.';
            const groups = document.getElementById('consultation-groups').value;
            const comment = document.getElementById('consultation-comment').value;
            
            try {
                addConsultation({
                    subject,
                    teacher,
                    type: 'Консультация',
                    date,
                    time,
                    room,
                    building: '1',
                    groups,
                    comment
                });
                
                toggleAddForm('consultation');
                updateConsultationsUI();
                showToast('Консультация добавлена', 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
    
    // Кнопки для формы консультации
    document.getElementById('add-consultation-btn').addEventListener('click', () => {
        toggleAddForm('consultation');
    });
    
    document.getElementById('cancel-consultation-btn').addEventListener('click', () => {
        toggleAddForm('consultation');
    });
    
    // Форма добавления экзамена
    const examForm = document.getElementById('exam-form');
    examForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(examForm)) {
            const date = document.getElementById('exam-date').value;
            const time = document.getElementById('exam-time').value;
            const subject = document.getElementById('exam-subject').value;
            const room = document.getElementById('exam-room').value;
            const teacher = document.getElementById('exam-teacher').value || getCurrentUser().surname + ' ' + getCurrentUser().name[0] + '.';
            const groups = document.getElementById('exam-groups').value;
            const type = document.querySelector('input[name="exam-type"]:checked').value;
            
            try {
                addExam({
                    subject,
                    course: '2',
                    teacher,
                    date,
                    time,
                    room,
                    building: '1',
                    groups,
                    type
                });
                
                toggleAddForm('exam');
                updateExamsUI();
                showToast('Экзамен добавлен', 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });
    
    // Кнопки для формы экзамена
    document.getElementById('add-exam-btn').addEventListener('click', () => {
        toggleAddForm('exam');
    });
    
    document.getElementById('cancel-exam-btn').addEventListener('click', () => {
        toggleAddForm('exam');
    });
    
    // Кнопки проверки аудитории
    document.getElementById('check-room-btn').addEventListener('click', () => {
        showToast('Аудитория свободна в указанное время', 'success');
    });
    
    document.getElementById('check-exam-room-btn').addEventListener('click', () => {
        showToast('Аудитория свободна в указанное время', 'success');
    });
}

/**
 * Переключает форму добавления
 */
function toggleAddForm(formType) {
    if (formType === 'consultation') {
        const form = document.getElementById('add-consultation-form');
        const examForm = document.getElementById('add-exam-form');
        form.classList.toggle('hidden');
        examForm.classList.add('hidden');
        
        if (!form.classList.contains('hidden')) {
            document.getElementById('consultation-form').reset();
            document.getElementById('consultation-teacher').value = getCurrentUser().surname + ' ' + getCurrentUser().name[0] + '.';
        }
    } else if (formType === 'exam') {
        const form = document.getElementById('add-exam-form');
        const consForm = document.getElementById('add-consultation-form');
        form.classList.toggle('hidden');
        consForm.classList.add('hidden');
        
        if (!form.classList.contains('hidden')) {
            document.getElementById('exam-form').reset();
            document.getElementById('exam-teacher').value = getCurrentUser().surname + ' ' + getCurrentUser().name[0] + '.';
        }
    }
}

/**
 * Инициализирует фильтры расписания
 */
function initializeScheduleFilters() {
    const facultySelect = document.getElementById('faculty-select');
    const groupSelect = document.getElementById('group-select');
    const applyFiltersBtn = document.getElementById('apply-filters');
    
    // Заполняем список факультетов
    const faculties = getFaculties();
    faculties.forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty.id;
        option.textContent = faculty.name;
        facultySelect.appendChild(option);
    });
    
    // Обработчик изменения факультета
    facultySelect.addEventListener('change', () => {
        const facultyId = facultySelect.value;
        
        // Очищаем список групп
        groupSelect.innerHTML = '';
        groupSelect.disabled = !facultyId;
        
        if (facultyId) {
            // Добавляем пустой вариант
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Выберите группу';
            groupSelect.appendChild(emptyOption);
            
            // Заполняем список групп
            const groups = getGroupsByFaculty(facultyId);
            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group.name;
                option.textContent = group.name;
                groupSelect.appendChild(option);
            });
        } else {
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Сначала выберите факультет';
            groupSelect.appendChild(emptyOption);
        }
    });
    
    // Обработчик применения фильтров
    applyFiltersBtn.addEventListener('click', () => {
        currentFilters.faculty = facultySelect.value;
        currentFilters.group = groupSelect.value;
        
        updateScheduleUI();
        showToast('Фильтры применены', 'success');
    });
}

/**
 * Инициализирует навигацию по неделям
 */
function initializeWeekNavigation() {
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const currentWeekBtn = document.getElementById('current-week-btn');
    
    prevWeekBtn.addEventListener('click', () => {
        const currentWeek = getCurrentWeek();
        const prevWeek = new Date(currentWeek);
        prevWeek.setDate(prevWeek.getDate() - 7);
        setCurrentWeek(prevWeek);
        updateScheduleUI();
        updateWeekDisplay();
    });
    
    nextWeekBtn.addEventListener('click', () => {
        const currentWeek = getCurrentWeek();
        const nextWeek = new Date(currentWeek);
        nextWeek.setDate(nextWeek.getDate() + 7);
        setCurrentWeek(nextWeek);
        updateScheduleUI();
        updateWeekDisplay();
    });
    
    currentWeekBtn.addEventListener('click', () => {
        setCurrentWeek(new Date());
        updateScheduleUI();
        updateWeekDisplay();
        showToast('Переход к текущей неделе', 'info');
    });
    
    // Инициализируем отображение недели
    updateWeekDisplay();
}

/**
 * Обновляет отображение текущей недели
 */
function updateWeekDisplay() {
    const currentWeek = getCurrentWeek();
    const weekEnd = new Date(currentWeek);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekDisplayElement = document.getElementById('current-week-display');
    const weekTypeElement = document.getElementById('week-type-display');
    
    if (weekDisplayElement) {
        weekDisplayElement.textContent = `${formatDate(currentWeek, 'short')} - ${formatDate(weekEnd, 'short')}`;
    }
    
    if (weekTypeElement) {
        const isEven = isEvenWeek(currentWeek);
        weekTypeElement.textContent = isEven ? 'Четная неделя' : 'Нечетная неделя';
    }
}

/**
 * Инициализирует расписание
 */
function initializeSchedule() {
    // Кнопки экспорта и печати
    document.getElementById('print-schedule').addEventListener('click', () => {
        window.print();
    });
    
    document.getElementById('export-schedule').addEventListener('click', () => {
        showToast('Расписание экспортировано', 'success');
    });
    
    // Инициализация расписания
    updateScheduleUI();
}

/**
 * Обновляет интерфейс расписания
 */
function updateScheduleUI() {
    const currentWeek = getCurrentWeek();
    const schedule = getScheduleForWeek(currentWeek, currentFilters);
    const tableBody = document.querySelector('#schedule-table tbody');
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    // Создаем структуру для расписания
    const timeSlots = ['8:00-9:30', '9:40-11:10', '11:20-12:50', '13:00-14:30', '14:40-16:10', '16:20-17:50'];
    const days = 6; // Пн-Сб
    
    // Создаем пустую сетку расписания
    const grid = {};
    timeSlots.forEach(time => {
        grid[time] = Array(days).fill(null);
    });
    
    // Заполняем сетку данными
    schedule.forEach(lesson => {
        if (timeSlots.includes(lesson.time) && lesson.day >= 0 && lesson.day < days) {
            if (!grid[lesson.time][lesson.day]) {
                grid[lesson.time][lesson.day] = [];
            }
            grid[lesson.time][lesson.day].push(lesson);
        }
    });
    
    // Создаем строки таблицы
    timeSlots.forEach(time => {
        const row = document.createElement('tr');
        
        // Ячейка времени
        const timeCell = document.createElement('td');
        timeCell.className = 'bg-gray-50 p-2 text-center border align-top';
        timeCell.textContent = time;
        row.appendChild(timeCell);
        
        // Ячейки для каждого дня
        for (let day = 0; day < days; day++) {
            const cell = document.createElement('td');
            cell.className = 'p-2 border align-top';
            
            const lessons = grid[time][day];
            if (lessons && lessons.length > 0) {
                lessons.forEach(lesson => {
                    const lessonElement = createScheduleItem(lesson);
                    cell.appendChild(lessonElement);
                });
            }
            
            row.appendChild(cell);
        }
        
        tableBody.appendChild(row);
    });
    
    updateWeekDisplay();
}

/**
 * Создает элемент занятия для расписания
 */
function createScheduleItem(lesson) {
    const div = document.createElement('div');
    div.className = 'schedule-item bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 mb-2';
    
    // Определяем цвет в зависимости от типа занятия
    let colorClass = 'border-blue-500 bg-blue-50';
    if (lesson.type === 'Практика') {
        colorClass = 'border-green-500 bg-green-50';
    } else if (lesson.type === 'Лабораторная') {
        colorClass = 'border-purple-500 bg-purple-50';
    }
    
    div.className = `schedule-item p-3 rounded-lg border-l-4 mb-2 ${colorClass}`;
    
    div.innerHTML = `
        <div class="font-medium text-gray-800">${lesson.subject}</div>
        <div class="text-sm text-gray-600">${lesson.type}</div>
        <div class="text-sm text-gray-600">Ауд. ${lesson.room}, корп. ${lesson.building}</div>
        <div class="text-sm text-gray-600">${lesson.teacher}</div>
        ${lesson.groups ? `<div class="text-xs text-gray-500">${lesson.groups.join(', ')}</div>` : ''}
    `;
    
    return div;
}

/**
 * Инициализирует консультации
 */
function initializeConsultations() {
    updateConsultationsUI();
    
    // Обработчик событий для списка консультаций
    document.getElementById('consultations-list').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const id = target.getAttribute('data-id');
        const action = target.getAttribute('data-action');
        
        if (action === 'edit-consultation') {
            editConsultation(id);
        } else if (action === 'delete-consultation') {
            confirmDeleteConsultation(id);
        }
    });
}

/**
 * Обновляет интерфейс консультаций
 */
function updateConsultationsUI() {
    const consultations = getConsultations();
    const container = document.getElementById('consultations-list');
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Добавляем консультации
    if (consultations.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">Нет запланированных консультаций</div>';
    } else {
        consultations.forEach(consultation => {
            const element = createConsultationItem(consultation);
            container.appendChild(element);
        });
    }
    
    // Скрываем кнопку добавления для студентов
    const addConsultationBtn = document.getElementById('add-consultation-btn');
    const currentUser = getCurrentUser();
    
    if (currentUser && currentUser.role === 'student') {
        addConsultationBtn.classList.add('hidden');
    } else {
        addConsultationBtn.classList.remove('hidden');
    }
}

/**
 * Создает элемент консультации
 */
function createConsultationItem(consultation) {
    const div = document.createElement('div');
    div.className = 'glass-card p-6 rounded-lg hover:shadow-lg transition-all duration-300';
    
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin');
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div>
                <h3 class="font-semibold text-lg text-blue-700">${consultation.subject}</h3>
                <p class="text-sm text-gray-600">${consultation.teacher}</p>
            </div>
            <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                ${consultation.type}
            </div>
        </div>
        
        <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-600">
                <i class="far fa-calendar mr-2 w-4"></i>
                <span>${formatDate(new Date(consultation.date))}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <i class="far fa-clock mr-2 w-4"></i>
                <span>${consultation.time}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-door-open mr-2 w-4"></i>
                <span>Ауд. ${consultation.room}, корп. ${consultation.building}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <i class="fas fa-users mr-2 w-4"></i>
                <span>Группы: ${consultation.groups}</span>
            </div>
        </div>
        
        ${consultation.comment ? `
            <div class="bg-gray-50 p-3 rounded-lg mb-4">
                <p class="text-sm text-gray-700">${consultation.comment}</p>
            </div>
        ` : ''}
        
        ${canEdit ? `
            <div class="flex justify-end gap-2">
                <button class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md text-sm" data-id="${consultation.id}" data-action="edit-consultation">
                    <i class="fas fa-edit mr-1"></i>Редактировать
                </button>
                <button class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md text-sm" data-id="${consultation.id}" data-action="delete-consultation">
                    <i class="fas fa-trash mr-1"></i>Удалить
                </button>
            </div>
        ` : ''}
    `;
    
    return div;
}

/**
 * Инициализирует экзамены
 */
function initializeExams() {
    updateExamsUI();
    
    // Обработчик событий для таблицы экзаменов
    document.getElementById('exams-table-body').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const id = target.getAttribute('data-id');
        const action = target.getAttribute('data-action');
        
        if (action === 'edit-exam') {
            editExam(id);
        } else if (action === 'delete-exam') {
            confirmDeleteExam(id);
        }
    });
}

/**
 * Обновляет интерфейс экзаменов
 */
function updateExamsUI() {
    const exams = getExams();
    const tableBody = document.getElementById('exams-table-body');
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    // Добавляем экзамены
    if (exams.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-500">Нет запланированных экзаменов</td></tr>';
    } else {
        exams.forEach(exam => {
            const row = createExamRow(exam);
            tableBody.appendChild(row);
        });
    }
    
    // Скрываем кнопку добавления для студентов
    const addExamBtn = document.getElementById('add-exam-btn');
    const currentUser = getCurrentUser();
    
    if (currentUser && currentUser.role === 'student') {
        addExamBtn.classList.add('hidden');
    } else {
        addExamBtn.classList.remove('hidden');
    }
}

/**
 * Создает строку экзамена для таблицы
 */
function createExamRow(exam) {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50 transition-colors';
    
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin');
    
    // Определяем цвет статуса
    let statusClass = 'bg-yellow-100 text-yellow-800';
    if (exam.status === 'Проведен') {
        statusClass = 'bg-green-100 text-green-800';
    } else if (exam.status === 'Отменен') {
        statusClass = 'bg-red-100 text-red-800';
    }
    
    row.innerHTML = `
        <td class="p-3">
            <div class="font-medium">${formatDate(new Date(exam.date))}</div>
        </td>
        <td class="p-3">
            <div class="font-medium">${exam.subject}</div>
            <div class="text-xs text-gray-500">${exam.course} курс</div>
        </td>
        <td class="p-3">${exam.teacher}</td>
        <td class="p-3">${exam.room}, корп. ${exam.building}</td>
        <td class="p-3">${exam.time}</td>
        <td class="p-3">${exam.groups}</td>
        <td class="p-3">
            <span class="px-2 py-1 ${statusClass} rounded-full text-xs font-medium">
                ${exam.status}
            </span>
        </td>
        <td class="p-3">
            ${canEdit ? `
                <div class="flex gap-2">
                    <button class="text-blue-600 hover:bg-blue-50 p-1 rounded" data-id="${exam.id}" data-action="edit-exam" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:bg-red-50 p-1 rounded" data-id="${exam.id}" data-action="delete-exam" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : '<span class="text-gray-400">—</span>'}
        </td>
    `;
    
    return row;
}

/**
 * Инициализирует админ-панель
 */
function initializeAdminPanel() {
    // Кнопка обновления данных
    document.getElementById('refresh-admin-data').addEventListener('click', () => {
        updateAdminUI();
        showToast('Данные обновлены', 'success');
    });
    
    // Кнопка синхронизации с Google
    document.getElementById('sync-google-btn').addEventListener('click', () => {
        const url = document.getElementById('google-sheet-url').value;
        syncWithGoogleSheets(url)
            .then(() => {
                showToast('Данные синхронизированы с Google Таблицами', 'success');
            })
            .catch(error => {
                showToast(error.message, 'error');
            });
    });
    
    // Кнопка интеграции с Google Таблицами
    document.getElementById('google-sheets-integration').addEventListener('click', () => {
        showGoogleSheetsModal();
    });
    
    // Кнопка добавления пользователя
    document.getElementById('add-user-btn').addEventListener('click', () => {
        showAddUserForm();
    });
    
    // Обработчик событий для таблицы пользователей
    document.getElementById('users-table-body').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const id = target.getAttribute('data-id');
        const action = target.getAttribute('data-action');
        
        if (action === 'edit-user') {
            editUser(id);
        } else if (action === 'delete-user') {
            confirmDeleteUser(id);
        }
    });
    
    // Инициализация админ-панели
    updateAdminUI();
}

/**
 * Обновляет интерфейс админ-панели
 */
function updateAdminUI() {
    const stats = getAdminStats();
    
    // Обновляем статистику
    document.getElementById('users-count').textContent = stats.usersCount;
    document.getElementById('students-count').textContent = stats.studentsCount;
    document.getElementById('teachers-count').textContent = stats.teachersCount;
    document.getElementById('rooms-usage').textContent = stats.roomsUsage;
    
    // Обновляем график посещаемости
    const attendanceChart = document.getElementById('attendance-chart');
    attendanceChart.innerHTML = '';
    attendanceChart.appendChild(createAttendanceChart(stats.attendanceData));
    
    // Обновляем график распределения пользователей
    const usersDistribution = document.getElementById('users-distribution');
    usersDistribution.innerHTML = '';
    usersDistribution.appendChild(createUsersDistributionChart(stats.usersDistribution));
    
    // Обновляем таблицу пользователей
    const users = getUsers();
    const tableBody = document.getElementById('users-table-body');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = createUserRow(user);
        tableBody.appendChild(row);
    });
}

/**
 * Создает график посещаемости
 */
function createAttendanceChart(data) {
    const container = document.createElement('div');
    container.className = 'h-64 flex items-end space-x-4 justify-center';
    
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    data.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'w-10 flex flex-col items-center';
        
        const barElement = document.createElement('div');
        barElement.className = 'bg-blue-500 w-8 rounded-t';
        barElement.style.height = `${value}%`;
        
        const label = document.createElement('div');
        label.className = 'mt-2 text-sm';
        label.textContent = days[index];
        
        bar.appendChild(barElement);
        bar.appendChild(label);
        container.appendChild(bar);
    });
    
    return container;
}

/**
 * Создает график распределения пользователей
 */
function createUsersDistributionChart(data) {
    const container = document.createElement('div');
    container.className = 'h-64 flex items-center justify-center';
    
    // Простая имитация круговой диаграммы
    const total = data.students + data.teachers + data.admins;
    const studentsPercent = Math.round((data.students / total) * 100);
    const teachersPercent = Math.round((data.teachers / total) * 100);
    const adminsPercent = 100 - studentsPercent - teachersPercent;
    
    container.innerHTML = `
        <div class="text-center">
            <div class="w-32 h-32 rounded-full border-8 border-blue-500 mx-auto mb-4"></div>
            <div class="space-y-2">
                <div class="flex items-center justify-center">
                    <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span class="text-sm">Студенты: ${studentsPercent}%</span>
                </div>
                <div class="flex items-center justify-center">
                    <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span class="text-sm">Преподаватели: ${teachersPercent}%</span>
                </div>
                <div class="flex items-center justify-center">
                    <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span class="text-sm">Администраторы: ${adminsPercent}%</span>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

/**
 * Создает строку пользователя для таблицы
 */
function createUserRow(user) {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50';
    
    // Определяем цвет роли
    let roleClass = 'bg-blue-100 text-blue-800';
    if (user.role === 'teacher') {
        roleClass = 'bg-purple-100 text-purple-800';
    } else if (user.role === 'admin') {
        roleClass = 'bg-red-100 text-red-800';
    }
    
    // Определяем цвет статуса
    const statusClass = user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    
    row.innerHTML = `
        <td class="p-3">${user.id}</td>
        <td class="p-3">${user.surname} ${user.name}</td>
        <td class="p-3">${user.email}</td>
        <td class="p-3">
            <span class="px-2 py-1 ${roleClass} rounded-full text-xs font-medium">
                ${user.role === 'student' ? 'Студент' : user.role === 'teacher' ? 'Преподаватель' : 'Администратор'}
            </span>
        </td>
        <td class="p-3">
            <span class="px-2 py-1 ${statusClass} rounded-full text-xs font-medium">
                ${user.active ? 'Активен' : 'Неактивен'}
            </span>
        </td>
        <td class="p-3">
            <div class="flex gap-2">
                <button class="text-blue-600 hover:bg-blue-50 p-1 rounded" data-id="${user.id}" data-action="edit-user" title="Редактировать">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:bg-red-50 p-1 rounded" data-id="${user.id}" data-action="delete-user" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

/**
 * Инициализирует уведомления
 */
function initializeNotifications() {
    updateNotificationsUI();
}

/**
 * Обновляет интерфейс уведомлений
 */
function updateNotificationsUI() {
    const notifications = getNotifications();
    const container = document.getElementById('notifications-list');
    const showAllBtn = document.getElementById('show-all-notifications');
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Показываем только первые 3 уведомления
    const displayNotifications = notifications.slice(0, 3);
    
    // Добавляем уведомления
    if (displayNotifications.length === 0) {
        container.innerHTML = '<div class="px-4 py-3 text-center text-gray-500">Нет уведомлений</div>';
    } else {
        displayNotifications.forEach(notification => {
            const div = document.createElement('div');
            div.className = 'px-4 py-3 border-b hover:bg-gray-50 cursor-pointer';
            
            // Форматируем дату
            const date = new Date(notification.date);
            const now = new Date();
            const diffMs = now - date;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            let dateText;
            if (diffDays === 0) {
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                if (diffHours === 0) {
                    const diffMinutes = Math.floor(diffMs / (1000 * 60));
                    dateText = `${diffMinutes} минут назад`;
                } else {
                    dateText = `${diffHours} часов назад`;
                }
            } else if (diffDays === 1) {
                dateText = 'Вчера';
            } else {
                dateText = formatDate(date, 'short');
            }
            
            div.innerHTML = `
                <p class="text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}">${notification.title}</p>
                <p class="text-xs text-gray-500">${notification.message}</p>
                <p class="text-xs text-gray-400 mt-1">${dateText}</p>
            `;
            
            // Отмечаем как прочитанное при клике
            div.addEventListener('click', () => {
                if (!notification.read) {
                    markNotificationAsRead(notification.id);
                    updateNotificationsUI();
                }
            });
            
            container.appendChild(div);
        });
    }
    
    // Показываем кнопку "Показать все" только если уведомлений больше 3
    if (notifications.length > 3) {
        showAllBtn.classList.remove('hidden');
    } else {
        showAllBtn.classList.add('hidden');
    }
    
    // Обновляем индикатор уведомлений
    const unreadCount = getUnreadNotificationsCount();
    const notificationDot = document.querySelector('.notification-dot');
    
    if (unreadCount > 0) {
        notificationDot.classList.remove('hidden');
    } else {
        notificationDot.classList.add('hidden');
    }
}

/**
 * Инициализирует профиль пользователя
 */
function initializeUserProfile() {
    updateUserProfileUI();
}

/**
 * Обновляет интерфейс профиля пользователя
 */
function updateUserProfileUI() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Обновляем имя пользователя
    document.getElementById('user-display-name').textContent = `${user.surname} ${user.name[0]}.`;
    document.getElementById('mobile-user-name').textContent = `${user.surname} ${user.name[0]}.`;
    
    // Показываем/скрываем админ-ссылки
    if (user.role === 'admin') {
        document.getElementById('admin-link').classList.remove('hidden');
        document.getElementById('admin-link-mobile').classList.remove('hidden');
    } else {
        document.getElementById('admin-link').classList.add('hidden');
        document.getElementById('admin-link-mobile').classList.add('hidden');
    }
    
    // Показываем/скрываем фильтры расписания для студентов
    const scheduleFilters = document.getElementById('schedule-filters');
    if (user.role === 'student') {
        scheduleFilters.classList.remove('hidden');
    } else {
        scheduleFilters.classList.add('hidden');
    }
}

/**
 * Показывает профиль пользователя
 */
function showUserProfile() {
    const user = getCurrentUser();
    if (!user) return;
    
    const content = document.createElement('div');
    content.className = 'space-y-4';
    content.innerHTML = `
        <div class="flex items-center">
            <img class="h-16 w-16 rounded-full mr-4" src="https://randomuser.me/api/portraits/men/1.jpg" alt="User">
            <div>
                <h3 class="text-lg font-medium">${user.surname} ${user.name}</h3>
                <p class="text-gray-500">${user.email}</p>
            </div>
        </div>
        <div class="mt-4">
            <p><span class="font-medium">Роль:</span> ${user.role === 'student' ? 'Студент' : user.role === 'teacher' ? 'Преподаватель' : 'Администратор'}</p>
            <p><span class="font-medium">Статус:</span> ${user.active ? 'Активен' : 'Неактивен'}</p>
        </div>
    `;
    
    showModal('Профиль пользователя', content, () => {
        document.getElementById('modal-overlay').classList.add('hidden');
        editUserProfile();
    }, null, {
        confirmText: 'Редактировать',
        cancelText: 'Закрыть'
    });
}

/**
 * Редактирует профиль пользователя
 */
function editUserProfile() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Создаем форму редактирования
    const form = document.createElement('form');
    form.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
    form.innerHTML = `
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input type="text" id="profile-name" class="w-full p-2 border rounded-lg" value="${user.name}" required>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
            <input type="text" id="profile-surname" class="w-full p-2 border rounded-lg" value="${user.surname}" required>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="profile-email" class="w-full p-2 border rounded-lg" value="${user.email}" required>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
            <input type="password" id="profile-password" class="w-full p-2 border rounded-lg" placeholder="Оставьте пустым, чтобы не менять">
        </div>
    `;
    
    // Показываем модальное окно
    showModal('Редактирование профиля', form, () => {
        // Обработчик подтверждения
        const updatedUser = {
            name: document.getElementById('profile-name').value,
            surname: document.getElementById('profile-surname').value,
            email: document.getElementById('profile-email').value
        };
        
        // Добавляем пароль только если он был введен
        const password = document.getElementById('profile-password').value;
        if (password) {
            updatedUser.password = password;
        }
        
        try {
            updateUser(user.id, updatedUser);
            
            // Обновляем данные текущего пользователя
            const { password: _, ...userWithoutPassword } = getUserById(user.id);
            setStorageItem(CURRENT_USER_KEY, userWithoutPassword);
            
            updateUserProfileUI();
            showToast('Профиль обновлен', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}

/**
 * Показывает настройки пользователя
 */
function showUserSettings() {
    const form = document.createElement('form');
    form.className = 'space-y-4';
    form.innerHTML = `
        <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Уведомления</label>
            <div class="flex items-center">
                <input type="checkbox" id="settings-notifications" class="h-4 w-4 text-blue-500 border-gray-300 rounded" checked>
                <label for="settings-notifications" class="ml-2">Получать уведомления по email</label>
            </div>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Тема оформления</label>
            <select class="w-full p-2 border rounded-lg">
                <option>Светлая</option>
                <option>Темная</option>
                <option>Автоматически</option>
            </select>
        </div>
    `;
    
    showModal('Настройки', form, () => {
        showToast('Настройки сохранены', 'success');
    }, null, {
        confirmText: 'Сохранить'
    });
}

/**
 * Выход пользователя из системы
 */
function logoutUser() {
    logout();
    showLoginPage();
    showToast('Вы вышли из системы', 'info');
}

/**
 * Показывает страницу входа
 */
function showLoginPage() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('app').classList.add('hidden');
}

/**
 * Показывает страницу регистрации
 */
function showRegisterPage() {
    document.getElementById('register-page').classList.remove('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app').classList.add('hidden');
}

/**
 * Показывает основное приложение
 */
function showApp() {
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    
    // Обновляем интерфейс
    updateUserProfileUI();
    setActiveTab('schedule');
}

/**
 * Показывает модальное окно интеграции с Google Таблицами
 */
function showGoogleSheetsModal() {
    const form = document.createElement('form');
    form.className = 'space-y-4';
    form.innerHTML = `
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ссылка на Google Таблицу</label>
            <input type="url" id="google-sheets-url" class="w-full p-2 border rounded-lg" placeholder="https://docs.google.com/spreadsheets/d/..." required>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Тип синхронизации</label>
            <select id="sync-type" class="w-full p-2 border rounded-lg">
                <option value="import">Импорт из таблицы</option>
                <option value="export">Экспорт в таблицу</option>
                <option value="sync">Двусторонняя синхронизация</option>
            </select>
        </div>
    `;
    
    showModal('Интеграция с Google Таблицами', form, () => {
        const url = document.getElementById('google-sheets-url').value;
        const syncType = document.getElementById('sync-type').value;
        
        syncWithGoogleSheets(url)
            .then(() => {
                showToast(`${syncType === 'import' ? 'Импорт' : syncType === 'export' ? 'Экспорт' : 'Синхронизация'} завершена успешно`, 'success');
            })
            .catch(error => {
                showToast(error.message, 'error');
            });
    }, null, {
        confirmText: 'Синхронизировать'
    });
}