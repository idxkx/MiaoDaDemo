# 智能穿搭助手项目结构设计

## 目录结构

```
├── backend/                   # 后端服务
│   ├── app/                   # 应用主目录
│   │   ├── api/               # API接口定义
│   │   │   ├── v1/            # v1版本API
│   │   │   │   ├── clothing.py  # 服装相关API
│   │   │   │   ├── outfit.py  # 穿搭方案API
│   │   │   │   └── user.py    # 用户相关API
│   │   ├── core/              # 核心功能
│   │   │   ├── config.py      # 配置管理
│   │   │   ├── security.py    # 安全相关
│   │   │   └── logging.py     # 日志管理
│   │   ├── db/                # 数据库相关
│   │   │   ├── base.py        # 基础数据库配置
│   │   │   ├── session.py     # 数据库会话管理
│   │   │   └── init_db.py     # 数据库初始化
│   │   ├── models/            # 数据模型
│   │   │   ├── clothing.py    # 服装模型
│   │   │   ├── outfit.py      # 穿搭模型
│   │   │   ├── tag.py         # 标签模型
│   │   │   └── user.py        # 用户模型
│   │   ├── schemas/           # 数据验证模式
│   │   │   ├── clothing.py    # 服装数据模式
│   │   │   ├── outfit.py      # 穿搭数据模式
│   │   │   └── user.py        # 用户数据模式
│   │   ├── services/          # 业务服务
│   │   │   ├── clothing_recognition.py  # 服装识别服务
│   │   │   ├── outfit_generation.py     # 穿搭生成服务
│   │   │   ├── image_generation.py      # 图像生成服务
│   │   │   └── llm_service.py           # 大模型服务
│   │   └── utils/             # 工具函数
│   │       ├── file_utils.py  # 文件处理
│   │       └── image_utils.py # 图像处理
│   ├── tests/                 # 测试目录
│   │   ├── api/               # API测试
│   │   ├── services/          # 服务测试
│   │   └── conftest.py        # 测试配置
│   ├── alembic/               # 数据库迁移
│   ├── main.py                # 应用入口
│   ├── requirements.txt       # 依赖管理
│   └── Dockerfile             # Docker配置
│
├── frontend/                  # 微信小程序前端
│   ├── pages/                 # 页面组件
│   │   ├── index/             # 首页
│   │   ├── wardrobe/          # 衣橱管理
│   │   ├── outfit/            # 穿搭推荐
│   │   └── user/              # 用户中心
│   ├── components/            # 通用组件
│   │   ├── clothing-item/     # 服装项组件
│   │   ├── tag-selector/      # 标签选择器
│   │   └── outfit-card/       # 穿搭卡片
│   ├── utils/                 # 工具函数
│   │   ├── request.js         # 请求封装
│   │   └── file.js            # 文件处理
│   ├── static/                # 静态资源
│   │   ├── images/            # 图片资源
│   │   └── icons/             # 图标资源
│   ├── app.js                 # 应用入口
│   ├── app.json               # 应用配置
│   └── project.config.json    # 项目配置
│
├── models/                    # AI模型
│   ├── clothing_recognition/  # 服装识别模型
│   │   ├── model.py           # 模型定义
│   │   ├── train.py           # 训练脚本
│   │   └── inference.py       # 推理脚本
│   └── image_generation/      # 图像生成模型
│       ├── model.py           # 模型定义
│       └── inference.py       # 推理脚本
│
├── docs/                      # 文档
│   ├── api/                   # API文档
│   ├── deployment/            # 部署文档
│   └── user-guide/            # 用户指南
│
├── scripts/                   # 脚本工具
│   ├── setup.sh               # 环境设置脚本
│   └── deploy.sh              # 部署脚本
│
├── .gitignore                 # Git忽略配置
├── README.md                  # 项目说明
└── docker-compose.yml         # Docker编排配置
```

## 数据模型设计

### 用户模型 (User)
```python
class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    openid = Column(String, unique=True, index=True)  # 微信用户唯一标识
    nickname = Column(String)
    avatar = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关联
    clothings = relationship("Clothing", back_populates="user")
    outfits = relationship("Outfit", back_populates="user")
```

### 服装标签模型 (Tag)
```python
class Tag(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)  # 标签类别：类型、颜色、风格、季节等
    
    # 关联
    clothing_tags = relationship("ClothingTag", back_populates="tag")
```

### 服装模型 (Clothing)
```python
class Clothing(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关联
    user = relationship("User", back_populates="clothings")
    tags = relationship("ClothingTag", back_populates="clothing")
    outfit_items = relationship("OutfitItem", back_populates="clothing")
```

### 服装-标签关联模型 (ClothingTag)
```python
class ClothingTag(Base):
    id = Column(Integer, primary_key=True, index=True)
    clothing_id = Column(Integer, ForeignKey("clothings.id"))
    tag_id = Column(Integer, ForeignKey("tags.id"))
    
    # 关联
    clothing = relationship("Clothing", back_populates="tags")
    tag = relationship("Tag", back_populates="clothing_tags")
```

### 穿搭方案模型 (Outfit)
```python
class Outfit(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    scenario = Column(String)  # 穿搭场景
    description = Column(Text)
    generated_image_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关联
    user = relationship("User", back_populates="outfits")
    items = relationship("OutfitItem", back_populates="outfit")
```

### 穿搭-服装关联模型 (OutfitItem)
```python
class OutfitItem(Base):
    id = Column(Integer, primary_key=True, index=True)
    outfit_id = Column(Integer, ForeignKey("outfits.id"))
    clothing_id = Column(Integer, ForeignKey("clothings.id"))
    position = Column(String)  # 在穿搭中的位置/类别：上衣、裤子、鞋等
    
    # 关联
    outfit = relationship("Outfit", back_populates="items")
    clothing = relationship("Clothing", back_populates="outfit_items")
```

## API 接口设计

### 用户相关
- `POST /api/v1/users/login` - 用户登录/注册
- `GET /api/v1/users/me` - 获取当前用户信息
- `PUT /api/v1/users/me` - 更新用户信息

### 服装相关
- `POST /api/v1/clothings` - 上传新服装
- `GET /api/v1/clothings` - 获取用户服装列表
- `GET /api/v1/clothings/{id}` - 获取单个服装详情
- `PUT /api/v1/clothings/{id}` - 更新服装信息
- `DELETE /api/v1/clothings/{id}` - 删除服装
- `POST /api/v1/clothings/{id}/recognize` - 识别服装特征

### 标签相关
- `GET /api/v1/tags` - 获取所有标签
- `GET /api/v1/tags/categories` - 获取标签类别
- `POST /api/v1/clothings/{id}/tags` - 为服装添加标签
- `DELETE /api/v1/clothings/{id}/tags/{tag_id}` - 移除服装标签

### 穿搭相关
- `POST /api/v1/outfits/generate` - 生成穿搭方案
- `GET /api/v1/outfits` - 获取用户穿搭方案列表
- `GET /api/v1/outfits/{id}` - 获取单个穿搭方案详情
- `PUT /api/v1/outfits/{id}` - 更新穿搭方案
- `DELETE /api/v1/outfits/{id}` - 删除穿搭方案
- `POST /api/v1/outfits/{id}/image` - 生成穿搭效果图

### 模型管理
- `GET /api/v1/models/available` - 获取可用的服装识别模型列表
- `GET /api/v1/models/current` - 获取当前使用的服装识别模型名称 