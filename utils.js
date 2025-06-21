/**
 * Утилиты с улучшенным функционалом
 */

/**
 * Генерирует уникальный ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Сохраняет данные в localStorage с обработкой ошибок
 */
function setStorageItem(key, value) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        return true;
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
        
        // Проверяем, не переполнено ли хранилище
        if (error.name === 'QuotaExceededError') {
            showToast('Недостаточно места в хранилище браузера', 'error');
        }
        
        return false;
    }
}

/**
 * Получает данные из localStorage с обработкой ошибок
 */
function getStorageItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error('Ошибка чтения из localStorage:', error);
        return defaultValue;
    }
}

/**
 * Удаляет данные из localStorage
 */
function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Ошибка удаления из localStorage:', error);
        return false;
    }
}

/**
 * Форматирует дату с поддержкой локализации
 */
function formatDate(date, format = 'full') {
    if (!date) return '';
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return '';
    }
    
    const options = {
        full: {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },
        short: {
            day: 'numeric',
            month: 'short'
        },
        time: {
            hour: '2-digit',
            minute: '2-digit'
        },
        datetime: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    };
    
    return d.toLocaleDateString('ru-RU', options[format] || options.full);
}

/**
 * Форматирует время
 */
function formatTime(date) {
    if (!date) return '';
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return '';
    }
    
    return d.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Показывает toast уведомление с улучшенным дизайном
 */
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast p-4 rounded-xl shadow-2xl mb-3 transform transition-all duration-300 translate-x-full max-w-sm`;
    
    // Определяем цвет и иконку
    let bgColor = 'bg-gradient-to-r from-blue-500 to-blue-600';
    let icon = 'fas fa-info-circle';
    
    switch (type) {
        case 'success':
            bgColor = 'bg-gradient-to-r from-green-500 to-green-600';
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            bgColor = 'bg-gradient-to-r from-red-500 to-red-600';
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            bgColor = 'bg-gradient-to-r from-yellow-500 to-orange-500';
            icon = 'fas fa-exclamation-triangle';
            break;
    }
    
    toast.className += ` ${bgColor} text-white`;
    
    toast.innerHTML = `
        <div class="flex items-start">
            <i class="${icon} mr-3 mt-0.5 flex-shrink-0"></i>
            <div class="flex-1">
                <p class="text-sm font-medium leading-relaxed">${message}</p>
            </div>
            <button class="ml-3 text-white hover:text-gray-200 flex-shrink-0 p-1 rounded hover:bg-black hover:bg-opacity-20 transition-colors" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times text-sm"></i>
            </button>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Анимация появления
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Автоматическое удаление
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }
    }, duration);
}

/**
 * Проверяет валидность email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Проверяет валидность телефона
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Дебаунс функция
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Троттлинг функция
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Проверяет, является ли устройство мобильным
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Проверяет, является ли устройство планшетом
 */
function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Проверяет, является ли устройство десктопом
 */
function isDesktop() {
    return window.innerWidth > 1024;
}

/**
 * Получает размер экрана
 */
function getScreenSize() {
    if (isMobile()) return 'mobile';
    if (isTablet()) return 'tablet';
    return 'desktop';
}

/**
 * Копирует текст в буфер обмена
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const result = document.execCommand('copy');
            textArea.remove();
            return result;
        }
    } catch (error) {
        console.error('Ошибка копирования в буфер обмена:', error);
        return false;
    }
}

/**
 * Форматирует размер файла
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Генерирует случайный цвет
 */
function getRandomColor() {
    const colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
        '#ec4899', '#6366f1', '#14b8a6', '#eab308'
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Проверяет поддержку функции браузером
 */
function checkBrowserSupport() {
    const features = {
        localStorage: typeof Storage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        geolocation: 'geolocation' in navigator,
        notifications: 'Notification' in window,
        serviceWorker: 'serviceWorker' in navigator,
        webGL: !!window.WebGLRenderingContext,
        webRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };
    
    return features;
}

/**
 * Получает информацию о браузере
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    if (ua.indexOf('Chrome') > -1) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Safari') > -1) {
        browser = 'Safari';
        version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Edge') > -1) {
        browser = 'Edge';
        version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }
    
    return { browser, version };
}

/**
 * Логирует ошибки
 */
function logError(error, context = '') {
    const errorInfo = {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    console.error('Application Error:', errorInfo);
    
    // В продакшене здесь можно отправлять ошибки на сервер
    return errorInfo;
}

/**
 * Безопасное выполнение функции с обработкой ошибок
 */
function safeExecute(func, fallback = null, context = '') {
    try {
        return func();
    } catch (error) {
        logError(error, context);
        return fallback;
    }
}

// Глобальный обработчик ошибок
window.addEventListener('error', (event) => {
    logError(event.error, 'Global Error Handler');
});

// Обработчик необработанных промисов
window.addEventListener('unhandledrejection', (event) => {
    logError(new Error(event.reason), 'Unhandled Promise Rejection');
});