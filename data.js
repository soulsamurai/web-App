/**
 * Модуль для работы с данными приложения
 */

// Ключи для хранения данных
const SCHEDULE_KEY = 'tgasu_schedule';
const CONSULTATIONS_KEY = 'tgasu_consultations';
const EXAMS_KEY = 'tgasu_exams';
const NOTIFICATIONS_KEY = 'tgasu_notifications';
const FACULTIES_KEY = 'tgasu_faculties';
const GROUPS_KEY = 'tgasu_groups';
const CURRENT_WEEK_KEY = 'tgasu_current_week';

// Данные факультетов
const initialFaculties = [
    { id: 'ikeis', name: 'Институт кадастра, экономики и инженерных систем в строительстве' },
    { id: 'fmt', name: 'Факультет механических технологий' },
    { id: 'fds', name: 'Факультет дорожного строительства' },
    { id: 'fcs', name: 'Факультет гражданского строительства' },
    { id: 'fa', name: 'Факультет архитектуры' },
    { id: 'ic', name: 'Институт Цтиен' }
];

// Данные групп
const initialGroups = {
    'ikeis': [
        { id: 'KE-101', name: 'КЭ-101' }, { id: 'KE-102', name: 'КЭ-102' }, { id: 'KE-103', name: 'КЭ-103' },
        { id: 'KE-201', name: 'КЭ-201' }, { id: 'KE-202', name: 'КЭ-202' }, { id: 'IS-101', name: 'ИС-101' },
        { id: 'IS-102', name: 'ИС-102' }, { id: 'IS-201', name: 'ИС-201' }, { id: 'IS-301', name: 'ИС-301' },
        { id: 'IS-401', name: 'ИС-401' }
    ],
    'fmt': [
        { id: 'MT-101', name: 'МТ-101' }, { id: 'MT-102', name: 'МТ-102' }, { id: 'MT-103', name: 'МТ-103' },
        { id: 'MT-201', name: 'МТ-201' }, { id: 'MT-202', name: 'МТ-202' }, { id: 'MT-301', name: 'МТ-301' },
        { id: 'MT-302', name: 'МТ-302' }, { id: 'MT-401', name: 'МТ-401' }, { id: 'MT-402', name: 'МТ-402' },
        { id: 'MT-501', name: 'МТ-501' }
    ],
    'fds': [
        { id: 'DS-101', name: 'ДС-101' }, { id: 'DS-102', name: 'ДС-102' }, { id: 'DS-103', name: 'ДС-103' },
        { id: 'DS-201', name: 'ДС-201' }, { id: 'DS-202', name: 'ДС-202' }, { id: 'DS-301', name: 'ДС-301' },
        { id: 'DS-302', name: 'ДС-302' }, { id: 'DS-401', name: 'ДС-401' }, { id: 'DS-402', name: 'ДС-402' },
        { id: 'DS-501', name: 'ДС-501' }
    ],
    'fcs': [
        { id: 'PGS-101', name: 'ПГС-101' }, { id: 'PGS-102', name: 'ПГС-102' }, { id: 'PGS-103', name: 'ПГС-103' },
        { id: 'PGS-201', name: 'ПГС-201' }, { id: 'PGS-202', name: 'ПГС-202' }, { id: 'PGS-301', name: 'ПГС-301' },
        { id: 'PGS-302', name: 'ПГС-302' }, { id: 'PGS-401', name: 'ПГС-401' }, { id: 'PGS-402', name: 'ПГС-402' },
        { id: 'PGS-501', name: 'ПГС-501' }
    ],
    'fa': [
        { id: 'ARH-101', name: 'АРХ-101' }, { id: 'ARH-102', name: 'АРХ-102' }, { id: 'ARH-103', name: 'АРХ-103' },
        { id: 'ARH-201', name: 'АРХ-201' }, { id: 'ARH-202', name: 'АРХ-202' }, { id: 'ARH-301', name: 'АРХ-301' },
        { id: 'ARH-302', name: 'АРХ-302' }, { id: 'ARH-401', name: 'АРХ-401' }, { id: 'ARH-402', name: 'АРХ-402' },
        { id: 'ARH-501', name: 'АРХ-501' }
    ],
    'ic': [
        { id: 'IT-101', name: 'ИТ-101' }, { id: 'IT-102', name: 'ИТ-102' }, { id: 'IT-103', name: 'ИТ-103' },
        { id: 'IT-201', name: 'ИТ-201' }, { id: 'IT-202', name: 'ИТ-202' }, { id: 'IT-301', name: 'ИТ-301' },
        { id: 'IT-302', name: 'ИТ-302' }, { id: 'IT-401', name: 'ИТ-401' }, { id: 'IT-402', name: 'ИТ-402' },
        { id: 'IT-501', name: 'ИТ-501' }
    ]
};

// Предметы по факультетам
const subjectsByFaculty = {
    'ikeis': ['Кадастр недвижимости', 'Экономика строительства', 'Инженерные системы', 'Геодезия', 'Правоведение'],
    'fmt': ['Механика материалов', 'Технология машиностроения', 'Материаловедение', 'Сопротивление материалов', 'Детали машин'],
    'fds': ['Дорожные машины', 'Строительство дорог', 'Асфальтобетон', 'Мостостроение', 'Транспортная логистика'],
    'fcs': ['Строительная механика', 'Железобетонные конструкции', 'Технология строительства', 'Строительные материалы', 'Основания и фундаменты'],
    'fa': ['Архитектурное проектирование', 'История архитектуры', 'Композиция', 'Строительное черчение', 'Градостроительство'],
    'ic': ['Информационные технологии', 'Программирование', 'Базы данных', 'Компьютерная графика', 'Системный анализ']
};

// Преподаватели
const teachers = [
    'проф. Петров А.В.',
    'доц. Сидорова М.И.',
    'проф. Козлов С.П.',
    'ст.пр. Иванов В.С.',
    'доц. Смирнова Е.А.',
    'проф. Волков Д.Н.',
    'доц. Морозова Т.П.',
    'ст.пр. Федоров К.И.',
    'проф. Новиков Р.М.',
    'доц. Лебедева О.С.'
];

// Временные слоты
const timeSlots = [
    '8:00-9:30',
    '9:40-11:10',
    '11:20-12:50',
    '13:00-14:30',
    '14:40-16:10',
    '16:20-17:50'
];

// Типы занятий
const lessonTypes = ['Лекция', 'Практика', 'Лабораторная'];

// Аудитории
const rooms = ['101', '102', '115', '210', '301', '321', '405', '501'];

/**
 * Генерирует расписание для всех групп всех факультетов
 */
function generateFullSchedule() {
    const schedule = {};
    
    // Получаем текущую дату и определяем начало учебного года (1 сентября)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const academicYearStart = new Date(currentYear, 8, 1); // 1 сентября
    
    // Если текущая дата до 1 сентября, то учебный год начался в прошлом году
    if (currentDate < academicYearStart) {
        academicYearStart.setFullYear(currentYear - 1);
    }
    
    // Генерируем расписание на весь учебный год (36 недель)
    for (let week = 0; week < 36; week++) {
        const weekStart = new Date(academicYearStart);
        weekStart.setDate(weekStart.getDate() + week * 7);
        
        // Определяем четность недели (начинаем с нечетной)
        const isEvenWeek = week % 2 === 1;
        const weekKey = formatWeekKey(weekStart);
        
        schedule[weekKey] = {
            weekStart: weekStart.toISOString(),
            isEven: isEvenWeek,
            lessons: generateWeekSchedule(isEvenWeek)
        };
    }
    
    return schedule;
}

/**
 * Генерирует расписание на одну неделю
 */
function generateWeekSchedule(isEvenWeek) {
    const weekLessons = [];
    
    // Для каждого факультета
    Object.keys(initialGroups).forEach(facultyId => {
        const facultySubjects = subjectsByFaculty[facultyId];
        const facultyGroups = initialGroups[facultyId];
        
        // Для каждой группы факультета
        facultyGroups.forEach(group => {
            // Генерируем 4-6 занятий в неделю для каждой группы
            const lessonsPerWeek = Math.floor(Math.random() * 3) + 4; // 4-6 занятий
            
            for (let i = 0; i < lessonsPerWeek; i++) {
                const day = Math.floor(Math.random() * 6); // 0-5 (Пн-Сб)
                const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
                const subject = facultySubjects[Math.floor(Math.random() * facultySubjects.length)];
                const teacher = teachers[Math.floor(Math.random() * teachers.length)];
                const type = lessonTypes[Math.floor(Math.random() * lessonTypes.length)];
                const room = rooms[Math.floor(Math.random() * rooms.length)];
                
                // Проверяем, что в это время и день нет конфликта аудиторий
                const conflictExists = weekLessons.some(lesson => 
                    lesson.day === day && 
                    lesson.time === timeSlot && 
                    lesson.room === room
                );
                
                if (!conflictExists) {
                    weekLessons.push({
                        id: generateId(),
                        subject,
                        type,
                        teacher,
                        room,
                        building: Math.floor(Math.random() * 3) + 1, // 1-3 корпус
                        time: timeSlot,
                        day,
                        faculty: facultyId,
                        groups: [group.name],
                        weekType: isEvenWeek ? 'even' : 'odd'
                    });
                }
            }
        });
    });
    
    return weekLessons;
}

/**
 * Форматирует ключ недели
 */
function formatWeekKey(date) {
    const monday = getMonday(date);
    return monday.toISOString().split('T')[0];
}

/**
 * Получает понедельник для заданной даты
 */
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

/**
 * Инициализирует хранилище данных
 */
function initializeData() {
    if (!getStorageItem(SCHEDULE_KEY)) {
        const fullSchedule = generateFullSchedule();
        setStorageItem(SCHEDULE_KEY, fullSchedule);
    }
    
    if (!getStorageItem(CONSULTATIONS_KEY)) {
        setStorageItem(CONSULTATIONS_KEY, []);
    }
    
    if (!getStorageItem(EXAMS_KEY)) {
        setStorageItem(EXAMS_KEY, []);
    }
    
    if (!getStorageItem(NOTIFICATIONS_KEY)) {
        setStorageItem(NOTIFICATIONS_KEY, []);
    }
    
    if (!getStorageItem(FACULTIES_KEY)) {
        setStorageItem(FACULTIES_KEY, initialFaculties);
    }
    
    if (!getStorageItem(GROUPS_KEY)) {
        setStorageItem(GROUPS_KEY, initialGroups);
    }
    
    // Устанавливаем текущую неделю
    if (!getStorageItem(CURRENT_WEEK_KEY)) {
        setCurrentWeek(new Date());
    }
}

/**
 * Получает список факультетов
 */
function getFaculties() {
    return getStorageItem(FACULTIES_KEY, initialFaculties);
}

/**
 * Получает список групп для факультета
 */
function getGroupsByFaculty(facultyId) {
    const groups = getStorageItem(GROUPS_KEY, initialGroups);
    return groups[facultyId] || [];
}

/**
 * Получает текущую неделю
 */
function getCurrentWeek() {
    const currentWeekData = getStorageItem(CURRENT_WEEK_KEY);
    if (currentWeekData) {
        return new Date(currentWeekData);
    }
    return new Date();
}

/**
 * Устанавливает текущую неделю
 */
function setCurrentWeek(date) {
    const monday = getMonday(date);
    setStorageItem(CURRENT_WEEK_KEY, monday.toISOString());
}

/**
 * Получает расписание для конкретной недели
 */
function getScheduleForWeek(weekStart, filters = {}) {
    const schedule = getStorageItem(SCHEDULE_KEY, {});
    const weekKey = formatWeekKey(weekStart);
    const weekData = schedule[weekKey];
    
    if (!weekData) {
        return [];
    }
    
    let lessons = weekData.lessons || [];
    
    // Применяем фильтры
    if (filters.faculty || filters.group) {
        lessons = lessons.filter(lesson => {
            if (filters.faculty && lesson.faculty !== filters.faculty) {
                return false;
            }
            if (filters.group && !lesson.groups.includes(filters.group)) {
                return false;
            }
            return true;
        });
    }
    
    return lessons;
}

/**
 * Определяет четность недели
 */
function isEvenWeek(date) {
    const academicYearStart = new Date(date.getFullYear(), 8, 1); // 1 сентября
    if (date < academicYearStart) {
        academicYearStart.setFullYear(date.getFullYear() - 1);
    }
    
    const weekNumber = Math.floor((date - academicYearStart) / (7 * 24 * 60 * 60 * 1000));
    return weekNumber % 2 === 1;
}

/**
 * Добавляет занятие в расписание
 */
function addLesson(lessonData, weekStart) {
    const schedule = getStorageItem(SCHEDULE_KEY, {});
    const weekKey = formatWeekKey(weekStart);
    
    if (!schedule[weekKey]) {
        schedule[weekKey] = {
            weekStart: weekStart.toISOString(),
            isEven: isEvenWeek(weekStart),
            lessons: []
        };
    }
    
    const newLesson = {
        id: generateId(),
        ...lessonData,
        weekType: schedule[weekKey].isEven ? 'even' : 'odd'
    };
    
    schedule[weekKey].lessons.push(newLesson);
    setStorageItem(SCHEDULE_KEY, schedule);
    
    // Отправляем уведомления студентам
    sendLessonNotification('add', newLesson);
    
    return newLesson;
}

/**
 * Обновляет занятие в расписании
 */
function updateLesson(lessonId, lessonData, weekStart) {
    const schedule = getStorageItem(SCHEDULE_KEY, {});
    const weekKey = formatWeekKey(weekStart);
    
    if (!schedule[weekKey]) {
        return null;
    }
    
    const lessonIndex = schedule[weekKey].lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) {
        return null;
    }
    
    const oldLesson = { ...schedule[weekKey].lessons[lessonIndex] };
    schedule[weekKey].lessons[lessonIndex] = {
        ...schedule[weekKey].lessons[lessonIndex],
        ...lessonData
    };
    
    setStorageItem(SCHEDULE_KEY, schedule);
    
    // Отправляем уведомления студентам
    sendLessonNotification('update', schedule[weekKey].lessons[lessonIndex], oldLesson);
    
    return schedule[weekKey].lessons[lessonIndex];
}

/**
 * Удаляет занятие из расписания
 */
function deleteLesson(lessonId, weekStart) {
    const schedule = getStorageItem(SCHEDULE_KEY, {});
    const weekKey = formatWeekKey(weekStart);
    
    if (!schedule[weekKey]) {
        return false;
    }
    
    const lessonIndex = schedule[weekKey].lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) {
        return false;
    }
    
    const deletedLesson = schedule[weekKey].lessons[lessonIndex];
    schedule[weekKey].lessons.splice(lessonIndex, 1);
    setStorageItem(SCHEDULE_KEY, schedule);
    
    // Отправляем уведомления студентам
    sendLessonNotification('delete', deletedLesson);
    
    return true;
}

/**
 * Отправляет уведомления студентам об изменениях в расписании
 */
function sendLessonNotification(action, lesson, oldLesson = null) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
        return;
    }
    
    let message = '';
    let title = '';
    
    switch (action) {
        case 'add':
            title = 'Добавлено новое занятие';
            message = `Добавлено занятие "${lesson.subject}" на ${formatDate(new Date())} в ${lesson.time}`;
            break;
        case 'update':
            title = 'Изменение в расписании';
            message = `Изменено занятие "${lesson.subject}"`;
            if (oldLesson && oldLesson.time !== lesson.time) {
                message += ` - время изменено с ${oldLesson.time} на ${lesson.time}`;
            }
            if (oldLesson && oldLesson.room !== lesson.room) {
                message += ` - аудитория изменена с ${oldLesson.room} на ${lesson.room}`;
            }
            break;
        case 'delete':
            title = 'Занятие отменено';
            message = `Отменено занятие "${lesson.subject}" в ${lesson.time}`;
            break;
    }
    
    // Добавляем уведомление
    addNotification({
        title,
        message,
        type: 'schedule_change',
        lessonId: lesson.id,
        groups: lesson.groups
    });
    
    // Имитация отправки email (в реальном приложении здесь был бы API вызов)
    console.log(`Email отправлен студентам групп ${lesson.groups.join(', ')}: ${title} - ${message}`);
}

/**
 * Получает список консультаций
 */
function getConsultations() {
    return getStorageItem(CONSULTATIONS_KEY, []);
}

/**
 * Добавляет консультацию
 */
function addConsultation(consultationData) {
    const consultations = getConsultations();
    
    const newConsultation = {
        id: generateId(),
        ...consultationData,
        createdAt: new Date().toISOString()
    };
    
    consultations.push(newConsultation);
    consultations.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setStorageItem(CONSULTATIONS_KEY, consultations);
    
    // Добавляем уведомление
    addNotification({
        title: 'Новая консультация',
        message: `Добавлена консультация по предмету "${consultationData.subject}"`,
        type: 'consultation'
    });
    
    return newConsultation;
}

/**
 * Обновляет консультацию
 */
function updateConsultation(id, consultationData) {
    const consultations = getConsultations();
    const index = consultations.findIndex(consultation => consultation.id === id);
    
    if (index === -1) {
        throw new Error('Консультация не найдена');
    }
    
    consultations[index] = {
        ...consultations[index],
        ...consultationData,
        updatedAt: new Date().toISOString()
    };
    
    consultations.sort((a, b) => new Date(a.date) - new Date(b.date));
    setStorageItem(CONSULTATIONS_KEY, consultations);
    
    return consultations[index];
}

/**
 * Удаляет консультацию
 */
function deleteConsultation(id) {
    const consultations = getConsultations();
    const filteredConsultations = consultations.filter(consultation => consultation.id !== id);
    
    if (filteredConsultations.length === consultations.length) {
        return false;
    }
    
    setStorageItem(CONSULTATIONS_KEY, filteredConsultations);
    return true;
}

/**
 * Получает список экзаменов
 */
function getExams() {
    return getStorageItem(EXAMS_KEY, []);
}

/**
 * Добавляет экзамен
 */
function addExam(examData) {
    const exams = getExams();
    
    const newExam = {
        id: generateId(),
        ...examData,
        status: 'Ожидается',
        createdAt: new Date().toISOString()
    };
    
    exams.push(newExam);
    exams.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setStorageItem(EXAMS_KEY, exams);
    
    // Добавляем уведомление
    addNotification({
        title: 'Новый экзамен',
        message: `Добавлен экзамен по предмету "${examData.subject}"`,
        type: 'exam'
    });
    
    return newExam;
}

/**
 * Обновляет экзамен
 */
function updateExam(id, examData) {
    const exams = getExams();
    const index = exams.findIndex(exam => exam.id === id);
    
    if (index === -1) {
        throw new Error('Экзамен не найден');
    }
    
    exams[index] = {
        ...exams[index],
        ...examData,
        updatedAt: new Date().toISOString()
    };
    
    exams.sort((a, b) => new Date(a.date) - new Date(b.date));
    setStorageItem(EXAMS_KEY, exams);
    
    return exams[index];
}

/**
 * Удаляет экзамен
 */
function deleteExam(id) {
    const exams = getExams();
    const filteredExams = exams.filter(exam => exam.id !== id);
    
    if (filteredExams.length === exams.length) {
        return false;
    }
    
    setStorageItem(EXAMS_KEY, filteredExams);
    return true;
}

/**
 * Получает список уведомлений
 */
function getNotifications() {
    return getStorageItem(NOTIFICATIONS_KEY, []);
}

/**
 * Добавляет уведомление
 */
function addNotification(notificationData) {
    const notifications = getNotifications();
    
    const newNotification = {
        id: generateId(),
        ...notificationData,
        read: false,
        date: new Date().toISOString()
    };
    
    notifications.unshift(newNotification);
    
    // Ограничиваем количество уведомлений
    if (notifications.length > 50) {
        notifications.splice(50);
    }
    
    setStorageItem(NOTIFICATIONS_KEY, notifications);
    
    return newNotification;
}

/**
 * Отмечает уведомление как прочитанное
 */
function markNotificationAsRead(id) {
    const notifications = getNotifications();
    const index = notifications.findIndex(notification => notification.id === id);
    
    if (index !== -1) {
        notifications[index].read = true;
        setStorageItem(NOTIFICATIONS_KEY, notifications);
        return notifications[index];
    }
    
    return null;
}

/**
 * Отмечает все уведомления как прочитанные
 */
function markAllNotificationsAsRead() {
    const notifications = getNotifications();
    
    notifications.forEach(notification => {
        notification.read = true;
    });
    
    setStorageItem(NOTIFICATIONS_KEY, notifications);
}

/**
 * Удаляет уведомление
 */
function deleteNotification(id) {
    const notifications = getNotifications();
    const filteredNotifications = notifications.filter(notification => notification.id !== id);
    
    if (filteredNotifications.length === notifications.length) {
        return false;
    }
    
    setStorageItem(NOTIFICATIONS_KEY, filteredNotifications);
    return true;
}

/**
 * Получает количество непрочитанных уведомлений
 */
function getUnreadNotificationsCount() {
    const notifications = getNotifications();
    return notifications.filter(notification => !notification.read).length;
}

/**
 * Интеграция с Google Таблицами
 */
function syncWithGoogleSheets(spreadsheetUrl) {
    // Имитация синхронизации с Google Таблицами
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (spreadsheetUrl && spreadsheetUrl.includes('docs.google.com')) {
                // Имитация успешной синхронизации
                addNotification({
                    title: 'Синхронизация завершена',
                    message: 'Данные успешно синхронизированы с Google Таблицами',
                    type: 'sync'
                });
                resolve({ success: true, message: 'Синхронизация завершена успешно' });
            } else {
                reject(new Error('Неверная ссылка на Google Таблицу'));
            }
        }, 2000);
    });
}

/**
 * Получает статистику для админ-панели
 */
function getAdminStats() {
    const users = getUsers();
    const students = users.filter(user => user.role === 'student');
    const teachers = users.filter(user => user.role === 'teacher');
    const admins = users.filter(user => user.role === 'admin');
    
    // Статистика посещаемости (имитация)
    const attendanceData = [60, 75, 85, 55, 65, 45];
    
    // Распределение пользователей
    const usersDistribution = {
        students: students.length,
        teachers: teachers.length,
        admins: admins.length
    };
    
    // Занятость аудиторий (имитация)
    const roomsUsage = '83%';
    
    return {
        usersCount: users.length,
        studentsCount: students.length,
        teachersCount: teachers.length,
        adminsCount: admins.length,
        attendanceData,
        usersDistribution,
        roomsUsage
    };
}

// Инициализация при загрузке
initializeData();