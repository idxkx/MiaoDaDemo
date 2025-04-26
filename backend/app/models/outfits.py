from datetime import datetime
from typing import Optional, List

from sqlalchemy import Column, ForeignKey, String, Integer, DateTime, Text, Boolean, Float
from sqlalchemy.orm import relationship

from app.db.base import Base


class Outfit(Base):
    """穿搭模型"""
    __tablename__ = "outfits"

    id = Column(Integer, primary_key=True, index=True)  # 穿搭ID，主键
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))  # 所属用户ID，外键
    name = Column(String(100))  # 穿搭名称
    description = Column(Text, nullable=True)  # 穿搭描述
    
    # 基本信息
    season = Column(String(50), nullable=True)  # 适用季节
    occasion = Column(String(100), nullable=True)  # 适用场合：工作、休闲、正式等
    style = Column(String(100), nullable=True)  # 风格：简约、休闲、复古等
    
    # 图片
    image_url = Column(String(255), nullable=True)  # 穿搭图片URL
    
    # 状态
    is_favorite = Column(Boolean, default=False)  # 是否收藏
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间
    
    # 关系
    user = relationship("User", back_populates="outfits")  # 所属用户
    outfit_clothes = relationship("OutfitClothes", back_populates="outfit", cascade="all, delete-orphan")  # 关联的服装


class OutfitClothes(Base):
    """穿搭-服装关联模型"""
    __tablename__ = "outfit_clothes"

    id = Column(Integer, primary_key=True, index=True)  # 关联ID，主键
    outfit_id = Column(Integer, ForeignKey("outfits.id", ondelete="CASCADE"))  # 穿搭ID，外键
    clothes_id = Column(Integer, ForeignKey("clothes.id", ondelete="CASCADE"))  # 服装ID，外键
    
    # 位置信息
    position = Column(String(50), nullable=True)  # 在穿搭中的位置：上装、下装等
    order = Column(Integer, default=0)  # 显示顺序
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间
    
    # 关系
    outfit = relationship("Outfit", back_populates="outfit_clothes")  # 所属穿搭
    clothes = relationship("Clothes", back_populates="outfit_clothes")  # 关联的服装 