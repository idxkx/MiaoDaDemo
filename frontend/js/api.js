/**
 * 智能穿搭助手 - API交互逻辑
 * 封装与后端API的交互方法
 */

const API = {
    // API基础URL
    baseUrl: 'http://127.0.0.1:8000/api/v1',
    
    /**
     * 获取存储的访问令牌
     * @returns {string|null} 存储的令牌或null
     */
    getToken() {
        return localStorage.getItem('accessToken');
    },
    
    /**
     * 设置访问令牌到本地存储
     * @param {string} token 访问令牌
     */
    setToken(token) {
        localStorage.setItem('accessToken', token);
    },
    
    /**
     * 清除访问令牌
     */
    clearToken() {
        localStorage.removeItem('accessToken');
    },
    
    /**
     * 检查用户是否已登录
     * @returns {boolean} 是否已登录
     */
    isLoggedIn() {
        return !!this.getToken();
    },
    
    /**
     * 执行API请求
     * @param {string} endpoint API端点路径
     * @param {Object} options 请求选项
     * @returns {Promise<any>} 响应数据的Promise
     */
    async fetch(endpoint, options = {}) {
        const token = this.getToken();
        
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
            const response = await fetch(`${this.baseUrl}${endpoint}`, fetchOptions);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `请求失败: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    },
    
    /**
     * 用户登录
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {Promise<Object>} 登录响应
     */
    async login(username, password) {
        const response = await this.fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (response.access_token) {
            this.setToken(response.access_token);
        }
        
        return response;
    },
    
    /**
     * 用户注册
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {Promise<Object>} 注册响应
     */
    async register(username, password) {
        return await this.fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },
    
    /**
     * 用户登出
     */
    logout() {
        this.clearToken();
    },
    
    /**
     * 获取用户衣橱中的服装列表
     * @param {Object} filters 筛选条件
     * @returns {Promise<Array>} 服装列表
     */
    async getClothingItems(filters = {}) {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });
        
        const queryString = queryParams.toString();
        const endpoint = `/clothing?${queryString}`;
        
        return await this.fetch(endpoint);
    },
    
    /**
     * 获取单个服装项详情
     * @param {string} id 服装ID
     * @returns {Promise<Object>} 服装详情
     */
    async getClothingItem(id) {
        return await this.fetch(`/clothing/${id}`);
    },
    
    /**
     * 添加新服装
     * @param {FormData} formData 包含服装信息和图片的表单数据
     * @returns {Promise<Object>} 新添加的服装数据
     */
    async addClothingItem(formData) {
        return await this.fetch('/clothing', {
            method: 'POST',
            headers: {
                // 不设置Content-Type，让浏览器自动设置带边界的multipart/form-data
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: formData
        });
    },
    
    /**
     * 更新服装信息
     * @param {string} id 服装ID
     * @param {Object} data 更新的数据
     * @returns {Promise<Object>} 更新后的服装数据
     */
    async updateClothingItem(id, data) {
        return await this.fetch(`/clothing/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * 删除服装
     * @param {string} id 服装ID
     * @returns {Promise<Object>} 删除结果
     */
    async deleteClothingItem(id) {
        return await this.fetch(`/clothing/${id}`, {
            method: 'DELETE'
        });
    },
    
    /**
     * 获取穿搭推荐
     * @param {Object} params 推荐参数
     * @returns {Promise<Array>} 推荐的穿搭列表
     */
    async getOutfitRecommendations(params = {}) {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });
        
        const queryString = queryParams.toString();
        const endpoint = `/outfits/recommend?${queryString}`;
        
        return await this.fetch(endpoint);
    },
    
    /**
     * 生成穿搭效果图
     * @param {Object} params 效果图生成参数
     * @returns {Promise<Object>} 生成的效果图信息
     */
    async generateOutfitImage(params) {
        return await this.fetch('/outfits/generate-image', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    },
    
    /**
     * 保存穿搭方案
     * @param {Object} outfit 穿搭方案数据
     * @returns {Promise<Object>} 保存的穿搭方案
     */
    async saveOutfit(outfit) {
        return await this.fetch('/outfits', {
            method: 'POST',
            body: JSON.stringify(outfit)
        });
    },
    
    /**
     * 获取用户保存的穿搭方案列表
     * @returns {Promise<Array>} 穿搭方案列表
     */
    async getSavedOutfits() {
        return await this.fetch('/outfits');
    }
};

// 导出API对象
export default API; 