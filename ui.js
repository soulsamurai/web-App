/**
 * Модуль интерфейса с полной мобильной адаптивностью
 */

/**
 * Инициализирует интерфейс
 */
function initializeUI() {
    updateUserProfile();
    updateScheduleUI();
    updateConsultationsUI();
    updateExamsUI();
    updateAdminUI();
    updateWeekDisplay();
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
        activePage.classList.add('fade-in');
    }
    
    // Обновляем активные ссылки
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('data-tab') === tab) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Обновляет профиль пользователя
 */
function updateUserProfile() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Обновляем имя пользователя
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) {
        userDisplayName.textContent = `${user.surname} ${user.name[0]}.`;
    }
    
    // Показываем/скрываем админ-ссылки
    const adminLink = document.getElementById('admin-link');
    const mobileAdminLink = document.getElementById('mobile-admin-link');
    
    if (user.role === 'admin') {
        if (adminLink) adminLink.classList.remove('hidden');
        if (mobileAdminLink) mobileAdminLink.classList.remove('hidden');
    } else {
        if (adminLink) adminLink.classList.add('hidden');
        if (mobileAdminLink) mobileAdminLink.classList.add('hidden');
    }
    
    // Показываем/скрываем кнопки для преподавателей
    const addLessonBtn = document.getElementById('add-lesson-btn');
    const addConsultationBtn = document.getElementById('add-consultation-btn');
    const addExamBtn = document.getElementById('add-exam-btn');
    
    if (user.role === 'teacher' || user.role === 'admin') {
        if (addLessonBtn) addLessonBtn.classList.remove('hidden');
        if (addConsultationBtn) addConsultationBtn.classList.remove('hidden');
        if (addExamBtn) addExamBtn.classList.remove('hidden');
    } else {
        if (addLessonBtn) addLessonBtn.classList.add('hidden');
        if (addConsultationBtn) addConsultationBtn.classList.add('hidden');
        if (addExamBtn) addExamBtn.classList.add('hidden');
    }
}

/**
 * Обновляет отображение недели
 */
function updateWeekDisplay() {
    const currentWeek = getCurrentWeekDate();
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
 * Получает дату текущей недели с учетом смещения
 */
function getCurrentWeekDate() {
    const now = new Date();
    now.setDate(now.getDate() + (currentWeekOffset * 7));
    
    // Получаем понедельник текущей недели
    const dayOfWeek = now.getDay() || 7; // Воскресенье = 0, преобразуем в 7
    const monday = new Date(now);
    monday.setDate(monday.getDate() - dayOfWeek + 1);
    
    return monday;
}

/**
 * Обновляет интерфейс расписания
 */
function updateScheduleUI() {
    const schedule = getScheduleForWeek();
    
    // Обновляем десктопную таблицу
    updateDesktopSchedule(schedule);
    
    // Обновляем мобильное расписание
    updateMobileSchedule(schedule);
}

/**
 * Обновляет десктопную таблицу расписания
 */
function updateDesktopSchedule(schedule) {
    const tableBody = document.querySelector('#schedule-table tbody');
    
    if (!tableBody) return;
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    // Временные слоты
    const timeSlots = ['8:00-9:30', '9:40-11:10', '11:20-12:50', '13:00-14:30', '14:40-16:10', '16:20-17:50'];
    const days = 6; // Пн-Сб
    
    // Создаем пустую сетку
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
        row.className = 'border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700';
        
        // Ячейка времени
        const timeCell = document.createElement('td');
        timeCell.className = 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-4 text-center border-r border-gray-200 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-200';
        timeCell.textContent = time;
        row.appendChild(timeCell);
        
        // Ячейки для каждого дня
        for (let day = 0; day < days; day++) {
            const cell = document.createElement('td');
            cell.className = 'p-3 border-r border-gray-200 dark:border-gray-600 min-h-[100px] align-top';
            
            const lessons = grid[time][day];
            if (lessons && lessons.length > 0) {
                lessons.forEach(lesson => {
                    const lessonElement = createScheduleItem(lesson);
                    cell.appendChild(lessonElement);
                });
            } else {
                cell.innerHTML = '<div class="text-gray-400 text-center text-sm">—</div>';
            }
            
            row.appendChild(cell);
        }
        
        tableBody.appendChild(row);
    });
}

/**
 * Обновляет мобильное расписание
 */
function updateMobileSchedule(schedule) {
    const mobileContainer = document.getElementById('mobile-schedule');
    
    if (!mobileContainer) return;
    
    // Очищаем контейнер
    mobileContainer.innerHTML = '';
    
    const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    
    // Группируем занятия по дням
    const scheduleByDay = {};
    for (let day = 0; day < 6; day++) {
        scheduleByDay[day] = schedule.filter(lesson => lesson.day === day);
    }
    
    // Создаем карточки для каждого дня
    for (let day = 0; day < 6; day++) {
        const dayLessons = scheduleByDay[day];
        
        const dayCard = document.createElement('div');
        dayCard.className = 'mobile-day-card';
        
        const dayHeader = document.createElement('h3');
        dayHeader.className = 'text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center';
        dayHeader.innerHTML = `
            <i class="fas fa-calendar-day mr-2 text-blue-500"></i>
            ${dayNames[day]}
        `;
        dayCard.appendChild(dayHeader);
        
        if (dayLessons.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-gray-500 dark:text-gray-400 text-center py-4';
            emptyMessage.textContent = 'Нет занятий';
            dayCard.appendChild(emptyMessage);
        } else {
            // Сортируем занятия по времени
            dayLessons.sort((a, b) => a.time.localeCompare(b.time));
            
            dayLessons.forEach(lesson => {
                const lessonCard = createMobileLessonCard(lesson);
                dayCard.appendChild(lessonCard);
            });
        }
        
        mobileContainer.appendChild(dayCard);
    }
}

/**
 * Создает мобильную карточку занятия
 */
function createMobileLessonCard(lesson) {
    const card = document.createElement('div');
    card.className = 'mobile-lesson-card';
    
    // Определяем цвет в зависимости от типа занятия
    if (lesson.type === 'Практика') {
        card.style.borderLeftColor = '#10b981';
    } else if (lesson.type === 'Лабораторная') {
        card.style.borderLeftColor = '#8b5cf6';
    }
    
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin');
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div class="font-semibold text-gray-800 dark:text-white">${lesson.subject}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                ${lesson.type}
            </div>
        </div>
        <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center">
                <i class="fas fa-clock mr-2 w-4 text-blue-500"></i>
                <span>${lesson.time}</span>
            </div>
            <div class="flex items-center">
                <i class="fas fa-door-open mr-2 w-4 text-purple-500"></i>
                <span>Ауд. ${lesson.room}</span>
            </div>
            <div class="flex items-center">
                <i class="fas fa-user mr-2 w-4 text-green-500"></i>
                <span>${lesson.teacher}</span>
            </div>
            ${lesson.groups ? `
                <div class="flex items-center">
                    <i class="fas fa-users mr-2 w-4 text-orange-500"></i>
                    <span>${lesson.groups.join(', ')}</span>
                </div>
            ` : ''}
        </div>
        ${canEdit ? `
            <div class="mt-3 flex gap-2">
                <button class="flex-1 text-xs text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors" onclick="editLesson('${lesson.id}')">
                    <i class="fas fa-edit mr-1"></i>Редактировать
                </button>
                <button class="flex-1 text-xs text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors" onclick="deleteLesson('${lesson.id}')">
                    <i class="fas fa-trash mr-1"></i>Удалить
                </button>
            </div>
        ` : ''}
    `;
    
    return card;
}

/**
 * Создает элемент занятия для десктопа
 */
function createScheduleItem(lesson) {
    const div = document.createElement('div');
    
    // Определяем цвет в зависимости от типа занятия
    let colorClass = 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800';
    if (lesson.type === 'Практика') {
        colorClass = 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800';
    } else if (lesson.type === 'Лабораторная') {
        colorClass = 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800';
    }
    
    div.className = `schedule-item p-3 rounded-lg border-l-4 mb-2 ${colorClass} hover:shadow-lg transition-all duration-300`;
    
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin');
    
    div.innerHTML = `
        <div class="font-semibold text-gray-800 dark:text-white text-sm">${lesson.subject}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">${lesson.type}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400 flex items-center mt-1">
            <i class="fas fa-door-open mr-1"></i>
            Ауд. ${lesson.room}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 flex items-center mt-1">
            <i class="fas fa-user mr-1"></i>
            ${lesson.teacher}
        </div>
        ${lesson.groups ? `<div class="text-xs text-gray-500 dark:text-gray-500 mt-1">${lesson.groups.join(', ')}</div>` : ''}
        ${canEdit ? `
            <div class="mt-2 flex gap-1">
                <button class="text-xs text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors" onclick="editLesson('${lesson.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-xs text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors" onclick="deleteLesson('${lesson.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        ` : ''}
    `;
    
    return div;
}

/**
 * Обновляет интерфейс консультаций
 */
function updateConsultationsUI() {
    const consultations = getConsultations();
    const container = document.getElementById('consultations-list');
    
    if (!container) return;
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    if (consultations.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-comments text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <p class="text-gray-500 dark:text-gray-400 text-lg">Нет запланированных консультаций</p>
            </div>
        `;
    } else {
        consultations.forEach(consultation => {
            const element = createConsultationItem(consultation);
            container.appendChild(element);
        });
    }
}

/**
 * Создает элемент консультации
 */
function createConsultationItem(consultation) {
    const div = document.createElement('div');
    div.className = 'glass-card p-4 sm:p-6 rounded-xl hover:shadow-xl transition-all duration-300';
    
    const consultationDate = new Date(consultation.date);
    const isUpcoming = consultationDate > new Date();
    
    div.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
            <div>
                <h3 class="font-semibold text-lg text-green-700 dark:text-green-400 flex items-center">
                    <i class="fas fa-comments mr-2"></i>
                    ${consultation.subject}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                    <i class="fas fa-user mr-2"></i>
                    ${consultation.teacher}
                </p>
            </div>
            ${isUpcoming ? '<div class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs self-start">Предстоящая</div>' : ''}
        </div>
        
        <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i class="far fa-calendar mr-3 w-4 text-green-500"></i>
                <span>${formatDate(consultationDate)}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i class="far fa-clock mr-3 w-4 text-blue-500"></i>
                <span>${consultation.time}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-door-open mr-3 w-4 text-purple-500"></i>
                <span>Ауд. ${consultation.room}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-users mr-3 w-4 text-orange-500"></i>
                <span>Группы: ${consultation.groups}</span>
            </div>
        </div>
        
        ${consultation.comment ? `
            <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p class="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                    <i class="fas fa-info-circle mr-2 mt-0.5 text-blue-500"></i>
                    ${consultation.comment}
                </p>
            </div>
        ` : ''}
    `;
    
    return div;
}

/**
 * Обновляет интерфейс экзаменов
 */
function updateExamsUI() {
    const exams = getExams();
    
    // Обновляем десктопную таблицу
    updateDesktopExams(exams);
    
    // Обновляем мобильные карточки
    updateMobileExams(exams);
}

/**
 * Обновляет десктопную таблицу экзаменов
 */
function updateDesktopExams(exams) {
    const tableBody = document.getElementById('exams-table-body');
    
    if (!tableBody) return;
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    if (exams.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-12">
                    <i class="fas fa-file-alt text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-400 text-lg">Нет запланированных экзаменов</p>
                </td>
            </tr>
        `;
    } else {
        exams.forEach(exam => {
            const row = createExamRow(exam);
            tableBody.appendChild(row);
        });
    }
}

/**
 * Обновляет мобильные карточки экзаменов
 */
function updateMobileExams(exams) {
    const mobileContainer = document.getElementById('mobile-exams');
    
    if (!mobileContainer) return;
    
    // Очищаем контейнер
    mobileContainer.innerHTML = '';
    
    if (exams.length === 0) {
        mobileContainer.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-file-alt text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <p class="text-gray-500 dark:text-gray-400 text-lg">Нет запланированных экзаменов</p>
            </div>
        `;
    } else {
        exams.forEach(exam => {
            const card = createMobileExamCard(exam);
            mobileContainer.appendChild(card);
        });
    }
}

/**
 * Создает мобильную карточку экзамена
 */
function createMobileExamCard(exam) {
    const card = document.createElement('div');
    card.className = 'mobile-exam-card';
    
    const examDate = new Date(exam.date);
    const isUpcoming = examDate > new Date();
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div>
                <h3 class="font-semibold text-lg text-red-700 dark:text-red-400">${exam.subject}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">${exam.teacher}</p>
            </div>
            ${isUpcoming ? '<div class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs">Предстоящий</div>' : ''}
        </div>
        
        <div class="space-y-2">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i class="far fa-calendar mr-3 w-4 text-red-500"></i>
                <span>${formatDate(examDate)}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i class="far fa-clock mr-3 w-4 text-blue-500"></i>
                <span>${exam.time}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-door-open mr-3 w-4 text-purple-500"></i>
                <span>Ауд. ${exam.room}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-users mr-3 w-4 text-orange-500"></i>
                <span>${exam.groups}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-info-circle mr-3 w-4 text-green-500"></i>
                <span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded text-xs">
                    ${exam.status}
                </span>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Создает строку экзамена для десктопа
 */
function createExamRow(exam) {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700';
    
    const examDate = new Date(exam.date);
    const isUpcoming = examDate > new Date();
    
    row.innerHTML = `
        <td class="p-4 text-gray-800 dark:text-gray-200">
            <div class="font-medium">${formatDate(examDate)}</div>
            ${isUpcoming ? '<div class="text-xs text-blue-600 dark:text-blue-400">Предстоящий</div>' : ''}
        </td>
        <td class="p-4 text-gray-800 dark:text-gray-200">
            <div class="font-medium">${exam.subject}</div>
        </td>
        <td class="p-4 text-gray-800 dark:text-gray-200">${exam.teacher}</td>
        <td class="p-4 text-gray-800 dark:text-gray-200">
            <div class="flex items-center">
                <i class="fas fa-door-open mr-2 text-purple-500"></i>
                ${exam.room}
            </div>
        </td>
        <td class="p-4 text-gray-800 dark:text-gray-200">
            <div class="flex items-center">
                <i class="far fa-clock mr-2 text-blue-500"></i>
                ${exam.time}
            </div>
        </td>
        <td class="p-4 text-gray-800 dark:text-gray-200">${exam.groups}</td>
        <td class="p-4">
            <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
                ${exam.status}
            </span>
        </td>
    `;
    
    return row;
}

/**
 * Обновляет интерфейс админ-панели
 */
function updateAdminUI() {
    const users = getUsers();
    
    // Обновляем статистику
    const usersCount = users.length;
    const studentsCount = users.filter(u => u.role === 'student').length;
    const teachersCount = users.filter(u => u.role === 'teacher').length;
    const adminsCount = users.filter(u => u.role === 'admin').length;
    
    const usersCountEl = document.getElementById('users-count');
    const studentsCountEl = document.getElementById('students-count');
    const teachersCountEl = document.getElementById('teachers-count');
    const adminsCountEl = document.getElementById('admins-count');
    
    if (usersCountEl) usersCountEl.textContent = usersCount;
    if (studentsCountEl) studentsCountEl.textContent = studentsCount;
    if (teachersCountEl) teachersCountEl.textContent = teachersCount;
    if (adminsCountEl) adminsCountEl.textContent = adminsCount;
}
