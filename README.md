# 智能穿搭助手

一个基于AI的智能穿搭推荐系统，帮助用户管理衣橱并获得个性化的穿搭建议。

## 功能特点

- 🎭 角色系统：支持多个预设角色，每个角色都有独特的穿搭偏好和风格
- 📸 服装识别：自动识别上传服装的类型、颜色和风格
- 👔 衣橱管理：便捷的服装收藏和管理功能
- 🎨 穿搭推荐：基于场景和个人特征的智能穿搭建议
- 🖼️ 效果预览：生成穿搭效果图（开发中）

## 快速开始

### 环境要求

- Python 3.12+
- 现代浏览器（Chrome/Firefox/Edge）

### 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
cd MiaoDaDemo
```

2. 创建并激活虚拟环境
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux/Mac
python -m venv .venv
source .venv/bin/activate
```

3. 安装依赖
```bash
cd backend
pip install -r requirements.txt
```

4. 初始化数据库
```bash
alembic upgrade head
```

5. 启动后端服务
```bash
python -m uvicorn app.main:app --reload
```

6. 在浏览器中访问前端页面
```
打开 frontend/index.html
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

## API文档

启动后端服务后，访问以下地址查看API文档：
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## 开发状态

### 已完成功能
- [x] 基础项目架构
- [x] 角色管理系统
- [x] 图片上传功能
- [x] 服装识别基础功能
- [x] 衣橱管理核心功能

### 开发中功能
- [ ] 服装标签系统
- [ ] 穿搭推荐功能
- [ ] 效果图生成
- [ ] 用户反馈系统

## 技术栈

- 前端：HTML/CSS/JavaScript + Bootstrap 5
- 后端：Python + FastAPI + SQLite
- AI：PyTorch + ResNet50 + DeepSeek API

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 注意事项

1. 本项目目前处于开发阶段，API和功能可能会有变动
2. 本地开发使用SQLite数据库，无需额外配置
3. 图片上传功能需要确保storage目录具有写入权限
4. AI模型功能可能需要较长处理时间，请耐心等待

## 问题反馈

如果你在使用过程中遇到任何问题，请：
1. 查看项目文档
2. 检查API文档
3. 提交Issue描述问题

## 开发计划

请查看 [development_plan.md](development_plan.md) 了解详细的开发计划和进度。

## 最近更新

- 从PostgreSQL切换到SQLite以简化本地开发
- 前端从微信小程序调整为Web应用
- 实现了基础的角色管理系统
- 完成了图片上传和预处理功能
- 添加了服装识别的基础功能

## 许可证

[MIT](LICENSE) 