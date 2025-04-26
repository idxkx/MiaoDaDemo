/**
 * 服装识别模块
 * 提供图片分析、标签生成和特征提取功能
 */

// 基础配置
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
const RECOGNITION_ENDPOINT = `${API_BASE_URL}/recognition`;

// 工具函数: 获取JWT令牌
function getAuthToken() {
    return localStorage.getItem('token');
}

/**
 * 分析图片，返回分类结果和特征
 * @param {File} imageFile - 图片文件对象
 * @returns {Promise} - 包含分析结果的Promise
 */
async function analyzeImage(imageFile) {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const response = await fetch(`${RECOGNITION_ENDPOINT}/analyze-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '图片分析失败');
        }
        
        return await response.json();
    } catch (error) {
        console.error('图片分析错误:', error);
        throw error;
    }
}

/**
 * 分析已存在于服务器上的图片
 * @param {String} imagePath - 服务器上的图片路径
 * @returns {Promise} - 包含分析结果的Promise
 */
async function analyzeExistingImage(imagePath) {
    try {
        const response = await fetch(`${RECOGNITION_ENDPOINT}/analyze-existing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ image_path: imagePath })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '图片分析失败');
        }
        
        return await response.json();
    } catch (error) {
        console.error('图片分析错误:', error);
        throw error;
    }
}

/**
 * 为图片生成标签
 * @param {File} imageFile - 图片文件对象
 * @returns {Promise} - 包含生成标签的Promise
 */
async function generateTags(imageFile) {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const response = await fetch(`${RECOGNITION_ENDPOINT}/generate-tags`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '标签生成失败');
        }
        
        const result = await response.json();
        return result.tags;
    } catch (error) {
        console.error('标签生成错误:', error);
        throw error;
    }
}

/**
 * 获取模型信息
 * @returns {Promise} - 包含模型信息的Promise
 */
async function getModelInfo() {
    try {
        const response = await fetch(`${RECOGNITION_ENDPOINT}/model-info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '获取模型信息失败');
        }
        
        return await response.json();
    } catch (error) {
        console.error('获取模型信息错误:', error);
        throw error;
    }
}

/**
 * 使用模型分析初始化上传表单
 * @param {String} fileInputId - 文件输入元素ID
 * @param {String} previewId - 预览图片元素ID
 * @param {String} analyzeButtonId - 分析按钮元素ID
 * @param {String} resultContainerId - 结果容器元素ID
 */
function initRecognitionForm(fileInputId, previewId, analyzeButtonId, resultContainerId) {
    const fileInput = document.getElementById(fileInputId);
    const previewElement = document.getElementById(previewId);
    const analyzeButton = document.getElementById(analyzeButtonId);
    const resultContainer = document.getElementById(resultContainerId);
    
    let selectedFile = null;
    
    // 监听文件选择
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // 验证文件类型
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            alert('只支持JPG和PNG格式图片');
            fileInput.value = '';
            return;
        }
        
        // 创建预览
        selectedFile = file;
        
        // 显示预览图
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
        
        // 启用分析按钮
        analyzeButton.disabled = false;
    });
    
    // 监听分析按钮点击
    analyzeButton.addEventListener('click', async () => {
        if (!selectedFile) {
            alert('请先选择图片');
            return;
        }
        
        // 更新按钮状态
        analyzeButton.disabled = true;
        analyzeButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 分析中...';
        
        try {
            // 调用分析API
            const result = await analyzeImage(selectedFile);
            
            // 显示分析结果
            displayAnalysisResult(result, resultContainer);
        } catch (error) {
            alert(`分析失败: ${error.message}`);
            console.error('分析错误:', error);
        } finally {
            // 恢复按钮状态
            analyzeButton.disabled = false;
            analyzeButton.textContent = '分析图片';
        }
    });
}

/**
 * 显示分析结果
 * @param {Object} result - 分析结果
 * @param {HTMLElement} container - 结果容器元素
 */
function displayAnalysisResult(result, container) {
    // 清空容器
    container.innerHTML = '';
    
    // 创建结果卡片
    const card = document.createElement('div');
    card.className = 'card mt-4 mb-4';
    
    // 卡片头部
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.innerHTML = '<h5 class="card-title mb-0">识别结果</h5>';
    card.appendChild(cardHeader);
    
    // 卡片内容
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    // 添加主要预测结果
    const mainPrediction = document.createElement('div');
    mainPrediction.className = 'mb-4';
    mainPrediction.innerHTML = `
        <h6>主要分类</h6>
        <div class="d-flex align-items-center">
            <div class="badge bg-primary fs-6 me-2">${result.prediction.predicted_class}</div>
            <div class="progress flex-grow-1" style="height: 20px;">
                <div class="progress-bar" role="progressbar" style="width: ${result.prediction.confidence * 100}%;" 
                    aria-valuenow="${result.prediction.confidence * 100}" aria-valuemin="0" aria-valuemax="100">
                    ${Math.round(result.prediction.confidence * 100)}%
                </div>
            </div>
        </div>
    `;
    cardBody.appendChild(mainPrediction);
    
    // 添加Top3预测结果
    const top3Predictions = document.createElement('div');
    top3Predictions.className = 'mb-4';
    top3Predictions.innerHTML = '<h6>其他可能类别</h6>';
    
    const top3List = document.createElement('ul');
    top3List.className = 'list-group';
    
    result.prediction.top3_predictions.forEach((pred, index) => {
        if (index === 0 && pred.class === result.prediction.predicted_class) {
            return; // 跳过主分类
        }
        
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            ${pred.class}
            <span class="badge bg-secondary rounded-pill">${Math.round(pred.probability * 100)}%</span>
        `;
        top3List.appendChild(item);
    });
    
    top3Predictions.appendChild(top3List);
    cardBody.appendChild(top3Predictions);
    
    // 添加生成的标签
    if (result.generated_tags && result.generated_tags.length > 0) {
        const tagsSection = document.createElement('div');
        tagsSection.className = 'mb-4';
        tagsSection.innerHTML = '<h6>生成的标签</h6><div class="d-flex flex-wrap gap-2"></div>';
        
        const tagsContainer = tagsSection.querySelector('div');
        result.generated_tags.forEach(tag => {
            const tagBadge = document.createElement('span');
            tagBadge.className = 'badge bg-info';
            tagBadge.textContent = tag;
            tagsContainer.appendChild(tagBadge);
        });
        
        cardBody.appendChild(tagsSection);
    }
    
    card.appendChild(cardBody);
    container.appendChild(card);
}

// 导出API
window.ClothingRecognition = {
    analyzeImage,
    analyzeExistingImage,
    generateTags,
    getModelInfo,
    initRecognitionForm,
    displayAnalysisResult
}; 