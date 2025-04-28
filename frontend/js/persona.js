/**
 * 喵搭 - 智能穿搭助手角色系统
 * 用于管理用户选择的角色信息和相关操作
 */

// 角色数据
const personas = [
    {
        id: 1,
        name: "小艾",
        age: 22,
        occupation: "大学生",
        style: "学院风",
        tags: ["可爱", "活泼", "年轻"],
        description: "喜欢清新学院风格，平时的穿搭简单大方，偏爱裙装和外套的搭配。",
        imageUrl: "assets/images/persona1.jpg"
    },
    {
        id: 2,
        name: "馨妮",
        age: 28,
        occupation: "广告创意总监",
        style: "都市通勤",
        tags: ["职场", "优雅", "时尚"],
        description: "喜欢简约大气的职场风格，注重细节和配饰，偏爱高级感的中性色系。",
        imageUrl: "assets/images/persona2.jpg"
    },
    {
        id: 3,
        name: "杰克",
        age: 25,
        occupation: "程序员",
        style: "街头潮流",
        tags: ["休闲", "潮流", "舒适"],
        description: "热爱街头文化和潮流单品，喜欢宽松的版型，追求舒适与个性的平衡。",
        imageUrl: "assets/images/persona3.jpg"
    },
    {
        id: 4,
        name: "梦琪",
        age: 32,
        occupation: "自由摄影师",
        style: "波西米亚",
        tags: ["自由", "艺术", "层次感"],
        description: "喜欢不拘一格的穿搭风格，热爱民族元素和色彩斑斓的单品，注重层次感。",
        imageUrl: "assets/images/persona4.jpg"
    },
    {
        id: 5,
        name: "雨轩",
        age: 35,
        occupation: "建筑设计师",
        style: "极简主义",
        tags: ["高级", "简约", "品质"],
        description: "追求简约不简单的穿搭哲学，喜欢高品质的面料和剪裁，偏爱极简色系。",
        imageUrl: "assets/images/persona5.jpg"
    },
    {
        id: 6,
        name: "小新",
        age: 16,
        occupation: "高中生",
        style: "青春活力",
        tags: ["运动", "活力", "青春"],
        description: "热爱运动和户外活动，喜欢运动休闲风格，追求舒适与活力的穿搭。",
        imageUrl: "assets/images/persona6.jpg"
    }
];

// 本地存储的键名
const PERSONA_STORAGE_KEY = 'selected_persona';

/**
 * 选择角色并保存到本地存储
 * @param {Number} personaId 角色ID
 */
function selectPersona(personaId) {
    // 找到对应的角色数据
    const selectedPersona = personas.find(p => p.id === personaId);
    
    if (selectedPersona) {
        // 保存到本地存储
        localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(selectedPersona));
        console.log(`已选择角色: ${selectedPersona.name}`);
        
        // 跳转到上传页面或衣橱页面
        window.location.href = 'upload.html';
    } else {
        console.error('未找到对应角色');
    }
}

/**
 * 获取当前选择的角色
 * @returns {Object|null} 角色数据或null
 */
function getCurrentPersona() {
    const storedPersona = localStorage.getItem(PERSONA_STORAGE_KEY);
    return storedPersona ? JSON.parse(storedPersona) : null;
}

/**
 * 清除选择的角色
 */
function clearPersona() {
    localStorage.removeItem(PERSONA_STORAGE_KEY);
}

/**
 * 检查是否已选择角色
 * @returns {Boolean} 是否已选择角色
 */
function hasSelectedPersona() {
    return !!getCurrentPersona();
}

/**
 * 更新导航栏角色信息
 */
function updatePersonaInfo() {
    const currentPersona = getCurrentPersona();
    const personaInfoElement = document.getElementById('persona-info');
    
    if (personaInfoElement && currentPersona) {
        personaInfoElement.innerHTML = `
            <span class="d-none d-md-inline">当前角色:</span> 
            <span class="fw-bold">${currentPersona.name}</span>
            <small class="ms-2 text-muted d-none d-md-inline">${currentPersona.style}</small>
        `;
        personaInfoElement.classList.remove('d-none');
    } else if (personaInfoElement) {
        personaInfoElement.classList.add('d-none');
    }
}

// 在页面加载时添加角色信息到导航栏
document.addEventListener('DOMContentLoaded', function() {
    updatePersonaInfo();
    
    // 如果在首页，初始化角色卡片的点击事件
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        const personaCards = document.querySelectorAll('.persona-card');
        personaCards.forEach(card => {
            card.addEventListener('click', function() {
                const personaId = parseInt(this.getAttribute('data-persona-id'), 10);
                selectPersona(personaId);
            });
        });
    }
    
    // 如果有角色选择模态框，初始化模态框的选择功能
    const personaSelectModal = document.getElementById('personaSelectModal');
    if (personaSelectModal) {
        const modalPersonaCards = personaSelectModal.querySelectorAll('.persona-select-item');
        modalPersonaCards.forEach(card => {
            card.addEventListener('click', function() {
                const personaId = parseInt(this.getAttribute('data-persona-id'), 10);
                selectPersona(personaId);
                
                // 关闭模态框
                const modal = bootstrap.Modal.getInstance(personaSelectModal);
                if (modal) {
                    modal.hide();
                }
            });
        });
    }
}); 