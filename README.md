# 智能穿搭助手

## 项目简介

智能穿搭助手是一个基于AI的服装识别和穿搭推荐系统，帮助用户管理个人衣橱、获取穿搭建议。项目采用简单Web界面实现功能演示，便于快速理解产品概念和交互流程。

## 技术栈

本项目采用简化架构，使用以下技术：

### 后端
- **FastAPI**: 高性能API框架
- **SQLite**: 轻量级数据库
- **SQLAlchemy**: ORM框架
- **PyTorch**: AI模型推理
- **JWT**: 身份验证

### 前端
- **HTML/CSS/JavaScript**: 原生前端技术
- **Bootstrap 5**: 快速UI开发框架
- **Fetch API**: 简单API调用

### AI模型
- **ResNet50**: 服装识别基础模型
- **DeepSeek API**: 穿搭推荐和文本生成（可选）

## 项目结构

```
MiaoDaDemo/
├── backend/               # 后端API服务
│   ├── app/               # 应用核心代码
│   │   ├── api/           # API路由
│   │   ├── core/          # 配置、核心逻辑
│   │   ├── db/            # 数据库会话、操作
│   │   ├── models/        # 数据模型
│   │   ├── schemas/       # 数据校验模型
│   │   ├── services/      # 业务逻辑
│   │   └── utils/         # 工具函数
│   ├── storage/           # 文件存储目录
│   │   ├── images/        # 图片存储
│   │   └── temp/          # 临时文件
│   └── tests/             # 测试代码
├── frontend/              # Web前端
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript文件
│   ├── assets/            # 静态资源
│   └── *.html             # HTML页面
├── models/                # AI模型文件
└── tools/                 # 开发工具脚本
```

## 主要功能

1. **用户认证**: 简单的用户名/密码认证
2. **服装识别**: 上传图片识别服装类型、颜色等属性
3. **衣橱管理**: 管理个人衣物、添加标签和分类
4. **穿搭推荐**: 基于场景和个人衣橱提供穿搭建议
5. **效果图生成**: 基于AI生成穿搭效果图（可选功能）

## 快速开始

### 环境要求
- Python 3.12+
- 现代浏览器（Chrome、Firefox、Edge等）
- 推荐使用虚拟环境

### 安装步骤

1. 克隆仓库
```bash
git clone <repository-url>
cd MiaoDaDemo
```

2. 创建并激活虚拟环境
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate     # Windows
```

3. 安装依赖
```bash
pip install -r backend/requirements.txt
```

4. 设置环境变量
```bash
cp .env.example .env
# 编辑.env文件，设置必要的环境变量
```

5. 运行开发服务器
```bash
cd backend
python main.py
```

6. 访问Web界面
- 后端服务器将在 http://127.0.0.1:8000 启动
- API文档可在 http://127.0.0.1:8000/docs 访问
- 前端页面可直接在浏览器中打开 frontend/index.html，或通过simple-http-server等方式提供服务

## API文档

启动服务器后，访问 `/docs` 或 `/redoc` 路径查看完整的API文档。

## 前端界面预览

### 主要页面
- **登录/注册页面**: 用户身份验证
- **衣橱管理页面**: 查看和管理个人服装
- **服装上传页面**: 上传并识别新服装
- **穿搭推荐页面**: 获取场景穿搭建议
- **效果图生成页面**: 生成搭配效果图

## 测试

运行测试：
```bash
cd backend
pytest
```

## 开发计划

详细开发计划请查看 [development_plan.md](development_plan.md)。

## 项目文档

本项目包含以下详细设计文档：

- [项目结构设计](./project_structure.md) - 详细的目录结构和数据模型设计
- [技术栈选型](./tech_stack.md) - 项目使用的技术栈和选型理由
- [用户流程设计](./user_flow.md) - 用户使用流程和交互设计
- [AI模型设计](./ai_models_design.md) - AI模型架构和实现方案

## 数据库设计

要了解数据库的结构和关系，可以：

1. **阅读模型代码**: 
   * 查看 `backend/app/models/` 目录下的Python文件

2. **生成ER图**:
   * 使用项目工具脚本生成ER图:
     ```bash
     python tools/generate_mermaid.py
     ```
   * 将生成的Mermaid代码粘贴到[Mermaid Live Editor](https://mermaid.live/)查看

## 贡献代码

欢迎提交Pull Request！请确保代码遵循项目规范并通过测试。 