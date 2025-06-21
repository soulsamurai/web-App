/**
 * Модуль аутентификации с улучшенной безопасностью
 */

// Ключи для хранения данных
const AUTH_TOKEN_KEY = 'tgasu_auth_token';
const CURRENT_USER_KEY = 'tgasu_current_user';
const USERS_KEY = 'tgasu_users';

// Начальные пользователи
const initialUsers = [
    {
        id: 'ST001',
        name: 'Иван',
        surname: 'Иванов',
        email: 'student@tgasu.ru',
        password: 'student123',
        role: 'student',
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'TE001',
        name: 'Петр',
        surname: 'Петров',
        email: 'teacher@tgasu.ru',
        password: 'teacher123',
        role: 'teacher',
        active: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'AD001',
        name: 'Сергей',
        surname: 'Сергеев',
        email: 'admin@tgasu.ru',
        password: 'admin123',
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString()
    }
];

/**
 * Инициализирует пользователей
 */
function initializeUsers() {
    if (!getStorageItem(USERS_KEY)) {
        setStorageItem(USERS_KEY, initialUsers);
    }
}

/**
 * Получает всех пользователей
 */
function getUsers() {
    return getStorageItem(USERS_KEY, []);
}

/**
 * Получает пользователя по email
 */
function getUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Аутентификация пользователя
 */
function login(email, password) {
    if (!email || !password) {
        throw new Error('Email и пароль обязательны для заполнения');
    }
    
    const user = getUserByEmail(email);
    
    if (!user) {
        throw new Error('Пользователь с таким email не найден');
    }
    
    if (user.password !== password) {
        throw new Error('Неверный пароль');
    }
    
    if (!user.active) {
        throw new Error('Учетная запись заблокирована');
    }
    
    // Генерируем токен
    const token = generateToken(user);
    
    // Сохраняем токен и данные пользователя
    setStorageItem(AUTH_TOKEN_KEY, token);
    
    const { password: _, ...userWithoutPassword } = user;
    setStorageItem(CURRENT_USER_KEY, userWithoutPassword);
    
    return {
        token,
        user: userWithoutPassword
    };
}

/**
 * Регистрация нового пользователя
 */
function register(userData) {
    const users = getUsers();
    
    // Валидация
    if (!userData.name || !userData.surname || !userData.email || !userData.password) {
        throw new Error('Все поля обязательны для заполнения');
    }
    
    if (userData.name.length < 2) {
        throw new Error('Имя должно содержать минимум 2 символа');
    }
    
    if (userData.surname.length < 2) {
        throw new Error('Фамилия должна содержать минимум 2 символа');
    }
    
    if (!isValidEmail(userData.email)) {
        throw new Error('Неверный формат email');
    }
    
    if (userData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
    }
    
    // Проверяем, существует ли пользователь
    if (getUserByEmail(userData.email)) {
        throw new Error('Пользователь с таким email уже существует');
    }
    
    // Генерируем ID
    let id;
    const existingIds = users.map(u => u.id);
    let counter = 1;
    
    const prefix = userData.role === 'student' ? 'ST' : userData.role === 'teacher' ? 'TE' : 'AD';
    
    do {
        id = `${prefix}${String(counter).padStart(3, '0')}`;
        counter++;
    } while (existingIds.includes(id));
    
    // Создаем нового пользователя
    const newUser = {
        id,
        name: userData.name.trim(),
        surname: userData.surname.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        role: userData.role || 'student',
        active: true,
        createdAt: new Date().toISOString()
    };
    
    // Добавляем пользователя
    users.push(newUser);
    setStorageItem(USERS_KEY, users);
    
    // Выполняем вход
    return login(userData.email, userData.password);
}

/**
 * Выход из системы
 */
function logout() {
    removeStorageItem(AUTH_TOKEN_KEY);
    removeStorageItem(CURRENT_USER_KEY);
}

/**
 * Проверяет, аутентифицирован ли пользователь
 */
function isAuthenticated() {
    const token = getStorageItem(AUTH_TOKEN_KEY);
    if (!token) {
        return false;
    }
    
    try {
        const tokenData = JSON.parse(atob(token));
        const isValid = tokenData.exp > Date.now();
        
        if (!isValid) {
            logout();
            return false;
        }
        
        return true;
    } catch (error) {
        logout();
        return false;
    }
}

/**
 * Получает текущего пользователя
 */
function getCurrentUser() {
    if (!isAuthenticated()) {
        return null;
    }
    
    return getStorageItem(CURRENT_USER_KEY);
}

/**
 * Генерирует токен
 */
function generateToken(user) {
    const tokenData = {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 часа
    };
    
    return btoa(JSON.stringify(tokenData));
}

/**
 * Сброс пароля
 */
function resetPassword(email) {
    if (!email) {
        throw new Error('Email обязателен для заполнения');
    }
    
    if (!isValidEmail(email)) {
        throw new Error('Неверный формат email');
    }
    
    const user = getUserByEmail(email);
    if (!user) {
        throw new Error('Пользователь с таким email не найден');
    }
    
    // В реальном приложении здесь была бы отправка email
    return {
        success: true,
        message: 'Ссылка для сброса пароля отправлена на ваш email'
    };
}

/**
 * Проверяет валидность email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Обновляет профиль пользователя
 */
function updateUserProfile(userData) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('Пользователь не аутентифицирован');
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
        throw new Error('Пользователь не найден');
    }
    
    // Валидация
    if (userData.name && userData.name.length < 2) {
        throw new Error('Имя должно содержать минимум 2 символа');
    }
    
    if (userData.surname && userData.surname.length < 2) {
        throw new Error('Фамилия должна содержать минимум 2 символа');
    }
    
    if (userData.email && !isValidEmail(userData.email)) {
        throw new Error('Неверный формат email');
    }
    
    // Проверяем уникальность email
    if (userData.email && userData.email !== currentUser.email) {
        const existingUser = getUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }
    }
    
    // Обновляем данные
    const updatedUser = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    setStorageItem(USERS_KEY, users);
    
    // Обновляем текущего пользователя
    const { password: _, ...userWithoutPassword } = updatedUser;
    setStorageItem(CURRENT_USER_KEY, userWithoutPassword);
    
    return userWithoutPassword;
}

/**
 * Изменяет пароль пользователя
 */
function changePassword(currentPassword, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('Пользователь не аутентифицирован');
    }
    
    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user) {
        throw new Error('Пользователь не найден');
    }
    
    if (user.password !== currentPassword) {
        throw new Error('Неверный текущий пароль');
    }
    
    if (newPassword.length < 6) {
        throw new Error('Новый пароль должен содержать минимум 6 символов');
    }
    
    if (currentPassword === newPassword) {
        throw new Error('Новый пароль должен отличаться от текущего');
    }
    
    // Обновляем пароль
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();
    
    setStorageItem(USERS_KEY, users);
    
    return {
        success: true,
        message: 'Пароль успешно изменен'
    };
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers();
});