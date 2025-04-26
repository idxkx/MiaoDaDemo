from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, HttpUrl

# ==================== Clothes Image Schemas ====================

class ClothesImageBase(BaseModel):
    """图片模式基础模型"""
    image_url: str
    is_primary: bool = False

class ClothesImageCreate(ClothesImageBase):
    """创建图片模式"""
    pass

class ClothesImageUpdate(BaseModel):
    """更新图片模式"""
    image_url: Optional[str] = None
    is_primary: Optional[bool] = None

class ClothesImage(ClothesImageBase):
    """图片展示模式，继承自基础模型，包含ID"""
    id: int
    clothes_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True # Pydantic V1 的配置方式
        # Pydantic V2: from_attributes = True

# ==================== Clothes Schemas ====================

class ClothesBase(BaseModel):
    """服装基础模型，定义所有服装共有的基本字段"""
    name: str
    description: Optional[str] = None
    category: str
    sub_category: Optional[str] = None
    color: Optional[str] = None
    pattern: Optional[str] = None
    material: Optional[str] = None
    season: Optional[str] = None
    occasion: Optional[str] = None
    brand: Optional[str] = None
    is_favorite: Optional[bool] = False

class ClothesCreate(ClothesBase):
    """创建服装模式，继承自基础模型"""
    pass

class ClothesUpdate(BaseModel):
    """更新服装模式，所有字段都是可选的"""
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    color: Optional[str] = None
    pattern: Optional[str] = None
    material: Optional[str] = None
    season: Optional[str] = None
    occasion: Optional[str] = None
    brand: Optional[str] = None
    is_favorite: Optional[bool] = None
    is_active: Optional[bool] = None # 允许更新激活状态

class Clothes(ClothesBase):
    """服装展示模式，用于API响应，包含数据库生成的字段和关联数据"""
    id: int
    user_id: int
    # ai_features: Optional[List[float]] = None # 暂时不在基础响应中返回特征向量
    ai_tags: Optional[List[str]] = None
    ai_category_confidence: Optional[float] = None
    is_ai_categorized: bool
    is_active: bool
    wear_count: int
    images: List[ClothesImage] = [] # 包含关联的图片信息
    # clothes_tags: List[...] # 需要先定义 Tag Schema
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True # Pydantic V1 的配置方式
        # Pydantic V2: from_attributes = True

class ClothesSimple(BaseModel):
    """简化的服装信息，用于列表等场景"""
    id: int
    name: str
    category: str
    primary_image_url: Optional[str] = None

    class Config:
        orm_mode = True
        # Pydantic V2: from_attributes = True 