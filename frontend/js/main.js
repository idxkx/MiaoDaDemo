/**
 * 智能穿搭助手 - 主JavaScript文件
 */

// API基础URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// 获取当前用户令牌
function getToken() {
    return localStorage.getItem('accessToken');
}

// 检查用户是否已登录
function isLoggedIn() {
    return !!getToken();
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // 根据当前页面执行相应的初始化
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            // 主页初始化
            break;
        case 'closet.html':
            if (!isLoggedIn()) {
                redirectToLogin();
            } else {
                initClosetPage();
            }
            break;
        case 'recommend.html':
            if (!isLoggedIn()) {
                redirectToLogin();
            } else {
                initRecommendPage();
            }
            break;
        case 'upload.html':
            if (!isLoggedIn()) {
                redirectToLogin();
            } else {
                initUploadPage();
            }
            break;
    }
});

// 更新导航栏显示
function updateNavigation() {
    const loginLink = document.querySelector('.nav-link[href="login.html"]');
    
    if (isLoggedIn() && loginLink) {
        loginLink.textContent = "退出";
        loginLink.href = "#";
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// 登出
function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

// 重定向到登录页
function redirectToLogin() {
    window.location.href = 'login.html';
}

// API请求基础函数
async function fetchAPI(endpoint, options = {}) {
    const token = getToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    };
    
    const fetchOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `请求失败: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

// 初始化衣橱页面
function initClosetPage() {
    // 这里应该加载用户衣橱数据
    console.log('初始化衣橱页面');
    
    // 模拟数据加载
    setTimeout(() => {
        const closetContainer = document.getElementById('closet-items');
        if (closetContainer) {
            // 在实际应用中，这里应该调用API获取数据
            console.log('加载衣橱数据...');
        }
    }, 500);
}

// 初始化穿搭推荐页面
function initRecommendPage() {
    console.log('初始化穿搭推荐页面');
    
    // 模拟数据加载
    const recommendForm = document.getElementById('recommend-form');
    if (recommendForm) {
        recommendForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('提交穿搭推荐请求');
            // 在实际应用中，这里应该调用API获取推荐
        });
    }
}

// 初始化上传页面
function initUploadPage() {
    console.log('初始化上传页面');
    
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file-input');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                console.log('选择文件:', file.name);
                
                // 显示预览
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('image-preview');
                    if (preview) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
                
                // 在实际应用中，这里应该准备上传文件
            }
        });
    }
} 