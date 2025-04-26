/**
 * 用户认证模块
 * 处理登录、注册、会话管理等功能
 */

const AUTH_API_URL = 'http://127.0.0.1:8000/api/v1/auth';
const TOKEN_KEY = 'token';
const USER_DATA_KEY = 'user_data';

/**
 * 登录处理
 * @param {String} username - 用户名
 * @param {String} password - 密码
 * @returns {Promise} - 登录结果
 */
async function login(username, password) {
    try {
        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '登录失败');
        }

        const data = await response.json();
        
        // 保存令牌和会话状态
        localStorage.setItem(TOKEN_KEY, data.access_token);
        
        // 返回登录结果
        return data;
    } catch (error) {
        console.error('登录错误:', error);
        throw error;
    }
}

/**
 * 注册处理
 * @param {Object} userData - 用户注册数据
 * @returns {Promise} - 注册结果
 */
async function register(userData) {
    try {
        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '注册失败');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('注册错误:', error);
        throw error;
    }
}

/**
 * 检查是否已登录
 * @returns {Boolean} - 是否已登录
 */
function isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * 获取当前令牌
 * @returns {String|null} - JWT令牌
 */
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * 退出登录
 */
function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
}

/**
 * 获取当前用户信息
 * @returns {Promise} - 用户信息
 */
async function getCurrentUser() {
    // 检查是否已有缓存的用户数据
    const cachedUserData = localStorage.getItem(USER_DATA_KEY);
    if (cachedUserData) {
        return JSON.parse(cachedUserData);
    }
    
    // 如果没有缓存，从服务器获取
    try {
        const token = getToken();
        if (!token) {
            throw new Error('未登录');
        }
        
        const response = await fetch('http://127.0.0.1:8000/api/v1/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '获取用户信息失败');
        }
        
        const userData = await response.json();
        
        // 缓存用户数据
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        
        return userData;
    } catch (error) {
        console.error('获取用户信息错误:', error);
        throw error;
    }
}

// 导出API
window.Auth = {
    login,
    register,
    isLoggedIn,
    getToken,
    logout,
    getCurrentUser
}; 