# 智能穿搭助手项目结构

## 项目概述

智能穿搭助手是一个轻量级、简洁实用的服装管理与穿搭推荐工具，通过AI技术帮助用户更好地管理衣橱并获取穿搭建议。

## 核心设计理念

- **简洁高效**：专注于核心功能，减少不必要的复杂性
- **用户友好**：无需注册登录，通过角色切换直接体验
- **AI赋能**：利用AI技术识别服装特征并提供穿搭建议
- **个性化体验**：基于不同角色特征提供差异化推荐

## 目录结构

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

## 主要组件

### 1. 角色管理系统

存储和管理6个预设虚拟角色（3男3女）的基础信息和穿搭偏好。

**关键文件**:
- `backend/app/models/persona.py`: 角色数据模型
- `backend/app/api/v1/personas.py`: 角色API端点
- `frontend/js/persona.js`: 角色管理前端逻辑
- `frontend/personas.html`: 角色选择界面

**核心功能**:
- 角色基本信息管理
- 角色偏好设置
- 角色切换机制
- 角色与衣橱数据关联

### 2. 衣橱管理系统

用于存储和管理用户的服装项目，包括图片、分类、标签等信息。

**关键文件**:
- `backend/app/models/clothes.py`: 服装数据模型
- `backend/app/api/v1/clothes.py`: 服装API端点
- `frontend/js/closet.js`: 衣橱管理前端逻辑
- `frontend/closet.html`: 衣橱界面

**核心功能**:
- 服装项CRUD操作
- 服装分类和筛选
- 服装图片管理
- 服装标签系统

### 3. 服装识别系统

利用AI模型自动识别上传的服装图片，提取关键特征。

**关键文件**:
- `backend/app/services/recognition.py`: 识别服务
- `backend/app/api/v1/recognition.py`: 识别API端点
- `models/clothes_model/`: AI模型文件
- `frontend/js/upload.js`: 上传和识别前端逻辑

**核心功能**:
- 图片预处理
- 服装类型识别
- 特征提取
- 自动标签生成

### 4. 穿搭推荐系统

根据角色特征和衣橱内容，为不同场合提供穿搭建议。

**关键文件**:
- `backend/app/services/recommendation.py`: 推荐服务
- `backend/app/api/v1/recommendation.py`: 推荐API端点
- `frontend/js/recommend.js`: 推荐前端逻辑
- `frontend/recommend.html`: 推荐界面

**核心功能**:
- 场景分析
- 服装匹配
- 角色特征适配
- 搭配建议生成

## 数据模型

### 角色 (Persona)

```python
class Persona(Base):
    __tablename__ = "personas"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    gender = Column(String)  # male, female
    age = Column(Integer)
    occupation = Column(String)
    height = Column(Integer)  # cm
    weight = Column(Integer)  # kg
    body_type = Column(String)  # slim, athletic, full, etc
    style_preference = Column(JSON)  # preferred styles
    color_preference = Column(JSON)  # preferred colors
    occasion_preference = Column(JSON)  # preferred occasions
    season_adaptation = Column(String)  # preferred seasons
    description = Column(Text)
    
    # 关联关系
    clothes = relationship("Clothes", back_populates="persona")
    outfits = relationship("Outfit", back_populates="persona")
```

### 服装 (Clothes)

```python
class Clothes(Base):
    __tablename__ = "clothes"
    
    id = Column(Integer, primary_key=True)
    persona_id = Column(Integer, ForeignKey("personas.id"))
    name = Column(String)
    category = Column(String, index=True)  # tops, bottoms, dresses, etc
    subcategory = Column(String)
    color = Column(String)
    pattern = Column(String)
    season = Column(String)
    occasion = Column(JSON)
    brand = Column(String)
    description = Column(Text)
    is_favorite = Column(Boolean, default=False)
    image_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关联关系
    persona = relationship("Persona", back_populates="clothes")
    tags = relationship("Tag", secondary=clothes_tags, back_populates="clothes")
    outfits = relationship("Outfit", secondary=outfit_clothes, back_populates="clothes")
```

### 标签 (Tag)

```python
class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    category = Column(String)  # style, color, occasion, etc
    
    # 关联关系
    clothes = relationship("Clothes", secondary=clothes_tags, back_populates="tags")
```

### 穿搭 (Outfit)

```python
class Outfit(Base):
    __tablename__ = "outfits"
    
    id = Column(Integer, primary_key=True)
    persona_id = Column(Integer, ForeignKey("personas.id"))
    name = Column(String)
    occasion = Column(String)
    season = Column(String)
    style = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关联关系
    persona = relationship("Persona", back_populates="outfits")
    clothes = relationship("Clothes", secondary=outfit_clothes, back_populates="outfits")
```

## API端点

### 角色API

- `GET /api/v1/personas/`: 获取所有预设角色
- `GET /api/v1/personas/{id}`: 获取特定角色详情
- `GET /api/v1/personas/current`: 获取当前选择的角色
- `POST /api/v1/personas/select/{id}`: 选择特定角色

### 衣橱API

- `GET /api/v1/clothes/`: 获取当前角色的所有服装
- `POST /api/v1/clothes/`: 添加新服装
- `GET /api/v1/clothes/{id}`: 获取特定服装详情
- `PUT /api/v1/clothes/{id}`: 更新服装信息
- `DELETE /api/v1/clothes/{id}`: 删除服装
- `POST /api/v1/clothes/upload-image/`: 上传服装图片

### 识别API

- `POST /api/v1/recognition/`: 识别服装图片

### 推荐API

- `POST /api/v1/recommendation/`: 获取穿搭推荐

## 前端页面

### 核心页面

- `index.html`: 首页，包含项目介绍和角色选择
- `personas.html`: 角色管理页面
- `closet.html`: 衣橱管理页面
- `upload.html`: 服装上传和编辑页面
- `recommend.html`: 穿搭推荐页面

### 组件结构

- **导航栏**: 页面导航、角色切换入口
- **角色切换面板**: 显示所有预设角色，允许快速切换
- **衣橱过滤器**: 按分类、颜色、季节等筛选服装
- **上传控件**: 拖放或选择图片上传
- **服装表单**: 添加/编辑服装信息
- **推荐表单**: 选择场合、季节等获取推荐

## 系统流程

### 基本使用流程

1. 首页选择一个虚拟角色
2. 进入个人衣橱页面
3. 上传服装图片并添加到衣橱
4. 根据需要获取穿搭推荐

### 穿搭推荐流程

1. 选择特定场合和季节
2. 系统分析当前角色特征与衣橱内容
3. 生成符合角色特点的穿搭方案
4. 展示推荐结果与搭配技巧 