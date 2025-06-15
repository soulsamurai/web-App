/**
 * Утилиты для работы с приложением
 */

/**
 * Генерирует уникальный ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Сохраняет данные в localStorage
 */
function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
    }
}

/**
 * Получает данные из localStorage
 */
function getStorageItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
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
    } catch (error) {
        console.error('Ошибка удаления из localStorage:', error);
    }
}

/**
 * Форматирует дату
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
 * Валидирует форму
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    // Очищаем предыдущие ошибки
    form.querySelectorAll('.text-red-500').forEach(error => {
        error.classList.add('hidden');
    });
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = document.getElementById(`${input.id}-error`);
        
        // Проверка на пустоту
        if (!value) {
            showFieldError(input, errorElement, 'Это поле обязательно');
            isValid = false;
            return;
        }
        
        // Специфичные валидации
        if (input.type === 'email') {
            if (!isValidEmail(value)) {
                showFieldError(input, errorElement, 'Неверный формат email');
                isValid = false;
                return;
            }
        }
        
        if (input.type === 'password') {
            if (value.length < 6) {
                showFieldError(input, errorElement, 'Пароль должен содержать минимум 6 символов');
                isValid = false;
                return;
            }
        }
        
        // Проверка подтверждения пароля
        if (input.id === 'register-confirm') {
            const passwordInput = document.getElementById('register-password');
            if (value !== passwordInput.value) {
                showFieldError(input, errorElement, 'Пароли не совпадают');
                isValid = false;
                return;
            }
        }
        
        // Проверка согласия с условиями
        if (input.type === 'checkbox' && input.id === 'terms') {
            if (!input.checked) {
                const termsError = document.getElementById('terms-error');
                if (termsError) {
                    termsError.textContent = 'Необходимо согласиться с условиями';
                    termsError.classList.remove('hidden');
                }
                isValid = false;
                return;
            }
        }
        
        // Очищаем ошибку если поле валидно
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-300');
    });
    
    return isValid;
}

/**
 * Показывает ошибку поля
 */
function showFieldError(input, errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
    
    input.classList.add('border-red-500');
    input.classList.remove('border-gray-300');
}

/**
 * Проверяет валидность email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Показывает toast уведомление
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast-notification p-4 rounded-lg shadow-lg mb-2 transform transition-all duration-300 translate-x-full`;
    
    // Определяем цвет в зависимости от типа
    let bgColor = 'bg-blue-500';
    let icon = 'fas fa-info-circle';
    
    switch (type) {
        case 'success':
            bgColor = 'bg-green-500';
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            bgColor = 'bg-yellow-500';
            icon = 'fas fa-exclamation-triangle';
            break;
    }
    
    toast.className += ` ${bgColor} text-white`;
    
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-2"></i>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
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
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

/**
 * Показывает модальное окно
 */
function showModal(title, content, onConfirm = null, onCancel = null, options = {}) {
    const overlay = document.getElementById('modal-overlay');
    const titleElement = document.getElementById('modal-title');
    const contentElement = document.getElementById('modal-content');
    const confirmButton = document.getElementById('modal-confirm');
    const cancelButton = document.getElementById('modal-cancel');
    
    // Устанавливаем заголовок
    titleElement.textContent = title;
    
    // Устанавливаем содержимое
    if (typeof content === 'string') {
        contentElement.innerHTML = content;
    } else {
        contentElement.innerHTML = '';
        contentElement.appendChild(content);
    }
    
    // Настраиваем кнопки
    confirmButton.textContent = options.confirmText || 'Подтвердить';
    cancelButton.textContent = options.cancelText || 'Отмена';
    
    if (options.confirmClass) {
        confirmButton.className = options.confirmClass;
    } else {
        confirmButton.className = 'px-4 py-2 bg-blue-500 text-white rounded-md';
    }
    
    // Обработчики событий
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        overlay.classList.add('hidden');
        cleanup();
    };
    
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        overlay.classList.add('hidden');
        cleanup();
    };
    
    const cleanup = () => {
        confirmButton.removeEventListener('click', handleConfirm);
        cancelButton.removeEventListener('click', handleCancel);
    };
    
    confirmButton.addEventListener('click', handleConfirm);
    cancelButton.addEventListener('click', handleCancel);
    
    // Закрытие по клику на overlay
    if (options.closeOnOverlayClick !== false) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                handleCancel();
            }
        });
    }
    
    // Показываем модальное окно
    overlay.classList.remove('hidden');
}

/**
 * Скрывает модальное окно
 */
function hideModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
}

/**
 * Дебаунс функции
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
 * Троттлинг функции
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
 * Копирует текст в буфер обмена
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Скопировано в буфер обмена', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

/**
 * Резервный способ копирования в буфер обмена
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Скопировано в буфер обмена', 'success');
    } catch (err) {
        showToast('Не удалось скопировать', 'error');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Экспортирует данные в CSV
 */
function exportToCSV(data, filename) {
    if (!data || !data.length) {
        showToast('Нет данных для экспорта', 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Файл экспортирован', 'success');
    } else {
        showToast('Экспорт не поддерживается в этом браузере', 'error');
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
 * Проверяет, является ли устройство мобильным
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Получает параметры URL
 */
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params) {
        result[key] = value;
    }
    
    return result;
}

/**
 * Устанавливает параметр URL
 */
function setUrlParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
}

/**
 * Удаляет параметр URL
 */
function removeUrlParam(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.pushState({}, '', url);
}

/**
 * Анимирует число
 */
function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * Создает элемент с классами и атрибутами
 */
function createElement(tag, classes = [], attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    if (classes.length) {
        element.className = classes.join(' ');
    }
    
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });
    
    if (content) {
        element.innerHTML = content;
    }
    
    return element;
}

/**
 * Плавная прокрутка к элементу
 */
function scrollToElement(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

/**
 * Проверяет видимость элемента
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Загружает изображение асинхронно
 */
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Генерирует случайный цвет
 */
function getRandomColor() {
    const colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Форматирует номер телефона
 */
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    
    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    
    return phone;
}

/**
 * Проверяет поддержку localStorage
 */
function isLocalStorageSupported() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}