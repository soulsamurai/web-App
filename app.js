/**
 * Главный модуль приложения
 */

// Глобальные переменные
let currentWeekOffset = 0;

/**
 * Инициализация приложения
 */
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем поддержку localStorage
    if (!isLocalStorageSupported()) {
        showToast('Ваш браузер не поддерживает localStorage. Некоторые функции могут работать некорректно.', 'warning', 5000);
    }
    
    // Инициализируем данные
    initializeData();
    
    // Проверяем аутентификацию
    if (isAuthenticated()) {
        showApp();
        initializeUI();
    } else {
        showLoginPage();
    }
    
    // Инициализируем обработчики событий
    initializeEventListeners();
    
    // Запускаем периодическое обновление уведомлений
    startNotificationUpdates();
});

/**
 * Инициализирует обработчики событий
 */
function initializeEventListeners() {
    // Обработчик изменения размера окна
    window.addEventListener('resize', debounce(() => {
        updateResponsiveLayout();
    }, 250));
    
    // Обработчик клавиатурных сокращений
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Обработчик видимости страницы
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Обработчик ошибок
    window.addEventListener('error', handleGlobalError);
    
    // Обработчик unhandled promise rejections
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
}

/**
 * Обрабатывает клавиатурные сокращения
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K - поиск
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // Фокус на поиск (если есть)
    }
    
    // Escape - закрыть модальные окна
    if (event.key === 'Escape') {
        const modal = document.getElementById('modal-overlay');
        if (!modal.classList.contains('hidden')) {
            hideModal();
        }
        
        const userMenu = document.getElementById('user-menu');
        if (!userMenu.classList.contains('hidden')) {
            userMenu.classList.add('hidden');
        }
        
        const notificationsMenu = document.getElementById('notifications-menu');
        if (!notificationsMenu.classList.contains('hidden')) {
            notificationsMenu.classList.add('hidden');
        }
    }
}

/**
 * Обрабатывает изменение видимости страницы
 */
function handleVisibilityChange() {
    if (!document.hidden && isAuthenticated()) {
        // Обновляем уведомления при возвращении на страницу
        updateNotificationsUI();
    }
}

/**
 * Обрабатывает глобальные ошибки
 */
function handleGlobalError(event) {
    console.error('Глобальная ошибка:', event.error);
    
    // Показываем пользователю уведомление только для критических ошибок
    if (event.error && event.error.message && !event.error.message.includes('Script error')) {
        showToast('Произошла ошибка. Попробуйте обновить страницу.', 'error');
    }
}

/**
 * Обрабатывает необработанные отклонения промисов
 */
function handleUnhandledRejection(event) {
    console.error('Необработанное отклонение промиса:', event.reason);
    
    // Предотвращаем вывод ошибки в консоль браузера
    event.preventDefault();
    
    // Показываем пользователю уведомление
    showToast('Произошла ошибка при выполнении операции.', 'error');
}

/**
 * Обновляет адаптивную верстку
 */
function updateResponsiveLayout() {
    const isMobileView = isMobile();
    
    // Закрываем мобильное меню при переходе на десктоп
    if (!isMobileView) {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
    }
    
    // Обновляем таблицы для мобильных устройств
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const wrapper = table.closest('.overflow-x-auto');
        if (wrapper) {
            if (isMobileView) {
                wrapper.style.overflowX = 'auto';
            } else {
                wrapper.style.overflowX = 'visible';
            }
        }
    });
}

/**
 * Запускает периодическое обновление уведомлений
 */
function startNotificationUpdates() {
    // Обновляем уведомления каждые 30 секунд
    setInterval(() => {
        if (isAuthenticated()) {
            updateNotificationsUI();
        }
    }, 30000);
}

/**
 * Обрабатывает ошибки API
 */
function handleApiError(error) {
    console.error('Ошибка API:', error);
    
    if (error.message) {
        showToast(error.message, 'error');
    } else {
        showToast('Произошла ошибка при обращении к серверу', 'error');
    }
}

/**
 * Проверяет подключение к интернету
 */
function checkInternetConnection() {
    return navigator.onLine;
}

/**
 * Обрабатывает изменение статуса подключения
 */
function handleConnectionChange() {
    if (navigator.onLine) {
        showToast('Подключение к интернету восстановлено', 'success');
        // Синхронизируем данные
        syncOfflineData();
    } else {
        showToast('Отсутствует подключение к интернету', 'warning');
    }
}

/**
 * Синхронизирует офлайн данные
 */
function syncOfflineData() {
    // Здесь была бы логика синхронизации офлайн данных
    console.log('Синхронизация офлайн данных...');
}

/**
 * Инициализирует Service Worker (для будущего использования)
 */
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker зарегистрирован:', registration);
            })
            .catch(error => {
                console.log('Ошибка регистрации Service Worker:', error);
            });
    }
}

/**
 * Получает информацию о производительности
 */
function getPerformanceInfo() {
    if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
            loadTime: navigation.loadEventEnd - navigation.loadEventStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            totalTime: navigation.loadEventEnd - navigation.fetchStart
        };
    }
    return null;
}

/**
 * Логирует производительность
 */
function logPerformance() {
    const perfInfo = getPerformanceInfo();
    if (perfInfo) {
        console.log('Производительность:', perfInfo);
    }
}

/**
 * Инициализирует аналитику (заглушка)
 */
function initializeAnalytics() {
    // Здесь была бы инициализация Google Analytics или другой системы аналитики
    console.log('Аналитика инициализирована');
}

/**
 * Отправляет событие аналитики
 */
function trackEvent(category, action, label = null, value = null) {
    // Здесь была бы отправка события в систему аналитики
    console.log('Событие аналитики:', { category, action, label, value });
}

/**
 * Инициализирует уведомления браузера
 */
function initializeBrowserNotifications() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showToast('Уведомления браузера включены', 'success');
                }
            });
        }
    }
}

/**
 * Отправляет уведомление браузера
 */
function sendBrowserNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options
        });
        
        // Автоматически закрываем уведомление через 5 секунд
        setTimeout(() => {
            notification.close();
        }, 5000);
        
        return notification;
    }
    return null;
}

/**
 * Проверяет обновления приложения
 */
function checkForUpdates() {
    // Здесь была бы проверка обновлений
    console.log('Проверка обновлений...');
}

/**
 * Экспортирует данные пользователя
 */
function exportUserData() {
    const user = getCurrentUser();
    if (!user) {
        showToast('Пользователь не авторизован', 'error');
        return;
    }
    
    const userData = {
        profile: user,
        schedule: getStorageItem(SCHEDULE_KEY),
        consultations: getStorageItem(CONSULTATIONS_KEY),
        exams: getStorageItem(EXAMS_KEY),
        notifications: getStorageItem(NOTIFICATIONS_KEY)
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `tgasu_data_${user.id}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Данные экспортированы', 'success');
}

/**
 * Импортирует данные пользователя
 */
function importUserData(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const userData = JSON.parse(e.target.result);
            
            // Валидируем структуру данных
            if (!userData.profile || !userData.profile.id) {
                throw new Error('Неверный формат файла');
            }
            
            // Подтверждаем импорт
            showModal(
                'Импорт данных',
                'Вы уверены, что хотите импортировать данные? Текущие данные будут перезаписаны.',
                () => {
                    // Импортируем данные
                    if (userData.schedule) setStorageItem(SCHEDULE_KEY, userData.schedule);
                    if (userData.consultations) setStorageItem(CONSULTATIONS_KEY, userData.consultations);
                    if (userData.exams) setStorageItem(EXAMS_KEY, userData.exams);
                    if (userData.notifications) setStorageItem(NOTIFICATIONS_KEY, userData.notifications);
                    
                    showToast('Данные импортированы успешно', 'success');
                    
                    // Обновляем интерфейс
                    updateScheduleUI();
                    updateConsultationsUI();
                    updateExamsUI();
                    updateNotificationsUI();
                },
                null,
                {
                    confirmText: 'Импортировать',
                    confirmClass: 'px-4 py-2 bg-red-500 text-white rounded-md'
                }
            );
            
        } catch (error) {
            showToast('Ошибка при импорте данных: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

/**
 * Очищает кэш приложения
 */
function clearAppCache() {
    showModal(
        'Очистка кэша',
        'Вы уверены, что хотите очистить кэш приложения? Это может помочь решить проблемы с производительностью.',
        () => {
            // Очищаем localStorage (кроме пользовательских данных)
            const keysToKeep = [AUTH_TOKEN_KEY, CURRENT_USER_KEY, USERS_KEY];
            const allKeys = Object.keys(localStorage);
            
            allKeys.forEach(key => {
                if (!keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            });
            
            // Очищаем sessionStorage
            sessionStorage.clear();
            
            showToast('Кэш очищен', 'success');
            
            // Перезагружаем страницу
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
        null,
        {
            confirmText: 'Очистить',
            confirmClass: 'px-4 py-2 bg-red-500 text-white rounded-md'
        }
    );
}

/**
 * Получает информацию о системе
 */
function getSystemInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localStorage: isLocalStorageSupported(),
        sessionStorage: 'sessionStorage' in window,
        webWorkers: 'Worker' in window,
        serviceWorkers: 'serviceWorker' in navigator,
        notifications: 'Notification' in window
    };
}

/**
 * Показывает информацию о системе
 */
function showSystemInfo() {
    const info = getSystemInfo();
    const content = Object.entries(info)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('');
    
    showModal('Информация о системе', `<div class="space-y-2">${content}</div>`);
}

/**
 * Инициализирует горячие клавиши для разработки
 */
function initializeDeveloperShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Ctrl+Shift+D - показать информацию о системе
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            event.preventDefault();
            showSystemInfo();
        }
        
        // Ctrl+Shift+C - очистить кэш
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            clearAppCache();
        }
        
        // Ctrl+Shift+E - экспорт данных
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            event.preventDefault();
            exportUserData();
        }
        
        // Ctrl+Shift+P - показать производительность
        if (event.ctrlKey && event.shiftKey && event.key === 'P') {
            event.preventDefault();
            logPerformance();
        }
    });
}

// Инициализируем дополнительные функции
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем аналитику
    initializeAnalytics();
    
    // Инициализируем уведомления браузера
    initializeBrowserNotifications();
    
    // Инициализируем горячие клавиши для разработки
    initializeDeveloperShortcuts();
    
    // Обработчики изменения подключения
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    // Логируем производительность после загрузки
    window.addEventListener('load', () => {
        setTimeout(logPerformance, 1000);
    });
    
    // Проверяем обновления
    setTimeout(checkForUpdates, 5000);
});