/**
 * 用户认证模块
 * 处理登录、注册、会话管理等功能
 */

const AUTH_API_URL = 'http://127.0.0.1:8000/api/v1/auth';
const TOKEN_KEY = 'token';
const USER_DATA_KEY = 'user_data';

// 调试模式
const DEBUG = true;

// 调试日志
function debug(message, data = null) {
    if (DEBUG) {
        console.log(`[AUTH-DEBUG] ${message}`, data || '');
    }
}

// 初始化时检查
debug('Auth模块初始化');
debug(`令牌状态: ${localStorage.getItem(TOKEN_KEY) ? '存在' : '不存在'}`);

/**
 * 登录处理
 * @param {String} username - 用户名
 * @param {String} password - 密码
 * @returns {Promise} - 登录结果
 */
async function login(username, password) {
    debug(`尝试登录: ${username}`);
    try {
        debug('发送登录请求');
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

        debug(`登录响应状态: ${response.status}`);
        if (!response.ok) {
            const errorData = await response.json();
            debug('登录失败:', errorData);
            throw new Error(errorData.detail || '登录失败');
        }

        const data = await response.json();
        debug('登录成功，获取到令牌:', data);
        
        if (!data.access_token) {
            debug('错误: 响应中没有access_token字段');
            throw new Error('服务器返回的数据中没有令牌');
        }
        
        // 保存令牌和会话状态
        localStorage.setItem(TOKEN_KEY, data.access_token);
        debug(`令牌已保存，当前令牌: ${data.access_token.substring(0, 15)}...`);
        
        // 打印所有localStorage中的键值对用于调试
        debug('所有localStorage内容:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            debug(`${key}: ${localStorage.getItem(key).substring(0, 20)}...`);
        }
        
        // 返回登录结果
        return data;
    } catch (error) {
        debug('登录过程发生错误:', error.message);
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
    debug('尝试注册新用户:', userData.username);
    try {
        debug('发送注册请求');
        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        debug(`注册响应状态: ${response.status}`);
        if (!response.ok) {
            const errorData = await response.json();
            debug('注册失败:', errorData);
            throw new Error(errorData.detail || '注册失败');
        }

        const data = await response.json();
        debug('注册成功:', data);
        return data;
    } catch (error) {
        debug('注册过程发生错误:', error.message);
        console.error('注册错误:', error);
        throw error;
    }
}

/**
 * 检查是否已登录
 * @returns {Boolean} - 是否已登录
 */
function isLoggedIn() {
    const hasToken = !!localStorage.getItem(TOKEN_KEY);
    debug(`检查登录状态: ${hasToken ? '已登录' : '未登录'}`);
    return hasToken;
}

/**
 * 获取当前令牌
 * @returns {String|null} - JWT令牌
 */
function getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    debug(`获取令牌: ${token ? '存在' : '不存在'}`);
    return token;
}

/**
 * 退出登录
 */
function logout() {
    debug('执行退出登录');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    debug('已清除令牌和用户数据');
}

/**
 * 获取当前用户信息
 * @returns {Promise} - 用户信息
 */
async function getCurrentUser() {
    debug('获取当前用户信息');
    
    // 检查是否已有缓存的用户数据
    const cachedUserData = localStorage.getItem(USER_DATA_KEY);
    if (cachedUserData) {
        debug('使用缓存的用户数据');
        return JSON.parse(cachedUserData);
    }
    
    debug('无缓存数据，从服务器获取');
    // 如果没有缓存，从服务器获取
    try {
        const token = getToken();
        if (!token) {
            debug('未检测到登录令牌');
            throw new Error('未登录');
        }
        
        debug('发送获取用户信息请求');
        const response = await fetch('http://127.0.0.1:8000/api/v1/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        debug(`用户信息响应状态: ${response.status}`);
        if (!response.ok) {
            const errorData = await response.json();
            debug('获取用户信息失败:', errorData);
            throw new Error(errorData.detail || '获取用户信息失败');
        }
        
        const userData = await response.json();
        debug('获取用户信息成功');
        
        // 缓存用户数据
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        debug('用户数据已缓存');
        
        return userData;
    } catch (error) {
        debug('获取用户信息过程发生错误:', error.message);
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