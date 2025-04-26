/**
 * 服装图片上传组件
 * 提供图片选择、预览、压缩和上传功能
 */

// 基础配置
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
const UPLOAD_ENDPOINT = `${API_BASE_URL}/clothes/upload-image`;

// 图片压缩配置
const COMPRESSION_OPTIONS = {
    maxWidth: 1200,    // 最大宽度
    maxHeight: 1200,   // 最大高度
    quality: 0.85,     // JPEG质量
    mimeType: 'image/jpeg'
};

// 工具函数: 获取JWT令牌
function getAuthToken() {
    return localStorage.getItem('token');
}

// 工具函数: 创建FormData对象
function createFormData(file, clothesId = null, isPrimary = false) {
    const formData = new FormData();
    formData.append('file', file);
    if (clothesId) {
        formData.append('clothes_id', clothesId);
    }
    formData.append('is_primary', isPrimary);
    return formData;
}

// 工具函数: 图片压缩
async function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                // 计算新尺寸，保持宽高比
                let width = img.width;
                let height = img.height;
                if (width > COMPRESSION_OPTIONS.maxWidth) {
                    height = Math.round(height * COMPRESSION_OPTIONS.maxWidth / width);
                    width = COMPRESSION_OPTIONS.maxWidth;
                }
                if (height > COMPRESSION_OPTIONS.maxHeight) {
                    width = Math.round(width * COMPRESSION_OPTIONS.maxHeight / height);
                    height = COMPRESSION_OPTIONS.maxHeight;
                }

                // 创建Canvas进行压缩
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // 转换为Blob
                canvas.toBlob(blob => {
                    // 创建一个新的File对象
                    const compressedFile = new File(
                        [blob],
                        file.name,
                        { type: COMPRESSION_OPTIONS.mimeType }
                    );
                    resolve(compressedFile);
                }, COMPRESSION_OPTIONS.mimeType, COMPRESSION_OPTIONS.quality);
            };
            img.onerror = error => reject(error);
        };
        reader.onerror = error => reject(error);
    });
}

// 工具函数: 图片预览
function createImagePreview(file, previewElementId) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => {
            const previewElement = document.getElementById(previewElementId);
            if (previewElement) {
                previewElement.src = e.target.result;
                previewElement.style.display = 'block';
            }
            resolve();
        };
        reader.readAsDataURL(file);
    });
}

/**
 * 上传图片到服务器
 * @param {File} file - 图片文件
 * @param {Number|null} clothesId - 关联的服装ID，可选
 * @param {Boolean} isPrimary - 是否为主图
 * @param {String} previewElementId - 用于预览的图片元素ID
 * @returns {Promise} - 上传结果
 */
async function uploadClothesImage(file, clothesId = null, isPrimary = false, previewElementId = null) {
    try {
        // 1. 如果提供了预览元素，创建预览
        if (previewElementId) {
            await createImagePreview(file, previewElementId);
        }

        // 2. 压缩图片
        const compressedFile = await compressImage(file);

        // 3. 准备表单数据
        const formData = createFormData(compressedFile, clothesId, isPrimary);

        // 4. 发送上传请求
        const response = await fetch(UPLOAD_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
        });

        // 5. 处理响应
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '上传失败');
        }

        // 6. 返回成功结果
        return await response.json();
    } catch (error) {
        console.error('图片上传错误:', error);
        throw error;
    }
}

/**
 * 初始化图片上传控件
 * @param {String} inputId - 文件输入元素ID 
 * @param {String} previewId - 预览图片元素ID
 * @param {String} uploadBtnId - 上传按钮元素ID
 * @param {Function} onSuccess - 上传成功回调
 * @param {Function} onError - 上传失败回调
 * @param {Number|null} clothesId - 关联服装ID
 */
function initImageUploader(inputId, previewId, uploadBtnId, onSuccess, onError, clothesId = null) {
    const fileInput = document.getElementById(inputId);
    const previewElement = document.getElementById(previewId);
    const uploadBtn = document.getElementById(uploadBtnId);
    
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
        await createImagePreview(file, previewId);
        
        // 启用上传按钮
        if (uploadBtn) {
            uploadBtn.disabled = false;
        }
    });

    // 监听上传按钮点击
    if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
            if (!selectedFile) return;
            
            try {
                uploadBtn.disabled = true;
                uploadBtn.textContent = '上传中...';
                
                const result = await uploadClothesImage(selectedFile, clothesId, true);
                
                if (onSuccess) {
                    onSuccess(result);
                }
                
                // 重置状态
                uploadBtn.textContent = '上传成功';
                setTimeout(() => {
                    uploadBtn.textContent = '上传图片';
                    uploadBtn.disabled = false;
                }, 2000);
                
            } catch (error) {
                uploadBtn.textContent = '上传失败';
                uploadBtn.disabled = false;
                
                if (onError) {
                    onError(error);
                }
            }
        });
    }
}

// 导出API
window.ImageUploader = {
    uploadClothesImage,
    initImageUploader,
    compressImage,
    createImagePreview
}; 