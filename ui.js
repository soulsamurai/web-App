/**
 * Модуль интерфейса с расширенным функционалом
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
    updatePeriodDisplay();
    updateViewToggle();
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
 * Обновляет отображение периода
 */
function updatePeriodDisplay() {
    const periodDisplayElement = document.getElementById('current-period-display');
    const periodTypeElement = document.getElementById('period-type-display');
    
    if (!periodDisplayElement || !periodTypeElement) return;
    
    if (currentView === 'week') {
        const currentWeek = getCurrentWeekDate();
        const weekEnd = new Date(currentWeek);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        periodDisplayElement.textContent = `${formatDate(currentWeek, 'short')} - ${formatDate(weekEnd, 'short')}`;
        
        const isEven = isEvenWeek(currentWeek);
        periodTypeElement.textContent = isEven ? 'Четная неделя' : 'Нечетная неделя';
    } else {
        const currentMonth = getCurrentMonthDate();
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        
        periodDisplayElement.textContent = `${formatDate(currentMonth, 'month')} ${currentMonth.getFullYear()}`;
        periodTypeElement.textContent = 'Месячный вид';
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
 * Получает дату текущего месяца с учетом смещения
 */
function getCurrentMonthDate() {
    const now = new Date();
    now.setMonth(now.getMonth() + Math.floor(currentWeekOffset / 4));
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Обновляет интерфейс расписания
 */
function updateScheduleUI() {
    let schedule;
    
    if (currentView === 'week') {
        schedule = getScheduleForWeek();
    } else {
        schedule = getScheduleForMonth();
    }
    
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
        row.className = 'border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700';
        
        // Ячейка времени
        const timeCell = document.createElement('td');
        timeCell.className = 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 p-4 text-center border-r border-slate-200 dark:border-slate-600 font-medium text-slate-800 dark:text-slate-200';
        timeCell.textContent = time;
        row.appendChild(timeCell);
        
        // Ячейки для каждого дня
        for (let day = 0; day < days; day++) {
            const cell = document.createElement('td');
            cell.className = 'p-3 border-r border-slate-200 dark:border-slate-600 min-h-[100px] align-top';
            
            const lessons = grid[time][day];
            if (lessons && lessons.length > 0) {
                lessons.forEach(lesson => {
                    const lessonElement = createScheduleItem(lesson);
                    cell.appendChild(lessonElement);
                });
            } else {
                cell.innerHTML = '<div class="text-slate-400 text-center text-sm">—</div>';
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
        dayHeader.className = 'text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center';
        
        // Выделяем текущий день
        const today = new Date().getDay();
        const isToday = (today === 0 ? 6 : today - 1) === day;
        
        dayHeader.innerHTML = `
            <i class="fas fa-calendar-day mr-2 ${isToday ? 'text-indigo-500' : 'text-slate-500'}"></i>
            ${dayNames[day]} ${isToday ? '<span class="text-sm text-indigo-500 ml-2">(сегодня)</span>' : ''}
        `;
        dayCard.appendChild(dayHeader);
        
        if (dayLessons.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-slate-500 dark:text-slate-400 text-center py-4';
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
            <div class="font-semibold text-slate-800 dark:text-white">${lesson.subject}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded">
                ${lesson.type}
            </div>
        </div>
        <div class="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <div class="flex items-center">
                <i class="fas fa-clock mr-2 w-4 text-indigo-500"></i>
                <span>${lesson.time}</span>
            </div>
            <div class="flex items-center">
                <i class="fas fa-door-open mr-2 w-4 text-purple-500"></i>
                <span>Ауд. ${lesson.room}</span>
            </div>
            <div class="flex items-center">
                <i class="fas fa-user mr-2 w-4 text-emerald-500"></i>
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
                <button class="flex-1 text-xs text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors" onclick="editLesson('${lesson.id}')">
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
    let colorClass = 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800';
    if (lesson.type === 'Практика') {
        colorClass = 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800';
    } else if (lesson.type === 'Лабораторная') {
        colorClass = 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800';
    }
    
    div.className = `schedule-item p-3 rounded-lg border-l-4 mb-2 ${colorClass} hover:shadow-lg transition-all duration-300`;
    
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin');
    
    div.innerHTML = `
        <div class="font-semibold text-slate-800 dark:text-white text-sm">${lesson.subject}</div>
        <div class="text-xs text-slate-600 dark:text-slate-400 mt-1">${lesson.type}</div>
        <div class="text-xs text-slate-600 dark:text-slate-400 flex items-center mt-1">
            <i class="fas fa-door-open mr-1"></i>
            Ауд. ${lesson.room}
        </div>
        <div class="text-xs text-slate-600 dark:text-slate-400 flex items-center mt-1">
            <i class="fas fa-user mr-1"></i>
            ${lesson.teacher}
        </div>
        ${lesson.groups ? `<div class="text-xs text-slate-500 dark:text-slate-500 mt-1">${lesson.groups.join(', ')}</div>` : ''}
        ${canEdit ? `
            <div class="mt-2 flex gap-1">
                <button class="text-xs text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors" onclick="editLesson('${lesson.id}')">
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
                <i class="fas fa-comments text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
                <p class="text-slate-500 dark:text-slate-400 text-lg">Нет запланированных консультаций</p>
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
    
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin');
    
    div.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
            <div>
                <h3 class="font-semibold text-lg text-emerald-700 dark:text-emerald-400 flex items-center">
                    <i class="fas fa-comments mr-2"></i>
                    ${consultation.subject}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 flex items-center mt-1">
                    <i class="fas fa-user mr-2"></i>
                    ${consultation.teacher}
                </p>
            </div>
            ${isUpcoming ? '<div class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs self-start">Предстоящая</div>' : ''}
        </div>
        
        <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <i class="far fa-calendar mr-3 w-4 text-emerald-500"></i>
                <span>${formatDate(consultationDate)}</span>
            </div>
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <i class="far fa-clock mr-3 w-4 text-indigo-500"></i>
                <span>${consultation.time}</span>
            </div>
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <i class="fas fa-door-open mr-3 w-4 text-purple-500"></i>
                <span>Ауд. ${consultation.room}</span>
            </div>
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <i class="fas fa-users mr-3 w-4 text-orange-500"></i>
                <span>Группы: ${consultation.groups}</span>
            </div>
        </div>
        
        ${consultation.comment ? `
            <div class="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg mb-4">
                <p class="text-sm text-slate-700 dark:text-slate-300 flex items-start">
                    <i class="fas fa-info-circle mr-2 mt-0.5 text-indigo-500"></i>
                    ${consultation.comment}
                </p>
            </div>
        ` : ''}
        
        ${canEdit ? `
            <div class="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-600">
                <button class="flex-1 text-sm text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors" onclick="editConsultation('${consultation.id}')">
                    <i class="fas fa-edit mr-1"></i>Редактировать
                </button>
                <button class="flex-1 text-sm text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors" onclick="deleteConsultation('${consultation.id}')">
                    <i class="fas fa-trash mr-1"></i>Удалить
                </button>
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
                <td colspan="8" class="text-center py-12">
                    <i class="fas fa-file-alt text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
                    <p class="text-slate-500 dark:text-slate-400 text-lg">Нет запланированных экзаменов</p>
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
                <i class="fas fa-file-alt text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
                <p class="text-slate-500 dark:text-slate-400 text-lg">Нет запланированных экзаменов</p>
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
    
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin');
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div>
                <h3 class="font-semibold text-lg text-red-700 dark:text-red-400">${exam.subject}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400">${exam.teacher}</p>
            </div>
            ${isUpcoming ? '<div class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs">Предстоящий</div>' : ''}
        </div>
        
        <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <i class="far fa-calendar mr-3 w-4 text-red-500"></i>
                <span>${formatDate(examDate)}</span>
            </div>
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <i class="far fa-clock mr-3 w-4 text-indigo-500"></i>
                <span>${exam.time}</span>
            </div>
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <i class="fas fa-door-open mr-3 w-4 text-purple-500"></i>
                <span>Ауд. ${exam.room}</span>
            </div>
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <i class="fas fa-users mr-3 w-4 text-orange-500"></i>
                <span>${exam.groups}</span>
            </div>
            <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <i class="fas fa-info-circle mr-3 w-4 text-emerald-500"></i>
                <span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded text-xs">
                    ${exam.status}
                </span>
            </div>
        </div>
        
        ${canEdit ? `
            <div class="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-600">
                <button class="flex-1 text-sm text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors" onclick="editExam('${exam.id}')">
                    <i class="fas fa-edit mr-1"></i>Редактировать
                </button>
                <button class="flex-1 text-sm text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors" onclick="deleteExam('${exam.id}')">
                    <i class="fas fa-trash mr-1"></i>Удалить
                </button>
            </div>
        ` : ''}
    `;
    
    return card;
}

/**
 * Создает строку экзамена для десктопа
 */
function createExamRow(exam) {
    const row = document.createElement('tr');
    row.className = 'border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700';
    
    const examDate = new Date(exam.date);
    const isUpcoming = examDate > new Date();
    
    const currentUser = getCurrentUser();
    const canEdit = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin');
    
    row.innerHTML = `
        <td class="p-4 text-slate-800 dark:text-slate-200">
            <div class="font-medium">${formatDate(examDate)}</div>
            ${isUpcoming ? '<div class="text-xs text-indigo-600 dark:text-indigo-400">Предстоящий</div>' : ''}
        </td>
        <td class="p-4 text-slate-800 dark:text-slate-200">
            <div class="font-medium">${exam.subject}</div>
        </td>
        <td class="p-4 text-slate-800 dark:text-slate-200">${exam.teacher}</td>
        <td class="p-4 text-slate-800 dark:text-slate-200">
            <div class="flex items-center">
                <i class="fas fa-door-open mr-2 text-purple-500"></i>
                ${exam.room}
            </div>
        </td>
        <td class="p-4 text-slate-800 dark:text-slate-200">
            <div class="flex items-center">
                <i class="far fa-clock mr-2 text-indigo-500"></i>
                ${exam.time}
            </div>
        </td>
        <td class="p-4 text-slate-800 dark:text-slate-200">${exam.groups}</td>
        <td class="p-4">
            <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
                ${exam.status}
            </span>
        </td>
        <td class="p-4">
            ${canEdit ? `
                <div class="flex gap-1">
                    <button class="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors" onclick="editExam('${exam.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors" onclick="deleteExam('${exam.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : '<span class="text-slate-400">—</span>'}
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
    
    // Обновляем таблицу пользователей
    updateUsersTable(users);
}

/**
 * Обновляет таблицу пользователей
 */
function updateUsersTable(users) {
    const tableBody = document.getElementById('users-table-body');
    
    if (!tableBody) return;
    
    // Очищаем таблицу
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700';
        
        row.innerHTML = `
            <td class="p-3 text-slate-800 dark:text-slate-200 font-mono text-sm">${user.id}</td>
            <td class="p-3 text-slate-800 dark:text-slate-200">${user.surname} ${user.name}</td>
            <td class="p-3 text-slate-800 dark:text-slate-200">${user.email}</td>
            <td class="p-3">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${getRoleColorClass(user.role)}">
                    ${getRoleDisplayName(user.role)}
                </span>
            </td>
            <td class="p-3">
                <button class="px-2 py-1 rounded-full text-xs font-medium transition-colors ${user.active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}" onclick="toggleUserStatus('${user.id}')">
                    ${user.active ? 'Активен' : 'Заблокирован'}
                </button>
            </td>
            <td class="p-3">
                <div class="flex gap-1">
                    <button class="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors" onclick="editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Получает отображаемое имя роли
 */
function getRoleDisplayName(role) {
    const roleNames = {
        'student': 'Студент',
        'teacher': 'Преподаватель',
        'admin': 'Администратор'
    };
    return roleNames[role] || role;
}

/**
 * Получает CSS класс для роли
 */
function getRoleColorClass(role) {
    const roleClasses = {
        'student': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
        'teacher': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
        'admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return roleClasses[role] || 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
}
