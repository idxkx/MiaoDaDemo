from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, ForeignKey, String, Integer, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.mutable import MutableDict, MutableList
from sqlalchemy.dialects.postgresql import ARRAY

from app.db.base import Base


class ClothesType(str, Enum):
    """服装类型枚举"""
    TOP = "top"  # 上衣
    BOTTOM = "bottom"  # 裤子/裙子
    DRESS = "dress"  # 连衣裙
    OUTERWEAR = "outerwear"  # 外套
    SHOES = "shoes"  # 鞋子
    ACCESSORY = "accessory"  # 配饰


class Clothes(Base):
    """服装模型
    
    用于存储用户服装库中的单件服装信息，包含基本信息、分类、特征和使用情况。
    支持多种服装类别管理，与标签、搭配项和图片建立关联关系。
    提供AI特征提取和识别功能，帮助用户自动管理和整理服装库。
    作为系统核心数据模型，为搭配推荐、穿搭规划和服装管理提供基础数据支持。
    """
    __tablename__ = "clothes"

    id = Column(Integer, primary_key=True, index=True)  # 服装ID，主键，系统自动生成
    user_id = Column(Integer, ForeignKey("users.id"), index=True)  # 用户ID，外键关联users表，指明服装所有者
    
    # 基本信息
    name = Column(String(100), index=True)  # 服装名称，用户自定义或AI生成的服装描述名称
    description = Column(Text, nullable=True)  # 服装描述，详细说明服装特点、用途等
    
    # 分类信息
    category = Column(String(50), index=True)  # 主分类，如"上衣"、"裤子"、"鞋子"等主要分类
    sub_category = Column(String(50), index=True, nullable=True)  # 子分类，如"T恤"、"衬衫"、"牛仔裤"等细分类别
    
    # 特征描述
    color = Column(String(50), index=True, nullable=True)  # 主要颜色，如"红色"、"蓝色"等
    pattern = Column(String(50), index=True, nullable=True)  # 图案类型，如"纯色"、"条纹"、"格子"等
    material = Column(String(50), index=True, nullable=True)  # 材质，如"棉"、"麻"、"丝"等
    season = Column(String(50), index=True, nullable=True)  # 适用季节，如"春"、"夏"、"秋"、"冬"或组合
    occasion = Column(String(50), index=True, nullable=True)  # 适用场合，如"正式"、"休闲"、"运动"等
    
    # 品牌信息
    brand = Column(String(100), index=True, nullable=True)  # 品牌名称，如"Nike"、"Adidas"等
    
    # AI特征和识别
    ai_features = Column(MutableList.as_mutable(JSON), nullable=True)  # AI提取的特征向量，用于相似服装匹配和推荐
    ai_tags = Column(JSON, nullable=True)  # AI识别的标签集合，用于自动分类和特征标记
    ai_category_confidence = Column(Float, nullable=True)  # AI分类置信度，表示AI对分类结果的确信程度
    is_ai_categorized = Column(Boolean, default=False)  # 是否由AI分类，区分人工分类和AI自动分类
    
    # 状态信息
    is_active = Column(Boolean, default=True)  # 是否激活，用于软删除功能，不活跃表示用户已"删除"但数据库保留
    is_favorite = Column(Boolean, default=False)  # 是否收藏，用户标记的喜爱服装
    wear_count = Column(Integer, default=0)  # 穿着次数，记录服装使用频率
    
    # 关联关系
    user = relationship("User", back_populates="clothes")  # 所属用户，双向关联
    images = relationship("ClothesImage", back_populates="clothes", cascade="all, delete-orphan")  # 服装图片，一对多关系
    clothes_tags = relationship("ClothesTag", back_populates="clothes", cascade="all, delete-orphan")  # 服装标签关联，多对多关系
    outfit_items = relationship("OutfitItem", back_populates="clothes")  # 所属搭配项，一对多关系
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间，记录服装添加时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间，自动更新


class ClothesImage(Base):
    """服装图片模型
    
    存储服装的图片信息，支持一件服装关联多张图片，包括主图和细节图。
    提供图片URL管理和主图标记功能，支持图片预览和展示服务。
    作为服装可视化的核心组件，为用户提供直观的服装视觉管理体验。
    """
    __tablename__ = "clothes_images"

    id = Column(Integer, primary_key=True, index=True)  # 图片ID，主键，系统自动生成
    clothes_id = Column(Integer, ForeignKey("clothes.id"), index=True)  # 服装ID，外键关联clothes表
    
    # 图片信息
    image_url = Column(String(255))  # 图片URL，指向存储服务(如AWS S3、七牛云等)中的图片资源
    is_primary = Column(Boolean, default=False)  # 是否为主图，一件服装只能有一张主图，用于列表展示
    
    # 关联关系
    clothes = relationship("Clothes", back_populates="images")  # 所属服装，双向关联
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间，记录图片添加时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间，自动更新 