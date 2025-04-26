from datetime import datetime
from typing import List, Optional, Dict, Any

from sqlalchemy import Column, ForeignKey, String, Integer, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import relationship

from app.db.base import Base


class Outfit(Base):
    """搭配模型
    
    用于存储用户创建的完整穿搭搭配方案，管理服装组合和穿搭场景。
    支持记录搭配名称、风格、场合等关键信息，可包含多个服装单品。
    提供AI搭配建议功能，帮助用户创建时尚合理的穿搭组合。
    跟踪搭配的使用情况，便于用户管理和复用自己喜爱的穿搭方案。
    """
    __tablename__ = "outfits"

    id = Column(Integer, primary_key=True, index=True)  # 搭配ID，主键，系统自动生成
    user_id = Column(Integer, ForeignKey("users.id"), index=True)  # 用户ID，外键关联users表，指明搭配所有者
    
    # 基本信息
    name = Column(String(100), index=True)  # 搭配名称，用户自定义或系统推荐的搭配描述名称
    description = Column(Text, nullable=True)  # 搭配描述，详细说明搭配特点、灵感来源等
    
    # 场景与风格
    occasion = Column(String(50), index=True, nullable=True)  # 适用场合，如"正式"、"休闲"、"运动"、"派对"等
    style = Column(String(50), index=True, nullable=True)  # 搭配风格，如"简约"、"复古"、"街头"、"优雅"等
    season = Column(String(50), index=True, nullable=True)  # 适用季节，如"春"、"夏"、"秋"、"冬"或组合
    weather = Column(String(50), index=True, nullable=True)  # 适用天气，如"晴天"、"雨天"、"多云"等
    
    # AI功能相关
    ai_suggestions = Column(MutableDict.as_mutable(JSON), default=dict)  # AI提供的搭配优化建议，如颜色协调、风格统一等
    is_ai_generated = Column(Boolean, default=False)  # 是否由AI生成，区分用户手动创建和AI自动生成
    ai_score = Column(Float, nullable=True)  # AI评分，对搭配协调度、时尚度的综合评估
    
    # 状态信息
    is_favorite = Column(Boolean, default=False)  # 是否收藏，用户标记的喜爱搭配
    wear_count = Column(Integer, default=0)  # 穿着次数，记录搭配使用频率
    last_worn_date = Column(DateTime, nullable=True)  # 最近穿着日期，记录上次使用时间
    
    # 关联关系
    user = relationship("User", back_populates="outfits")  # 所属用户，双向关联
    outfit_items = relationship("OutfitItem", back_populates="outfit", cascade="all, delete-orphan")  # 搭配项，一对多关系
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间，记录搭配添加时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间，自动更新


class OutfitItem(Base):
    """搭配项模型
    
    记录搭配中的单件服装信息，建立搭配与服装的关联关系。
    支持定义服装在搭配中的位置和排序，便于前端展示完整穿搭效果。
    允许添加特定的穿搭注释，提供个性化的搭配建议和穿着提示。
    作为搭配和服装的中间表，支持灵活的搭配组合管理。
    """
    __tablename__ = "outfit_items"

    id = Column(Integer, primary_key=True, index=True)  # 搭配项ID，主键，系统自动生成
    outfit_id = Column(Integer, ForeignKey("outfits.id"), index=True)  # 搭配ID，外键关联outfits表
    clothes_id = Column(Integer, ForeignKey("clothes.id"), index=True)  # 服装ID，外键关联clothes表
    
    # 排序与位置
    position = Column(Integer, default=0)  # 位置排序，定义服装在搭配中的展示顺序和位置
    layer = Column(Integer, default=0, nullable=True)  # 图层顺序，用于前端渲染叠穿效果时的层级关系
    
    # 备注与建议
    notes = Column(Text, nullable=True)  # 穿搭备注，可记录特殊穿着方式、搭配技巧等个性化信息
    styling_tips = Column(Text, nullable=True)  # 搭配技巧，提供如何最佳穿着该服装的建议
    
    # 关联关系
    outfit = relationship("Outfit", back_populates="outfit_items")  # 所属搭配，双向关联
    clothes = relationship("Clothes", back_populates="outfit_items")  # 关联服装，双向关联
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间，记录搭配项添加时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间，自动更新 