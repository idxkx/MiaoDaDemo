/**
 * 智能穿搭助手 - 主JavaScript文件
 * 简化版 - 只需角色选择功能
 */

// API基础URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// 简单日志函数
function log(message) {
    console.log(`[Main] ${message}`);
}

// 添加全局角色管理功能
window.PersonaManager = {
    // 预设角色数据
    personas: [
        {
            id: 1,
            name: '小明',
            gender: 'male',
            age: 25,
            occupation: '程序员',
            height: 178,
            weight: 65,
            bodyType: 'slim',
            stylePreference: ['简约', '科技风', '深色系'],
            colorPreference: ['黑色', '深蓝', '灰色'],
            occasionPreference: ['办公室', '技术交流会'],
            seasonAdaptation: 'spring_autumn',
            avatar: 'assets/images/personas/male-1.png'
        },
        {
            id: 2,
            name: '大卫',
            gender: 'male',
            age: 32,
            occupation: '市场经理',
            height: 185,
            weight: 78,
            bodyType: 'athletic',
            stylePreference: ['商务休闲', '精致', '细节'],
            colorPreference: ['蓝色', '棕色', '白色'],
            occasionPreference: ['商务会议', '社交活动'],
            seasonAdaptation: 'all',
            avatar: 'assets/images/personas/male-2.png'
        },
        {
            id: 3,
            name: '老王',
            gender: 'male',
            age: 45,
            occupation: '教授',
            height: 175,
            weight: 80,
            bodyType: 'full',
            stylePreference: ['学院风', '经典', '保守'],
            colorPreference: ['棕色', '灰色', '深绿'],
            occasionPreference: ['学术会议', '课堂授课'],
            seasonAdaptation: 'autumn_winter',
            avatar: 'assets/images/personas/male-3.png'
        },
        {
            id: 4,
            name: '小红',
            gender: 'female',
            age: 22,
            occupation: '大学生',
            height: 163,
            weight: 48,
            bodyType: 'slim',
            stylePreference: ['青春活力', '流行', '可爱'],
            colorPreference: ['粉色', '蓝色', '鲜艳色系'],
            occasionPreference: ['校园', '休闲约会'],
            seasonAdaptation: 'spring_summer',
            avatar: 'assets/images/personas/female-1.png'
        },
        {
            id: 5,
            name: '丽丽',
            gender: 'female',
            age: 28,
            occupation: '设计师',
            height: 170,
            weight: 55,
            bodyType: 'model',
            stylePreference: ['艺术', '个性', '时尚'],
            colorPreference: ['黑色', '白色', '对比色'],
            occasionPreference: ['艺术展览', '创意工作室'],
            seasonAdaptation: 'all',
            avatar: 'assets/images/personas/female-2.png'
        },
        {
            id: 6,
            name: '张阿姨',
            gender: 'female',
            age: 50,
            occupation: '主妇',
            height: 160,
            weight: 62,
            bodyType: 'medium',
            stylePreference: ['优雅', '得体', '质感'],
            colorPreference: ['暖色系', '米色', '大地色'],
            occasionPreference: ['家庭聚会', '社区活动'],
            seasonAdaptation: 'autumn_winter',
            avatar: 'assets/images/personas/female-3.png'
        }
    ],
    
    // 获取当前选择的角色
    getCurrentPersona: function() {
        const personaId = localStorage.getItem('currentPersonaId');
        if (!personaId) return null;
        
        const id = parseInt(personaId);
        // 找到角色或返回null
        const persona = this.personas.find(p => p.id === id) || null;
        
        // 添加错误处理：如果角色有avatar但文件不存在，使用新的角色图片
        if (persona) {
            // 替换旧的图片路径为新的格式
            const oldPath = persona.avatar;
            if (oldPath && (oldPath.includes('/personas/male-') || oldPath.includes('/personas/female-'))) {
                const gender = oldPath.includes('male-') ? 'male' : 'female';
                const number = oldPath.substring(oldPath.lastIndexOf('-') + 1, oldPath.lastIndexOf('.'));
                
                // 根据性别和编号映射到新的角色图片
                if (gender === 'male') {
                    if (number === '1') persona.avatar = 'assets/images/personas/office-lady.jpg';
                    else if (number === '2') persona.avatar = 'assets/images/personas/college-girl.jpg';
                    else persona.avatar = 'assets/images/personas/fashion-blogger.jpg';
                } else {
                    if (number === '1') persona.avatar = 'assets/images/personas/outdoor-girl.jpg';
                    else if (number === '2') persona.avatar = 'assets/images/personas/minimal-style.jpg';
                    else persona.avatar = 'assets/images/personas/vintage-lover.jpg';
                }
            }
        }
        
        return persona;
    },
    
    // 设置当前选择的角色
    setCurrentPersona: function(id) {
        if (!id || isNaN(id)) {
            localStorage.removeItem('currentPersonaId');
            localStorage.removeItem('currentPersonaName');
            return;
        }
        
        const persona = this.personas.find(p => p.id === parseInt(id));
        if (persona) {
            localStorage.setItem('currentPersonaId', persona.id);
            localStorage.setItem('currentPersonaName', persona.name);
            return true;
        }
        return false;
    },
    
    // 渲染导航栏中的角色选择器
    renderPersonaSelector: function() {
        const navbarNav = document.querySelector('.navbar-nav.ms-auto');
        if (!navbarNav) return;
        
        // 检查是否已存在角色选择器
        if (document.querySelector('.persona-selector-nav')) return;
        
        const currentPersona = this.getCurrentPersona();
        
        // 创建角色选择器导航项
        const li = document.createElement('li');
        li.className = 'nav-item persona-selector-nav';
        
        const link = document.createElement('a');
        link.className = 'nav-link d-flex align-items-center gap-2';
        link.href = '#';
        link.setAttribute('data-bs-toggle', 'dropdown');
        
        if (currentPersona) {
            // 显示当前角色信息
            const avatar = document.createElement('img');
            avatar.className = 'persona-avatar';
            avatar.src = currentPersona.avatar;
            avatar.alt = currentPersona.name;
            avatar.onerror = function() {
                this.src = `https://via.placeholder.com/36?text=${currentPersona.name.charAt(0)}`;
            };
            
            const span = document.createElement('span');
            span.textContent = currentPersona.name;
            
            link.appendChild(avatar);
            link.appendChild(span);
        } else {
            // 未选择角色
            const icon = document.createElement('i');
            icon.className = 'bi bi-person-circle';
            
            const span = document.createElement('span');
            span.textContent = '选择角色';
            
            link.appendChild(icon);
            link.appendChild(span);
        }
        
        // 创建下拉菜单
        const dropdown = document.createElement('ul');
        dropdown.className = 'dropdown-menu dropdown-menu-end';
        
        // 添加所有角色到下拉菜单
        this.personas.forEach(persona => {
            const item = document.createElement('li');
            
            const itemLink = document.createElement('a');
            itemLink.className = 'dropdown-item d-flex align-items-center gap-2';
            itemLink.href = '#';
            
            const avatar = document.createElement('img');
            avatar.className = 'persona-avatar';
            avatar.style.width = '24px';
            avatar.style.height = '24px';
            avatar.src = persona.avatar;
            avatar.alt = persona.name;
            avatar.onerror = function() {
                this.src = `https://via.placeholder.com/24?text=${persona.name.charAt(0)}`;
            };
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = persona.name;
            
            // 如果是当前选中的角色，添加选中标记
            if (currentPersona && currentPersona.id === persona.id) {
                const check = document.createElement('i');
                check.className = 'bi bi-check-lg ms-auto';
                itemLink.appendChild(check);
                itemLink.classList.add('active');
            }
            
            itemLink.appendChild(avatar);
            itemLink.appendChild(nameSpan);
            
            // 添加点击事件
            itemLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.setCurrentPersona(persona.id);
                window.location.reload();
            });
            
            item.appendChild(itemLink);
            dropdown.appendChild(item);
        });
        
        // 添加分隔线和回到首页选项
        const divider = document.createElement('li');
        divider.innerHTML = '<hr class="dropdown-divider">';
        dropdown.appendChild(divider);
        
        const backToHome = document.createElement('li');
        const backLink = document.createElement('a');
        backLink.className = 'dropdown-item';
        backLink.href = 'index.html';
        backLink.innerHTML = '<i class="bi bi-house-door me-2"></i>返回角色选择';
        backToHome.appendChild(backLink);
        dropdown.appendChild(backToHome);
        
        li.appendChild(link);
        li.appendChild(dropdown);
        navbarNav.appendChild(li);
    }
};

// 添加全局图片错误处理函数
function setupImageErrorHandling() {
    // 处理所有图片加载失败
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            const altText = this.alt || '喵搭';
            const width = this.width || 300;
            const height = this.height || 180;
            
            // 检查图片路径
            const src = this.src || '';
            if (src.includes('placeholder-shirt.jpg')) {
                this.src = `https://dummyimage.com/300x300/4e54c8/ffffff&text=Shirt`;
            } else if (src.includes('placeholder-jeans.jpg')) {
                this.src = `https://dummyimage.com/300x300/3949ab/ffffff&text=Jeans`;
            } else if (src.includes('placeholder-jacket.jpg')) {
                this.src = `https://dummyimage.com/300x300/009688/ffffff&text=Jacket`;
            } else if (src.includes('personas/male-') || src.includes('personas/female-')) {
                // 将旧的角色图片重定向到新的角色图片
                const gender = src.includes('male-') ? 'male' : 'female';
                const number = src.substring(src.lastIndexOf('-') + 1, src.lastIndexOf('.'));
                
                if (gender === 'male') {
                    if (number === '1') this.src = 'assets/images/personas/office-lady.jpg';
                    else if (number === '2') this.src = 'assets/images/personas/college-girl.jpg';
                    else this.src = 'assets/images/personas/fashion-blogger.jpg';
                } else {
                    if (number === '1') this.src = 'assets/images/personas/outdoor-girl.jpg';
                    else if (number === '2') this.src = 'assets/images/personas/minimal-style.jpg';
                    else this.src = 'assets/images/personas/vintage-lover.jpg';
                }
            } else {
                // 通用占位图
                this.src = `https://dummyimage.com/${width}x${height}/4e54c8/ffffff&text=${encodeURIComponent(altText)}`;
            }
        };
    });
}

// 页面加载完成时执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面名称
    const path = window.location.pathname;
    const currentPage = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    
    log(`当前页面: ${currentPage}`);
    
    // 设置全局图片错误处理
    setupImageErrorHandling();
    
    // 在非首页页面添加角色选择器
    if (currentPage !== 'index.html') {
        window.PersonaManager.renderPersonaSelector();
        
        // 检查是否已选择角色
        const currentPersona = window.PersonaManager.getCurrentPersona();
        if (!currentPersona) {
            // 未选择角色时重定向到首页
            alert('请先选择一个角色');
            window.location.href = 'index.html';
        }
    }
    
    // 根据页面类型初始化
    initializePage(currentPage);
});

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
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
        
        log(`响应状态: ${response.status}`);
        
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
        
        // 获取当前角色ID
        const currentPersona = window.PersonaManager.getCurrentPersona();
        if (!currentPersona) {
            closetContainer.innerHTML = '<div class="col-12 text-center"><p>请先选择一个角色</p></div>';
            return;
        }
        
        // 构建查询参数
        let queryParams = `?page=${page}&persona_id=${currentPersona.id}`;
        
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
    
    // 获取当前角色
    const currentPersona = window.PersonaManager.getCurrentPersona();
    if (!currentPersona) {
        window.location.href = 'index.html';
        return;
    }
    
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
                    consider_weather: document.getElementById('weather-check').checked,
                    persona_id: currentPersona.id
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
    
    // 获取当前角色
    const currentPersona = window.PersonaManager.getCurrentPersona();
    if (!currentPersona) {
        window.location.href = 'index.html';
        return;
    }
    
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