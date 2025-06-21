/**
 * Главный модуль приложения с расширенным функционалом
 */

let currentWeekOffset = 0;
let currentEditingLesson = null;
let currentEditingConsultation = null;
let currentEditingExam = null;
let currentView = 'week'; // 'week' или 'month'

/**
 * Инициализация приложения
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация приложения...');
    
    // Инициализируем тему
    initializeTheme();
    
    // Проверяем аутентификацию
    if (isAuthenticated()) {
        showApp();
    } else {
        showLoginPage();
    }
    
    // Инициализируем обработчики событий
    initializeEventListeners();
});

/**
 * Инициализирует тему
 */
function initializeTheme() {
    const savedTheme = getStorageItem('theme', 'light');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun text-lg"></i>';
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

/**
 * Переключает тему
 */
function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const themeToggle = document.getElementById('theme-toggle');
    
    if (isDark) {
        document.documentElement.classList.remove('dark');
        setStorageItem('theme', 'light');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon text-lg"></i>';
        }
    } else {
        document.documentElement.classList.add('dark');
        setStorageItem('theme', 'dark');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun text-lg"></i>';
        }
    }
}

/**
 * Инициализирует обработчики событий
 */
function initializeEventListeners() {
    // Форма входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Форма регистрации
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Форма сброса пароля
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPassword);
    }
    
    // Кнопки переключения между формами
    const goToRegisterBtn = document.getElementById('go-to-register');
    const backToLoginBtn = document.getElementById('back-to-login');
    const forgotPasswordBtn = document.getElementById('forgot-password');
    
    if (goToRegisterBtn) {
        goToRegisterBtn.addEventListener('click', showRegisterPage);
    }
    
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', showLoginPage);
    }
    
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', showResetModal);
    }
    
    // Модальное окно сброса пароля
    const resetCancel = document.getElementById('reset-cancel');
    const resetConfirm = document.getElementById('reset-confirm');
    
    if (resetCancel) {
        resetCancel.addEventListener('click', hideResetModal);
    }
    
    if (resetConfirm) {
        resetConfirm.addEventListener('click', handleResetPassword);
    }
    
    // Навигация
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            if (tab) {
                setActiveTab(tab);
                // Закрываем мобильное меню
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Профиль пользователя
    const userProfileBtn = document.getElementById('user-profile-btn');
    const profileLink = document.getElementById('profile-link');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', toggleUserMenu);
    }
    
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            showProfileModal();
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Навигация по времени
    const prevPeriodBtn = document.getElementById('prev-period');
    const nextPeriodBtn = document.getElementById('next-period');
    const currentDayBtn = document.getElementById('current-day-btn');
    const currentWeekBtn = document.getElementById('current-week-btn');
    
    if (prevPeriodBtn) {
        prevPeriodBtn.addEventListener('click', () => {
            if (currentView === 'week') {
                currentWeekOffset--;
            } else {
                currentWeekOffset -= 4; // Предыдущий месяц
            }
            updateScheduleUI();
            updatePeriodDisplay();
        });
    }
    
    if (nextPeriodBtn) {
        nextPeriodBtn.addEventListener('click', () => {
            if (currentView === 'week') {
                currentWeekOffset++;
            } else {
                currentWeekOffset += 4; // Следующий месяц
            }
            updateScheduleUI();
            updatePeriodDisplay();
        });
    }
    
    if (currentDayBtn) {
        currentDayBtn.addEventListener('click', () => {
            currentWeekOffset = 0;
            currentView = 'week';
            updateViewToggle();
            updateScheduleUI();
            updatePeriodDisplay();
            // Прокрутка к текущему дню
            scrollToCurrentDay();
        });
    }
    
    if (currentWeekBtn) {
        currentWeekBtn.addEventListener('click', () => {
            currentWeekOffset = 0;
            currentView = 'week';
            updateViewToggle();
            updateScheduleUI();
            updatePeriodDisplay();
        });
    }
    
    // Переключатели вида
    const viewToggles = document.querySelectorAll('.view-toggle');
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const view = toggle.getAttribute('data-view');
            if (view !== currentView) {
                currentView = view;
                currentWeekOffset = 0; // Сброс к текущему периоду
                updateViewToggle();
                updateScheduleUI();
                updatePeriodDisplay();
            }
        });
    });
    
    // Кнопки добавления
    const addLessonBtn = document.getElementById('add-lesson-btn');
    const addConsultationBtn = document.getElementById('add-consultation-btn');
    const addExamBtn = document.getElementById('add-exam-btn');
    
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', () => showLessonModal());
    }
    
    if (addConsultationBtn) {
        addConsultationBtn.addEventListener('click', () => showConsultationModal());
    }
    
    if (addExamBtn) {
        addExamBtn.addEventListener('click', () => showExamModal());
    }
    
    // Модальные окна
    initializeModalEventListeners();
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        const userMenu = document.getElementById('user-menu');
        const userProfileBtn = document.getElementById('user-profile-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (userMenu && userProfileBtn && !userProfileBtn.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.add('hidden');
        }
        
        if (mobileMenu && mobileMenuBtn && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

/**
 * Инициализирует обработчики модальных окон
 */
function initializeModalEventListeners() {
    // Модальное окно профиля
    const profileClose = document.getElementById('profile-close');
    if (profileClose) {
        profileClose.addEventListener('click', hideProfileModal);
    }
    
    // Модальное окно занятия
    const lessonCancel = document.getElementById('lesson-cancel');
    const lessonSave = document.getElementById('lesson-save');
    const lessonForm = document.getElementById('lesson-form');
    
    if (lessonCancel) {
        lessonCancel.addEventListener('click', hideLessonModal);
    }
    
    if (lessonSave) {
        lessonSave.addEventListener('click', saveLessonFromModal);
    }
    
    if (lessonForm) {
        lessonForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveLessonFromModal();
        });
    }
    
    // Модальное окно консультации
    const consultationCancel = document.getElementById('consultation-cancel');
    const consultationSave = document.getElementById('consultation-save');
    const consultationForm = document.getElementById('consultation-form');
    
    if (consultationCancel) {
        consultationCancel.addEventListener('click', hideConsultationModal);
    }
    
    if (consultationSave) {
        consultationSave.addEventListener('click', saveConsultationFromModal);
    }
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveConsultationFromModal();
        });
    }
    
    // Модальное окно экзамена
    const examCancel = document.getElementById('exam-cancel');
    const examSave = document.getElementById('exam-save');
    const examForm = document.getElementById('exam-form');
    
    if (examCancel) {
        examCancel.addEventListener('click', hideExamModal);
    }
    
    if (examSave) {
        examSave.addEventListener('click', saveExamFromModal);
    }
    
    if (examForm) {
        examForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveExamFromModal();
        });
    }
}

/**
 * Обновляет переключатель вида
 */
function updateViewToggle() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    viewToggles.forEach(toggle => {
        const view = toggle.getAttribute('data-view');
        if (view === currentView) {
            toggle.classList.add('active', 'bg-indigo-500', 'text-white');
            toggle.classList.remove('text-slate-600', 'dark:text-slate-400');
        } else {
            toggle.classList.remove('active', 'bg-indigo-500', 'text-white');
            toggle.classList.add('text-slate-600', 'dark:text-slate-400');
        }
    });
}

/**
 * Прокручивает к текущему дню
 */
function scrollToCurrentDay() {
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1; // Преобразуем воскресенье в субботу
    
    // Для мобильной версии
    const mobileDayCards = document.querySelectorAll('.mobile-day-card');
    if (mobileDayCards[dayIndex]) {
        mobileDayCards[dayIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Переключает мобильное меню
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

/**
 * Показывает модальное окно профиля
 */
function showProfileModal() {
    const modal = document.getElementById('profile-modal');
    const user = getCurrentUser();
    
    if (!modal || !user) return;
    
    // Заполняем данные профиля
    document.getElementById('profile-name').textContent = `${user.surname} ${user.name}`;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-role').textContent = getRoleDisplayName(user.role);
    document.getElementById('profile-id').textContent = user.id;
    document.getElementById('profile-created').textContent = formatDate(new Date(user.createdAt));
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Скрывает модальное окно профиля
 */
function hideProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

/**
 * Показывает модальное окно занятия
 */
function showLessonModal(lesson = null) {
    const modal = document.getElementById('lesson-modal');
    const title = document.getElementById('lesson-modal-title');
    
    if (!modal) return;
    
    currentEditingLesson = lesson;
    
    if (lesson) {
        title.textContent = 'Редактировать занятие';
        fillLessonForm(lesson);
    } else {
        title.textContent = 'Добавить занятие';
        clearLessonForm();
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Скрывает модальное окно занятия
 */
function hideLessonModal() {
    const modal = document.getElementById('lesson-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        currentEditingLesson = null;
    }
}

/**
 * Показывает модальное окно консультации
 */
function showConsultationModal(consultation = null) {
    const modal = document.getElementById('consultation-modal');
    const title = document.getElementById('consultation-modal-title');
    
    if (!modal) return;
    
    currentEditingConsultation = consultation;
    
    if (consultation) {
        title.textContent = 'Редактировать консультацию';
        fillConsultationForm(consultation);
    } else {
        title.textContent = 'Добавить консультацию';
        clearConsultationForm();
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Скрывает модальное окно консультации
 */
function hideConsultationModal() {
    const modal = document.getElementById('consultation-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        currentEditingConsultation = null;
    }
}

/**
 * Показывает модальное окно экзамена
 */
function showExamModal(exam = null) {
    const modal = document.getElementById('exam-modal');
    const title = document.getElementById('exam-modal-title');
    
    if (!modal) return;
    
    currentEditingExam = exam;
    
    if (exam) {
        title.textContent = 'Редактировать экзамен';
        fillExamForm(exam);
    } else {
        title.textContent = 'Добавить экзамен';
        clearExamForm();
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Скрывает модальное окно экзамена
 */
function hideExamModal() {
    const modal = document.getElementById('exam-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        currentEditingExam = null;
    }
}

/**
 * Заполняет форму занятия
 */
function fillLessonForm(lesson) {
    document.getElementById('lesson-subject').value = lesson.subject || '';
    document.getElementById('lesson-type').value = lesson.type || '';
    document.getElementById('lesson-teacher').value = lesson.teacher || '';
    document.getElementById('lesson-room').value = lesson.room || '';
    document.getElementById('lesson-day').value = lesson.day || '';
    document.getElementById('lesson-time').value = lesson.time || '';
    document.getElementById('lesson-groups').value = lesson.groups ? lesson.groups.join(', ') : '';
}

/**
 * Очищает форму занятия
 */
function clearLessonForm() {
    document.getElementById('lesson-subject').value = '';
    document.getElementById('lesson-type').value = 'Лекция';
    document.getElementById('lesson-teacher').value = '';
    document.getElementById('lesson-room').value = '';
    document.getElementById('lesson-day').value = '0';
    document.getElementById('lesson-time').value = '8:00-9:30';
    document.getElementById('lesson-groups').value = '';
}

/**
 * Заполняет форму консультации
 */
function fillConsultationForm(consultation) {
    document.getElementById('consultation-subject').value = consultation.subject || '';
    document.getElementById('consultation-teacher').value = consultation.teacher || '';
    document.getElementById('consultation-date').value = consultation.date ? consultation.date.split('T')[0] : '';
    document.getElementById('consultation-time').value = consultation.time || '';
    document.getElementById('consultation-room').value = consultation.room || '';
    document.getElementById('consultation-groups').value = consultation.groups || '';
    document.getElementById('consultation-comment').value = consultation.comment || '';
}

/**
 * Очищает форму консультации
 */
function clearConsultationForm() {
    document.getElementById('consultation-subject').value = '';
    document.getElementById('consultation-teacher').value = '';
    document.getElementById('consultation-date').value = '';
    document.getElementById('consultation-time').value = '';
    document.getElementById('consultation-room').value = '';
    document.getElementById('consultation-groups').value = '';
    document.getElementById('consultation-comment').value = '';
}

/**
 * Заполняет форму экзамена
 */
function fillExamForm(exam) {
    document.getElementById('exam-subject').value = exam.subject || '';
    document.getElementById('exam-teacher').value = exam.teacher || '';
    document.getElementById('exam-date').value = exam.date ? exam.date.split('T')[0] : '';
    document.getElementById('exam-time').value = exam.time || '';
    document.getElementById('exam-room').value = exam.room || '';
    document.getElementById('exam-groups').value = exam.groups || '';
    document.getElementById('exam-status').value = exam.status || 'Запланирован';
}

/**
 * Очищает форму экзамена
 */
function clearExamForm() {
    document.getElementById('exam-subject').value = '';
    document.getElementById('exam-teacher').value = '';
    document.getElementById('exam-date').value = '';
    document.getElementById('exam-time').value = '';
    document.getElementById('exam-room').value = '';
    document.getElementById('exam-groups').value = '';
    document.getElementById('exam-status').value = 'Запланирован';
}

/**
 * Сохраняет занятие из модального окна
 */
function saveLessonFromModal() {
    const lessonData = {
        subject: document.getElementById('lesson-subject').value.trim(),
        type: document.getElementById('lesson-type').value,
        teacher: document.getElementById('lesson-teacher').value.trim(),
        room: document.getElementById('lesson-room').value.trim(),
        day: parseInt(document.getElementById('lesson-day').value),
        time: document.getElementById('lesson-time').value,
        groups: document.getElementById('lesson-groups').value.split(',').map(g => g.trim()).filter(g => g)
    };
    
    // Валидация
    if (!lessonData.subject || !lessonData.teacher || !lessonData.room) {
        showToast('Заполните все обязательные поля', 'error');
        return;
    }
    
    if (currentEditingLesson) {
        // Редактирование
        updateLesson(currentEditingLesson.id, lessonData);
        showToast('Занятие успешно обновлено', 'success');
    } else {
        // Добавление
        addLesson(lessonData);
        showToast('Занятие успешно добавлено', 'success');
    }
    
    hideLessonModal();
    updateScheduleUI();
}

/**
 * Сохраняет консультацию из модального окна
 */
function saveConsultationFromModal() {
    const consultationData = {
        subject: document.getElementById('consultation-subject').value.trim(),
        teacher: document.getElementById('consultation-teacher').value.trim(),
        date: new Date(document.getElementById('consultation-date').value).toISOString(),
        time: document.getElementById('consultation-time').value,
        room: document.getElementById('consultation-room').value.trim(),
        groups: document.getElementById('consultation-groups').value.trim(),
        comment: document.getElementById('consultation-comment').value.trim()
    };
    
    // Валидация
    if (!consultationData.subject || !consultationData.teacher || !consultationData.date || !consultationData.time || !consultationData.room) {
        showToast('Заполните все обязательные поля', 'error');
        return;
    }
    
    if (currentEditingConsultation) {
        // Редактирование
        updateConsultation(currentEditingConsultation.id, consultationData);
        showToast('Консультация успешно обновлена', 'success');
    } else {
        // Добавление
        addConsultation(consultationData);
        showToast('Консультация успешно добавлена', 'success');
    }
    
    hideConsultationModal();
    updateConsultationsUI();
}

/**
 * Сохраняет экзамен из модального окна
 */
function saveExamFromModal() {
    const examData = {
        subject: document.getElementById('exam-subject').value.trim(),
        teacher: document.getElementById('exam-teacher').value.trim(),
        date: new Date(document.getElementById('exam-date').value).toISOString(),
        time: document.getElementById('exam-time').value,
        room: document.getElementById('exam-room').value.trim(),
        groups: document.getElementById('exam-groups').value.trim(),
        status: document.getElementById('exam-status').value
    };
    
    // Валидация
    if (!examData.subject || !examData.teacher || !examData.date || !examData.time || !examData.room) {
        showToast('Заполните все обязательные поля', 'error');
        return;
    }
    
    if (currentEditingExam) {
        // Редактирование
        updateExam(currentEditingExam.id, examData);
        showToast('Экзамен успешно обновлен', 'success');
    } else {
        // Добавление
        addExam(examData);
        showToast('Экзамен успешно добавлен', 'success');
    }
    
    hideExamModal();
    updateExamsUI();
}

/**
 * Обрабатывает вход
 */
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const result = login(email, password);
        if (result && result.user) {
            showToast(`Добро пожаловать, ${result.user.name}!`, 'success');
            showApp();
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

/**
 * Обрабатывает регистрацию
 */
function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
    };
    
    try {
        const result = register(userData);
        if (result && result.user) {
            showToast(`Регистрация успешна! Добро пожаловать, ${result.user.name}!`, 'success');
            showApp();
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

/**
 * Обрабатывает сброс пароля
 */
function handleResetPassword(e) {
    if (e) e.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    
    try {
        const result = resetPassword(email);
        if (result.success) {
            showToast(result.message, 'success');
            hideResetModal();
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

/**
 * Обрабатывает выход
 */
function handleLogout(e) {
    e.preventDefault();
    logout();
    showToast('Вы вышли из системы', 'info');
    showLoginPage();
}

/**
 * Показывает страницу входа
 */
function showLoginPage() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('app').classList.add('hidden');
    
    // Очищаем форму
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.reset();
    }
}

/**
 * Показывает страницу регистрации
 */
function showRegisterPage() {
    document.getElementById('register-page').classList.remove('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app').classList.add('hidden');
    
    // Очищаем форму
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.reset();
    }
}

/**
 * Показывает модальное окно сброса пароля
 */
function showResetModal() {
    document.getElementById('reset-modal').classList.remove('hidden');
    
    // Очищаем форму
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.reset();
    }
}

/**
 * Скрывает модальное окно сброса пароля
 */
function hideResetModal() {
    document.getElementById('reset-modal').classList.add('hidden');
}

/**
 * Показывает основное приложение
 */
function showApp() {
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    
    // Инициализируем UI
    initializeUI();
    
    // Устанавливаем активную вкладку
    setActiveTab('schedule');
}

/**
 * Переключает меню пользователя
 */
function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.classList.toggle('hidden');
    }
}

// Глобальные функции для кнопок
window.editLesson = function(id) {
    const lesson = getLessonById(id);
    if (lesson) {
        showLessonModal(lesson);
    }
};

window.deleteLesson = function(id) {
    if (confirm('Вы уверены, что хотите удалить это занятие?')) {
        removeLesson(id);
        updateScheduleUI();
        showToast('Занятие удалено', 'success');
    }
};

window.editConsultation = function(id) {
    const consultation = getConsultationById(id);
    if (consultation) {
        showConsultationModal(consultation);
    }
};

window.deleteConsultation = function(id) {
    if (confirm('Вы уверены, что хотите удалить эту консультацию?')) {
        removeConsultation(id);
        updateConsultationsUI();
        showToast('Консультация удалена', 'success');
    }
};

window.editExam = function(id) {
    const exam = getExamById(id);
    if (exam) {
        showExamModal(exam);
    }
};

window.deleteExam = function(id) {
    if (confirm('Вы уверены, что хотите удалить этот экзамен?')) {
        removeExam(id);
        updateExamsUI();
        showToast('Экзамен удален', 'success');
    }
};

window.editUser = function(id) {
    showToast('Функция редактирования пользователя в разработке', 'info');
};

window.deleteUser = function(id) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        removeUser(id);
        updateAdminUI();
        showToast('Пользователь удален', 'success');
    }
};

window.toggleUserStatus = function(id) {
    toggleUserActiveStatus(id);
    updateAdminUI();
    showToast('Статус пользователя изменен', 'success');
}
