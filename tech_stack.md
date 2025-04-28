# 智能穿搭助手技术栈选型

## 前端技术栈

| 技术/框架 | 版本 | 说明 | 选择理由 |
|---------|-----|------|---------|
| HTML5/CSS3/JavaScript | 最新 | Web标准技术 | 广泛支持，开发简单 |
| Bootstrap 5 | 5.0+ | UI框架 | 响应式设计，组件丰富 |
| 原生JavaScript | ES6+ | 编程语言 | 避免框架依赖，保持简单 |

## 后端技术栈

| 技术/框架 | 版本 | 说明 | 选择理由 |
|---------|-----|------|---------|
| Python | 3.12+ | 编程语言 | 丰富的AI/ML生态系统，开发效率高 |
| FastAPI | 0.109+ | Web框架 | 高性能异步API框架，自动生成API文档 |
| SQLAlchemy | 2.0+ | ORM框架 | 功能强大的ORM，支持复杂查询和关联 |
| Alembic | 1.13+ | 数据库迁移工具 | 与SQLAlchemy配套，支持数据库版本控制 |
| Pydantic | 2.6+ | 数据验证 | 与FastAPI配套，提供强类型检查 |
| SQLite | 3.0+ | 关系型数据库 | 轻量级，无需配置，适合本地开发 |
| Pillow | 11.2+ | 图像处理库 | Python标准图像处理库，功能完善 |
| pytest | 最新 | 测试框架 | 全面的测试支持，易于编写和维护测试 |

## AI模型技术栈

| 技术/框架 | 版本 | 说明 | 选择理由 |
|---------|-----|------|---------|
| PyTorch | 2.0+ | 深度学习框架 | 灵活强大，适合研究和生产环境 |
| ResNet50 | 预训练 | 服装识别基础模型 | 结构成熟，适合迁移学习 |
| DeepSeek | API | 大语言模型 | 强大的文本生成和理解能力，用于穿搭策略生成 |

## 开发工具和环境

| 工具/平台 | 用途 | 选择理由 |
|---------|------|---------|
| VS Code | 代码编辑器 | 轻量、插件丰富、支持多种语言 |
| Git/GitHub | 版本控制 | 协作开发必备，代码管理标准 |
| Python venv | 虚拟环境 | 项目依赖隔离，避免冲突 |
| requirements.txt | 依赖管理 | 简单有效的Python依赖管理方式 |

## 开发环境配置

### Python环境
```bash
# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 数据库配置
```python
# SQLite配置（config.py）
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"
```

### 开发服务器启动
```bash
# 启动FastAPI服务器
python -m uvicorn app.main:app --reload
```

## 项目结构

```
MiaoDaDemo/
├── backend/                # 后端代码
│   ├── alembic/           # 数据库迁移
│   ├── app/               # 应用代码
│   │   ├── api/          # API路由
│   │   ├── core/         # 核心配置
│   │   ├── models/       # 数据模型
│   │   └── services/     # 业务服务
│   └── storage/          # 文件存储
├── frontend/             # 前端代码
│   ├── assets/          # 静态资源
│   ├── css/             # 样式文件
│   ├── js/              # JavaScript
│   └── index.html       # 主页面
└── models/              # AI模型文件
```

## 部署说明

### 本地开发环境
1. 克隆代码库
2. 创建并激活Python虚拟环境
3. 安装项目依赖
4. 初始化数据库
5. 启动开发服务器

### 生产环境（待实现）
1. 使用生产级数据库（如PostgreSQL）
2. 配置反向代理（如Nginx）
3. 使用进程管理器（如Supervisor）
4. 实现缓存机制
5. 配置HTTPS

## 注意事项

1. 本地开发优先使用SQLite
2. 保持依赖最小化，避免不必要的包
3. 定期更新依赖版本
4. 重视代码质量和测试覆盖
5. 保持文档的同步更新 