/**
 * Модуль для работы с данными с полным функционалом
 */

// Ключи для хранения данных
const SCHEDULE_KEY = 'tgasu_schedule';
const CONSULTATIONS_KEY = 'tgasu_consultations';
const EXAMS_KEY = 'tgasu_exams';

/**
 * Проверяет, является ли неделя четной
 */
function isEvenWeek(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weekNumber = Math.ceil((date - startOfYear) / millisecondsPerWeek);
    return weekNumber % 2 === 0;
}

/**
 * Получает расписание для недели
 */
function getScheduleForWeek() {
    const schedule = getStorageItem(SCHEDULE_KEY);
    if (!schedule) {
        const newSchedule = generateMockSchedule();
        setStorageItem(SCHEDULE_KEY, newSchedule);
        return newSchedule;
    }
    return schedule;
}

/**
 * Получает занятие по ID
 */
function getLessonById(id) {
    const schedule = getScheduleForWeek();
    return schedule.find(lesson => lesson.id === id);
}

/**
 * Добавляет новое занятие
 */
function addLesson(lessonData) {
    const schedule = getScheduleForWeek();
    const newLesson = {
        id: generateId(),
        ...lessonData
    };
    schedule.push(newLesson);
    setStorageItem(SCHEDULE_KEY, schedule);
    return newLesson;
}

/**
 * Обновляет занятие
 */
function updateLesson(id, lessonData) {
    const schedule = getScheduleForWeek();
    const index = schedule.findIndex(lesson => lesson.id === id);
    if (index !== -1) {
        schedule[index] = { ...schedule[index], ...lessonData };
        setStorageItem(SCHEDULE_KEY, schedule);
        return schedule[index];
    }
    return null;
}

/**
 * Удаляет занятие
 */
function removeLesson(id) {
    const schedule = getScheduleForWeek();
    const filteredSchedule = schedule.filter(lesson => lesson.id !== id);
    setStorageItem(SCHEDULE_KEY, filteredSchedule);
    return true;
}

/**
 * Получает консультации
 */
function getConsultations() {
    const consultations = getStorageItem(CONSULTATIONS_KEY);
    if (!consultations) {
        const newConsultations = generateMockConsultations();
        setStorageItem(CONSULTATIONS_KEY, newConsultations);
        return newConsultations;
    }
    return consultations;
}

/**
 * Добавляет консультацию
 */
function addConsultation(consultationData) {
    const consultations = getConsultations();
    const newConsultation = {
        id: generateId(),
        ...consultationData
    };
    consultations.push(newConsultation);
    setStorageItem(CONSULTATIONS_KEY, consultations);
    return newConsultation;
}

/**
 * Получает экзамены
 */
function getExams() {
    const exams = getStorageItem(EXAMS_KEY);
    if (!exams) {
        const newExams = generateMockExams();
        setStorageItem(EXAMS_KEY, newExams);
        return newExams;
    }
    return exams;
}

/**
 * Добавляет экзамен
 */
function addExam(examData) {
    const exams = getExams();
    const newExam = {
        id: generateId(),
        ...examData
    };
    exams.push(newExam);
    setStorageItem(EXAMS_KEY, exams);
    return newExam;
}

// Мок-данные
const mockSubjects = [
    'Строительная механика',
    'Архитектурное проектирование',
    'Геодезия',
    'Строительные материалы',
    'Железобетонные конструкции',
    'Металлические конструкции',
    'Основания и фундаменты',
    'Технология строительного производства',
    'Инженерная графика',
    'Математика',
    'Физика',
    'Химия'
];

const mockTeachers = [
    'Иванов И.И.',
    'Петров П.П.',
    'Сидоров С.С.',
    'Козлов К.К.',
    'Смирнов С.М.',
    'Николаев Н.Н.',
    'Федоров Ф.Ф.',
    'Михайлов М.М.'
];

const mockRooms = [
    '101', '102', '103', '104', '105',
    '201', '202', '203', '204', '205',
    '301', '302', '303', '304', '305',
    '401', '402', '403', '404', '405'
];

const mockGroups = [
    ['ПГС-101', 'ПГС-102'],
    ['АД-201', 'АД-202'],
    ['СТР-301'],
    ['ГЕО-101'],
    ['ПГС-201']
];

/**
 * Генерирует мок-расписание
 */
function generateMockSchedule() {
    const schedule = [];
    const timeSlots = ['8:00-9:30', '9:40-11:10', '11:20-12:50', '13:00-14:30', '14:40-16:10', '16:20-17:50'];
    const lessonTypes = ['Лекция', 'Практика', 'Лабораторная'];
    
    // Генерируем занятия для каждого дня недели
    for (let day = 0; day < 6; day++) { // Пн-Сб
        // Генерируем от 3 до 5 занятий в день
        const lessonsCount = Math.floor(Math.random() * 3) + 3;
        const usedTimeSlots = new Set();
        
        for (let i = 0; i < lessonsCount; i++) {
            let timeSlot;
            do {
                timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
            } while (usedTimeSlots.has(timeSlot));
            
            usedTimeSlots.add(timeSlot);
            
            const lesson = {
                id: generateId(),
                subject: mockSubjects[Math.floor(Math.random() * mockSubjects.length)],
                type: lessonTypes[Math.floor(Math.random() * lessonTypes.length)],
                teacher: mockTeachers[Math.floor(Math.random() * mockTeachers.length)],
                room: mockRooms[Math.floor(Math.random() * mockRooms.length)],
                time: timeSlot,
                day,
                groups: mockGroups[Math.floor(Math.random() * mockGroups.length)]
            };
            
            schedule.push(lesson);
        }
    }
    
    return schedule;
}

/**
 * Генерирует мок-консультации
 */
function generateMockConsultations() {
    const consultations = [];
    
    for (let i = 0; i < 8; i++) {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 21)); // В ближайшие 3 недели
        
        const consultation = {
            id: generateId(),
            subject: mockSubjects[Math.floor(Math.random() * mockSubjects.length)],
            teacher: mockTeachers[Math.floor(Math.random() * mockTeachers.length)],
            date: date.toISOString(),
            time: `${Math.floor(Math.random() * 8) + 9}:00`,
            room: mockRooms[Math.floor(Math.random() * mockRooms.length)],
            groups: mockGroups[Math.floor(Math.random() * mockGroups.length)].join(', '),
            comment: Math.random() > 0.6 ? getRandomComment() : ''
        };
        
        consultations.push(consultation);
    }
    
    return consultations.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Генерирует мок-экзамены
 */
function generateMockExams() {
    const exams = [];
    
    for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 45) + 15); // Через 15-60 дней
        
        const exam = {
            id: generateId(),
            subject: mockSubjects[Math.floor(Math.random() * mockSubjects.length)],
            teacher: mockTeachers[Math.floor(Math.random() * mockTeachers.length)],
            date: date.toISOString(),
            time: `${Math.floor(Math.random() * 6) + 9}:00`,
            room: mockRooms[Math.floor(Math.random() * mockRooms.length)],
            groups: mockGroups[Math.floor(Math.random() * mockGroups.length)].join(', '),
            status: getRandomExamStatus()
        };
        
        exams.push(exam);
    }
    
    return exams.sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Получает случайный комментарий для консультации
 */
function getRandomComment() {
    const comments = [
        'Принести конспекты лекций',
        'Подготовить вопросы по теме',
        'Взять калькулятор',
        'Принести чертежные принадлежности',
        'Повторить материал прошлой лекции',
        'Подготовить практические задания',
        'Принести методические указания'
    ];
    
    return comments[Math.floor(Math.random() * comments.length)];
}

/**
 * Получает случайный статус экзамена
 */
function getRandomExamStatus() {
    const statuses = [
        'Запланирован',
        'Подтвержден',
        'Перенесен',
        'В процессе'
    ];
    
    return statuses[Math.floor(Math.random() * statuses.length)];
}
