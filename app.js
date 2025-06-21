/**
 * Главный модуль приложения с полным функционалом
 */

let currentWeekOffset = 0;
let currentEditingLesson = null;

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
    const logoutBtn = document.getElementById('logout-btn');
    
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', toggleUserMenu);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Навигация по неделям
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const currentWeekBtn = document.getElementById('current-week-btn');
    
    if (prevWeekBtn) {
        prevWeekBtn.addEventListener('click', () => {
            currentWeekOffset--;
            updateScheduleUI();
            updateWeekDisplay();
        });
    }
    
    if (nextWeekBtn) {
        nextWeekBtn.addEventListener('click', () => {
            currentWeekOffset++;
            updateScheduleUI();
            updateWeekDisplay();
        });
    }
    
    if (currentWeekBtn) {
        currentWeekBtn.addEventListener('click', () => {
            currentWeekOffset = 0;
            updateScheduleUI();
            updateWeekDisplay();
        });
    }
    
    // Кнопки добавления
    const addLessonBtn = document.getElementById('add-lesson-btn');
    const addConsultationBtn = document.getElementById('add-consultation-btn');
    const addExamBtn = document.getElementById('add-exam-btn');
    
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', () => showLessonModal());
    }
    
    if (addConsultationBtn) {
        addConsultationBtn.addEventListener('click', () => showToast('Функция добавления консультации в разработке', 'info'));
    }
    
    if (addExamBtn) {
        addExamBtn.addEventListener('click', () => showToast('Функция добавления экзамена в разработке', 'info'));
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
 * Переключает мобильное меню
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
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
