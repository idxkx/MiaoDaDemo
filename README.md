# 智能穿搭助手微信小程序

这是一款基于AI技术的智能穿搭助手微信小程序，帮助用户管理个人衣橱并获取个性化穿搭建议。

## 主要功能

### 1. 服装识别与管理
- 上传服装照片，自动识别服装类型、颜色、风格、款式等信息
- 以标签形式记录服装特征
- 支持服装多分类关联（一件服装可属于多个分类）
- 构建个人数字化衣橱

### 2. 智能穿搭推荐
- 用户输入穿搭场景（如约会、面试、日常等）
- 调用DeepSeek大模型生成穿搭策略
- 从用户衣橱中选择合适的服装组合

### 3. 服装特征深度分析
- 对所选服装进行深度特征提取
- 生成每件服装的详细特征描述

### 4. AI穿搭效果图生成
- 根据选中的服装组合
- 结合服装详细特征描述
- 生成穿搭效果图，直观展示搭配效果

## 项目文档

本项目包含以下详细设计文档：

- [项目结构设计](./project_structure.md) - 详细的目录结构和数据模型设计
- [技术栈选型](./tech_stack.md) - 项目使用的技术栈和选型理由
- [用户流程设计](./user_flow.md) - 用户使用流程和交互设计
- [AI模型设计](./ai_models_design.md) - AI模型架构和实现方案
- [前端界面设计](./frontend_design.md) - 小程序界面设计和交互原型
- [开发计划](./development_plan.md) - 详细的项目开发计划与进度

## 技术架构

### 前端（微信小程序）
- 微信小程序原生框架
- WXML/WXSS/WXS
- 微信云开发集成

### 后端服务
- Python + FastAPI
- SQLAlchemy + PostgreSQL
- Celery + Redis 任务队列

### AI模型
- 服装识别：ResNet50 基于 PyTorch
- 文本生成：DeepSeek API
- 图像生成：Stable Diffusion 3.0 + ControlNet

## 快速开始

### 环境要求
- Python 3.9+
- Node.js 14+
- PostgreSQL 15+
- Redis 最新版

### 后端服务部署

1. 克隆代码库
```bash
git clone https://github.com/your-username/fashion-assistant.git
cd fashion-assistant/backend
```

2. 创建并激活虚拟环境
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. 安装依赖
```bash
pip install -r requirements.txt
```

4. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入数据库连接信息和API密钥
# 新增或修改以下行来指定要使用的服装识别模型目录名：
# ACTIVE_CLOTHING_MODEL=your_chosen_model_directory_name
```

5. 初始化数据库
```bash
alembic upgrade head
```

6. 启动服务
```bash
# 启动主服务
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 启动Celery任务队列（新终端）
celery -A app.worker worker --loglevel=info
```

### 微信小程序开发

1. 安装微信开发者工具

2. 导入项目
```
导入项目路径: ./frontend
AppID: 在微信公众平台申请的AppID
```

3. 配置服务器
```
在微信开发者工具中配置服务器地址: http://your-server-ip:8000
```

4. 调试运行
```
点击"编译"按钮开始调试
```

## 开发指南

### 后端API开发

1. 添加新的API端点
```python
# 在 app/api/v1/ 下创建新文件或使用现有文件
from fastapi import APIRouter, Depends

router = APIRouter()

@router.get("/endpoint")
async def read_endpoint():
    return {"message": "Hello World"}
```

2. 注册API路由
```python
# 在 app/api/v1/__init__.py 中
from app.api.v1 import endpoint
api_router.include_router(endpoint.router, tags=["endpoint"])
```

### 微信小程序开发

1. 添加新页面
```
在 frontend/pages/ 下创建新文件夹
添加 .wxml, .wxss, .js, .json 文件
在 app.json 中注册页面路径
```

2. 调用后端API
```javascript
// 在页面JS文件中
wx.request({
  url: 'https://your-server-ip:8000/api/v1/endpoint',
  method: 'GET',
  success(res) {
    console.log(res.data)
  }
})
```

### AI模型开发

#### 模型管理

项目支持动态加载 `models/` 目录下的服装识别模型。服务器启动时会自动扫描该目录下的所有子文件夹，并将它们识别为可用的模型。

**添加新模型：**
1. 将训练好的模型文件放置在 `models/` 目录下的一个新子文件夹中（例如 `models/my_new_model_v2/`）。
2. 确保模型文件夹内包含必要的模型文件和可能的配置文件。

**选择使用模型：**
1. 编辑项目根目录下的 `.env` 文件（如果不存在则从 `.env.example` 复制创建）。
2. 添加或修改 `ACTIVE_CLOTHING_MODEL` 变量，将其值设置为 `models/` 目录下你希望使用的模型的子文件夹名称。
```
# .env 文件示例
ACTIVE_CLOTHING_MODEL=my_clothes_model
```
3. 重启后端服务以加载新选择的模型。

#### 模型切换 API (可选)

如果需要运行时动态切换模型，可以考虑实现一个API端点来更新配置并重新加载模型服务（需要更复杂的实现）。

## 数据库设计参考

要了解数据库的结构和关系，有以下几种方式：

1.  **阅读模型代码 (最准确)**：
    *   数据库的表、字段和关系最终是由 `backend/app/models/` 目录下的 Python 文件 (`.py`) 定义的。
    *   直接阅读这些文件可以了解最准确、最新的数据库设计。

2.  **生成 Mermaid ER 图代码 (推荐用于可视化)**：
    *   项目提供了一个工具脚本，可以根据当前的数据库模型自动生成 [Mermaid](https://mermaid.js.org/) 格式的 ER 图代码。
    *   在项目根目录 (MiaoDaDemo) 下打开终端，运行以下命令：
      ```bash
      python tools/generate_mermaid.py
      ```
    *   该脚本会分析模型文件，并在终端直接打印出 Mermaid 代码。
    *   **如何查看**: 你可以将打印出的完整代码 (从 `erDiagram` 开始到最后) 复制下来，粘贴到任何支持 Mermaid 的地方来查看可视化的 ER 图，例如：
        *   在线编辑器: [Mermaid Live Editor](https://mermaid.live/)
        *   一些 Markdown 编辑器（如 Typora、Obsidian，可能需要安装插件）
        *   GitHub/GitLab 的 Markdown 文件
    *   这个脚本会尝试从代码注释中提取中文名，如果模型代码中的字段有 `# 中文名` 这样的注释，图中就会显示中文名。

3.  **参考 ER 图规范 (可选)**：
    *   如果你想手动绘制 ER 图或者理解图的规范，可以参考 `.cursor/rules/er-diagram-standards.mdc` 文件中定义的核心规范。

## 贡献代码

欢迎提交 Pull Request！请确保代码遵循项目规范并通过测试。

## 联系方式

如有问题，请联系 [你的名字] ([你的邮箱]) 