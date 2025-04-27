/**
 * 智能穿搭助手 - 主JavaScript文件
 * 简化版 - 解决页面跳转问题
 */

// API基础URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
const TOKEN_KEY = 'token'; // 与auth.js保持一致

// 简单日志函数
function log(message) {
    console.log(`[Main] ${message}`);
}

// 需要登录的页面
const PROTECTED_PAGES = ['closet.html', 'recommend.html', 'upload.html'];

// 页面加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面名称
    const path = window.location.pathname;
    const currentPage = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    
    log(`当前页面: ${currentPage}`);
    
    // 更新导航栏
    updateNavigation();
    
    // 处理登录页面
    if (currentPage === 'login.html') {
        // 已登录用户访问登录页，重定向到首页
        if (isUserLoggedIn()) {
            log('已登录用户访问登录页，重定向到首页');
            window.location.href = 'index.html';
        }
        return; // 登录页面不需要继续处理
    }
    
    // 处理受保护页面
    if (PROTECTED_PAGES.includes(currentPage)) {
        log(`${currentPage} 是受保护页面，检查登录状态`);
        
        if (!isUserLoggedIn()) {
            log('用户未登录，保存当前URL并重定向到登录页');
            // 保存当前URL用于登录后返回
            localStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            return; // 中止后续操作
        }
        
        log('用户已登录，继续加载页面');
    }
    
    // 根据页面类型初始化
    initializePage(currentPage);
});

// 判断用户是否已登录
function isUserLoggedIn() {
    const hasToken = !!localStorage.getItem(TOKEN_KEY);
    log(`用户登录状态: ${hasToken ? '已登录' : '未登录'}`);
    return hasToken;
}

// 更新导航栏
function updateNavigation() {
    log('更新导航栏');
    const loginLink = document.querySelector('.nav-link[href="login.html"]');
    
    if (loginLink) {
        if (isUserLoggedIn()) {
            log('修改导航栏显示"退出"');
            loginLink.textContent = "退出";
            loginLink.href = "#";
            
            // 清除之前可能的事件监听器
            const newLoginLink = loginLink.cloneNode(true);
            loginLink.parentNode.replaceChild(newLoginLink, loginLink);
            
            // 添加新的事件监听器
            newLoginLink.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        } else {
            log('保持导航栏显示"登录/注册"');
        }
    }
}

// 登出函数
function logout() {
    log('执行登出');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user_data');
    window.location.href = 'index.html';
}

// 根据页面类型初始化
function initializePage(page) {
    log(`初始化页面: ${page}`);
    
    switch(page) {
        case 'closet.html':
            initClosetPage();
            break;
        case 'recommend.html':
            initRecommendPage();
            break;
        case 'upload.html':
            initUploadPage();
            break;
        case 'index.html':
        case '':
            // 首页不需要特殊初始化
            break;
        default:
            log(`未知页面类型: ${page}`);
    }
}

// API请求基础函数
async function fetchAPI(endpoint, options = {}) {
    log(`API请求: ${endpoint}`);
    const token = localStorage.getItem(TOKEN_KEY);
    
    // 检查令牌状态并记录日志
    if (token) {
        log(`使用认证令牌: ${token.substring(0, 10)}...`);
    } else {
        log('警告: 未找到认证令牌');
    }
    
    // 确保endpoint格式正确（一些API需要末尾有斜杠）
    if (endpoint.indexOf('?') > 0 && !endpoint.includes('/?')) {
        const parts = endpoint.split('?');
        if (!parts[0].endsWith('/')) {
            endpoint = `${parts[0]}/?${parts[1]}`;
            log(`修正API路径: ${endpoint}`);
        }
    } else if (!endpoint.includes('?') && !endpoint.endsWith('/')) {
        endpoint = `${endpoint}/`;
        log(`修正API路径: ${endpoint}`);
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // 确保令牌被正确添加到请求头
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const fetchOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };
    
    // 记录完整请求信息用于调试
    log(`完整请求URL: ${API_BASE_URL}${endpoint}`);
    log(`请求方法: ${fetchOptions.method || 'GET'}`);
    log(`请求头: ${JSON.stringify(fetchOptions.headers)}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
        
        log(`响应状态: ${response.status}`);
        
        if (response.status === 401) {
            log('认证失败 (401): 可能是令牌无效或过期');
            // 清除无效令牌并重定向到登录页
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('user_data');
            localStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = 'login.html';
            throw new Error('认证失败，请重新登录');
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            log(`API错误: ${JSON.stringify(errorData)}`);
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
    log('初始化衣橱页面');
    
    // 加载用户衣橱数据
    loadClosetItems();
    
    // 设置筛选器事件监听
    setupClosetFilters();
    
    // 设置分页事件监听
    setupPagination();
}

// 从API加载衣橱数据
async function loadClosetItems(page = 1, filters = {}) {
    try {
        // 显示加载中提示
        const closetContainer = document.getElementById('closet-items');
        if (!closetContainer) return;
        
        closetContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border" role="status"><span class="visually-hidden">加载中...</span></div></div>';
        
        // 构建查询参数
        let queryParams = `?page=${page}`;
        
        // 添加筛选条件
        if (filters.category) queryParams += `&category=${filters.category}`;
        if (filters.color) queryParams += `&color=${filters.color}`;
        if (filters.season) queryParams += `&season=${filters.season}`;
        if (filters.search) queryParams += `&search=${encodeURIComponent(filters.search)}`;
        
        // 调用API获取数据
        const response = await fetchAPI(`/clothes${queryParams}`);
        
        if (response && response.items) {
            renderClosetItems(response.items);
            updatePagination(page, response.total_pages);
        } else {
            closetContainer.innerHTML = '<div class="col-12 text-center"><p>暂无数据</p></div>';
        }
    } catch (error) {
        console.error('加载衣橱数据失败:', error);
        const closetContainer = document.getElementById('closet-items');
        if (closetContainer) {
            closetContainer.innerHTML = '<div class="col-12 text-center"><p class="text-danger">加载失败，请重试</p></div>';
        }
    }
}

// 渲染衣橱项目
function renderClosetItems(items) {
    const closetContainer = document.getElementById('closet-items');
    if (!closetContainer) return;
    
    if (items.length === 0) {
        closetContainer.innerHTML = '<div class="col-12 text-center"><p>暂无衣物数据</p></div>';
        return;
    }
    
    let html = '';
    
    items.forEach(item => {
        const imageSrc = item.image_url || 'assets/images/placeholder-clothes.jpg';
        
        // 构建标签HTML
        let tagsHtml = '';
        if (item.category) tagsHtml += `<span class="badge-tag">${translateCategory(item.category)}</span>`;
        if (item.color) tagsHtml += `<span class="badge-tag">${translateColor(item.color)}</span>`;
        if (item.season) tagsHtml += `<span class="badge-tag">${translateSeason(item.season)}</span>`;
        
        html += `
            <div class="col-md-4 col-sm-6" data-id="${item.id}">
                <div class="card h-100 closet-item">
                    <img src="${imageSrc}" alt="${item.name}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${item.name || '未命名服装'}</h5>
                        <div class="mb-2">
                            ${tagsHtml}
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-sm btn-light me-2 edit-item" data-id="${item.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-item" data-id="${item.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    closetContainer.innerHTML = html;
    
    // 添加编辑和删除事件监听
    setupItemEvents();
}

// 设置衣物项目的事件监听
function setupItemEvents() {
    // 编辑按钮点击事件
    document.querySelectorAll('.edit-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            window.location.href = `upload.html?edit=${itemId}`;
        });
    });
    
    // 删除按钮点击事件
    document.querySelectorAll('.delete-item').forEach(btn => {
        btn.addEventListener('click', async function() {
            const itemId = this.getAttribute('data-id');
            if (confirm('确定要删除这件衣物吗？')) {
                try {
                    await fetchAPI(`/clothes/${itemId}`, { method: 'DELETE' });
                    // 重新加载数据
                    const currentFilters = getCurrentFilters();
                    loadClosetItems(1, currentFilters);
                } catch (error) {
                    alert('删除失败，请重试');
                }
            }
        });
    });
}

// 设置筛选器事件监听
function setupClosetFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const colorFilter = document.getElementById('color-filter');
    const seasonFilter = document.getElementById('season-filter');
    const searchInput = document.getElementById('search-input');
    
    // 添加change事件监听
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (colorFilter) {
        colorFilter.addEventListener('change', applyFilters);
    }
    
    if (seasonFilter) {
        seasonFilter.addEventListener('change', applyFilters);
    }
    
    // 添加搜索输入框防抖
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFilters, 500);
        });
    }
}

// 应用筛选器并重新加载数据
function applyFilters() {
    const filters = getCurrentFilters();
    loadClosetItems(1, filters);
}

// 获取当前筛选条件
function getCurrentFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const colorFilter = document.getElementById('color-filter');
    const seasonFilter = document.getElementById('season-filter');
    const searchInput = document.getElementById('search-input');
    
    return {
        category: categoryFilter ? categoryFilter.value : '',
        color: colorFilter ? colorFilter.value : '',
        season: seasonFilter ? seasonFilter.value : '',
        search: searchInput ? searchInput.value : ''
    };
}

// 设置分页事件监听
function setupPagination() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('page-link')) {
            e.preventDefault();
            
            const pageItem = e.target.closest('.page-item');
            if (pageItem && !pageItem.classList.contains('disabled') && !pageItem.classList.contains('active')) {
                let page;
                
                if (e.target.textContent === '上一页') {
                    const activePage = document.querySelector('.page-item.active');
                    if (activePage) {
                        page = parseInt(activePage.querySelector('.page-link').textContent) - 1;
                    }
                } else if (e.target.textContent === '下一页') {
                    const activePage = document.querySelector('.page-item.active');
                    if (activePage) {
                        page = parseInt(activePage.querySelector('.page-link').textContent) + 1;
                    }
                } else {
                    page = parseInt(e.target.textContent);
                }
                
                if (page && !isNaN(page)) {
                    const filters = getCurrentFilters();
                    loadClosetItems(page, filters);
                }
            }
        }
    });
}

// 更新分页导航
function updatePagination(currentPage, totalPages) {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    let html = '';
    
    // 上一页按钮
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" tabindex="-1">上一页</a>
        </li>
    `;
    
    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `;
    }
    
    // 下一页按钮
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#">下一页</a>
        </li>
    `;
    
    pagination.innerHTML = html;
}

// 翻译分类
function translateCategory(category) {
    const categories = {
        'tops': '上衣',
        'bottoms': '裤子',
        'dresses': '连衣裙',
        'outerwear': '外套',
        'shoes': '鞋子',
        'accessories': '配饰'
    };
    
    return categories[category] || category;
}

// 翻译颜色
function translateColor(color) {
    const colors = {
        'black': '黑色',
        'white': '白色',
        'red': '红色',
        'blue': '蓝色',
        'green': '绿色',
        'yellow': '黄色'
    };
    
    return colors[color] || color;
}

// 翻译季节
function translateSeason(season) {
    const seasons = {
        'spring': '春季',
        'summer': '夏季',
        'autumn': '秋季',
        'winter': '冬季',
        'all': '四季'
    };
    
    return seasons[season] || season;
}

// 初始化穿搭推荐页面
function initRecommendPage() {
    console.log('初始化穿搭推荐页面');
    
    // 获取推荐页面元素
    const recommendForm = document.getElementById('recommend-form');
    const loadingSection = document.getElementById('recommendation-loading');
    const emptySection = document.getElementById('recommendation-empty');
    const resultsSection = document.getElementById('recommendation-results');
    const errorSection = document.getElementById('recommendation-error');
    const errorMessage = document.getElementById('error-message');
    const outfitDescription = document.getElementById('outfit-description');
    const outfitItems = document.getElementById('outfit-items');
    const stylingTips = document.getElementById('styling-tips');
    
    if (recommendForm) {
        recommendForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 显示加载中状态
            if (emptySection) emptySection.classList.add('d-none');
            if (resultsSection) resultsSection.classList.add('d-none');
            if (errorSection) errorSection.classList.add('d-none');
            if (loadingSection) loadingSection.classList.remove('d-none');
            
            try {
                // 收集表单数据
                const formData = {
                    occasion: document.getElementById('occasion').value,
                    season: document.getElementById('season').value,
                    style: document.getElementById('style').value,
                    consider_weather: document.getElementById('weather-check').checked
                };
                
                // 调用API获取推荐
                const response = await fetchAPI('/recommendation', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                
                // 处理响应
                if (response && response.outfit) {
                    renderRecommendation(response);
                    if (loadingSection) loadingSection.classList.add('d-none');
                    if (resultsSection) resultsSection.classList.remove('d-none');
                } else {
                    throw new Error('无法获取穿搭推荐');
                }
            } catch (error) {
                console.error('推荐获取失败:', error);
                if (loadingSection) loadingSection.classList.add('d-none');
                if (errorSection) errorSection.classList.remove('d-none');
                if (errorMessage) errorMessage.textContent = error.message || '请确保您的衣橱中有足够的衣物，并重试。';
            }
        });
    }
}

// 渲染推荐结果
function renderRecommendation(data) {
    const outfitDescription = document.getElementById('outfit-description');
    const outfitItems = document.getElementById('outfit-items');
    const stylingTips = document.getElementById('styling-tips');
    
    if (!outfitDescription || !outfitItems || !stylingTips) return;
    
    // 渲染穿搭描述
    outfitDescription.textContent = data.outfit.description || '根据您的选择，我们为您推荐以下穿搭:';
    
    // 渲染穿搭物品
    let itemsHtml = '';
    
    if (data.outfit.items && data.outfit.items.length > 0) {
        data.outfit.items.forEach(item => {
            // 获取图片URL，如果没有则使用占位图
            const imageSrc = item.image_url || 'assets/images/placeholder-clothes.jpg';
            
            itemsHtml += `
                <div class="col-md-6 col-sm-12 mb-3">
                    <div class="card h-100">
                        <img src="${imageSrc}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h6 class="card-title">${item.name}</h6>
                            <div class="mb-2">
                                ${item.category ? `<span class="badge-tag">${translateCategory(item.category)}</span>` : ''}
                                ${item.color ? `<span class="badge-tag">${translateColor(item.color)}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        itemsHtml = '<div class="col-12"><p class="text-center text-muted">未找到匹配的穿搭物品</p></div>';
    }
    
    outfitItems.innerHTML = itemsHtml;
    
    // 渲染穿搭建议
    let tipsHtml = '<ul class="list-group list-group-flush">';
    
    if (data.styling_tips && data.styling_tips.length > 0) {
        data.styling_tips.forEach(tip => {
            tipsHtml += `<li class="list-group-item">${tip}</li>`;
        });
    } else {
        tipsHtml += '<li class="list-group-item">暂无相关穿搭建议</li>';
    }
    
    tipsHtml += '</ul>';
    stylingTips.innerHTML = tipsHtml;
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