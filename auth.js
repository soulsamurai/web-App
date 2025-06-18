/**
 * Модуль аутентификации
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
        faculty: 'fcs',
        group: 'ПГС-101',
        createdAt: new Date().toISOString()
    },
    {
        id: 'TE045',
        name: 'Петр',
        surname: 'Петров',
        email: 'teacher@tgasu.ru',
        password: 'teacher123',
        role: 'teacher',
        active: true,
        subjects: ['Строительная механика', 'Железобетонные конструкции'],
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
 * Инициализирует хранилище пользователей
 */
function initializeUsers() {
    if (!getStorageItem(USERS_KEY)) {
        setStorageItem(USERS_KEY, initialUsers);
    }
}

/**
 * Получает список всех пользователей
 */
function getUsers() {
    return getStorageItem(USERS_KEY, []);
}

/**
 * Получает пользователя по ID
 */
function getUserById(id) {
    const users = getUsers();
    return users.find(user => user.id === id) || null;
}

/**
 * Получает пользователя по email
 */
function getUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email) || null;
}

/**
 * Добавляет нового пользователя
 */
function addUser(userData) {
    const users = getUsers();
    
    // Проверяем, существует ли пользователь с таким email
    if (getUserByEmail(userData.email)) {
        throw new Error('Пользователь с таким email уже существует');
    }
    
    // Валидация данных
    if (!userData.name || !userData.surname || !userData.email || !userData.password) {
        throw new Error('Все поля обязательны для заполнения');
    }
    
    if (!isValidEmail(userData.email)) {
        throw new Error('Неверный формат email');
    }
    
    if (userData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
    }
    
    // Генерируем ID в зависимости от роли
    let id;
    const existingIds = users.map(u => u.id);
    let counter = 1;
    
    switch (userData.role) {
        case 'student':
            do {
                id = `ST${String(counter).padStart(3, '0')}`;
                counter++;
            } while (existingIds.includes(id));
            break;
        case 'teacher':
            do {
                id = `TE${String(counter).padStart(3, '0')}`;
                counter++;
            } while (existingIds.includes(id));
            break;
        case 'admin':
            do {
                id = `AD${String(counter).padStart(3, '0')}`;
                counter++;
            } while (existingIds.includes(id));
            break;
        default:
            do {
                id = `US${String(counter).padStart(3, '0')}`;
                counter++;
            } while (existingIds.includes(id));
    }
    
    // Создаем нового пользователя
    const newUser = {
        id,
        name: userData.name.trim(),
        surname: userData.surname.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        role: userData.role || 'student',
        active: userData.active !== undefined ? userData.active : true,
        createdAt: new Date().toISOString()
    };
    
    // Добавляем дополнительные поля в зависимости от роли
    if (userData.role === 'student') {
        newUser.faculty = userData.faculty || '';
        newUser.group = userData.group || '';
    } else if (userData.role === 'teacher') {
        newUser.subjects = userData.subjects || [];
    }
    
    // Добавляем пользователя в список
    users.push(newUser);
    setStorageItem(USERS_KEY, users);
    
    // Возвращаем пользователя без пароля
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

/**
 * Обновляет данные пользователя
 */
function updateUser(id, userData) {
    const users = getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
        throw new Error('Пользователь не найден');
    }
    
    // Проверяем, не занят ли email другим пользователем
    if (userData.email) {
        const existingUser = getUserByEmail(userData.email);
        if (existingUser && existingUser.id !== id) {
            throw new Error('Пользователь с таким email уже существует');
        }
        
        if (!isValidEmail(userData.email)) {
            throw new Error('Неверный формат email');
        }
    }
    
    // Валидация пароля
    if (userData.password && userData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
    }
    
    // Обновляем данные пользователя
    const updatedData = { ...userData };
    if (updatedData.email) {
        updatedData.email = updatedData.email.toLowerCase().trim();
    }
    if (updatedData.name) {
        updatedData.name = updatedData.name.trim();
    }
    if (updatedData.surname) {
        updatedData.surname = updatedData.surname.trim();
    }
    
    users[index] = {
        ...users[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
    };
    
    setStorageItem(USERS_KEY, users);
    
    // Возвращаем пользователя без пароля
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
}

/**
 * Удаляет пользователя
 */
function deleteUser(id) {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
        return false;
    }
    
    setStorageItem(USERS_KEY, filteredUsers);
    return true;
}

/**
 * Аутентифицирует пользователя
 */
function login(email, password) {
    // Валидация входных данных
    if (!email || !password) {
        throw new Error('Email и пароль обязательны');
    }
    
    if (!isValidEmail(email)) {
        throw new Error('Неверный формат email');
    }
    
    const user = getUserByEmail(email.toLowerCase().trim());
    
    if (!user || user.password !== password) {
        throw new Error('Неверный email или пароль');
    }
    
    if (!user.active) {
        throw new Error('Учетная запись заблокирована. Обратитесь к администратору');
    }
    
    // Генерируем токен
    const token = generateToken(user);
    
    // Сохраняем токен и данные пользователя
    setStorageItem(AUTH_TOKEN_KEY, token);
    
    // Сохраняем данные пользователя без пароля
    const { password: _, ...userWithoutPassword } = user;
    setStorageItem(CURRENT_USER_KEY, userWithoutPassword);
    
    // Обновляем время последнего входа
    updateUser(user.id, { lastLoginAt: new Date().toISOString() });
    
    return {
        token,
        user: userWithoutPassword
    };
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
        return tokenData.exp > Date.now();
    } catch (error) {
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
 * Генерирует токен для пользователя
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
 * Регистрирует нового пользователя
 */
function register(userData) {
    // Валидация данных
    if (!userData.name || !userData.surname || !userData.email || !userData.password) {
        throw new Error('Все поля обязательны для заполнения');
    }
    
    if (!isValidEmail(userData.email)) {
        throw new Error('Неверный формат email');
    }
    
    if (userData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
    }
    
    // Добавляем пользователя
    const newUser = addUser(userData);
    
    // Выполняем вход
    return login(userData.email, userData.password);
}

/**
 * Проверяет валидность email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Проверяет права доступа пользователя
 */
function hasPermission(requiredRole) {
    const user = getCurrentUser();
    if (!user) {
        return false;
    }
    
    const roleHierarchy = {
        'student': 1,
        'teacher': 2,
        'admin': 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

/**
 * Сброс пароля (имитация)
 */
function resetPassword(email) {
    const user = getUserByEmail(email);
    if (!user) {
        throw new Error('Пользователь с таким email не найден');
    }
    
    // В реальном приложении здесь была бы отправка email
    console.log(`Ссылка для сброса пароля отправлена на ${email}`);
    
    return {
        success: true,
        message: 'Ссылка для сброса пароля отправлена на ваш email'
    };
}

/**
 * Изменение пароля
 */
function changePassword(currentPassword, newPassword) {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('Пользователь не авторизован');
    }
    
    const fullUser = getUserById(user.id);
    if (!fullUser || fullUser.password !== currentPassword) {
        throw new Error('Неверный текущий пароль');
    }
    
    if (newPassword.length < 6) {
        throw new Error('Новый пароль должен содержать минимум 6 символов');
    }
    
    updateUser(user.id, { password: newPassword });
    
    return {
        success: true,
        message: 'Пароль успешно изменен'
    };
}

/**
 * Получает статистику пользователей
 */
function getUsersStats() {
    const users = getUsers();
    
    return {
        total: users.length,
        active: users.filter(u => u.active).length,
        inactive: users.filter(u => !u.active).length,
        students: users.filter(u => u.role === 'student').length,
        teachers: users.filter(u => u.role === 'teacher').length,
        admins: users.filter(u => u.role === 'admin').length,
        recentRegistrations: users.filter(u => {
            const createdAt = new Date(u.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdAt > weekAgo;
        }).length
    };
}

// Инициализация при загрузке
initializeUsers();