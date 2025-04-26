from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, ForeignKey, String, Integer, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import relationship

from app.db.base import Base


class Tag(Base):
    """标签模型
    
    用于管理系统中所有的标签数据，支持对服装进行分类、描述和检索。
    标签可以是系统预设的，也可以是用户自定义创建的，便于个性化管理。
    标签体系分为不同类别，如风格、场合、材质等，方便多维度归类。
    通过与ClothesTag关联，实现标签与服装的多对多关系。
    """
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)  # 标签ID，主键，系统自动生成
    name = Column(String(50), unique=True, index=True)  # 标签名称，唯一值，用于标识和检索
    category = Column(String(50), index=True, nullable=True)  # 标签类别，如"风格"、"场合"、"材质"、"颜色"等
    
    # 标签属性
    is_system = Column(Boolean, default=False)  # 是否为系统标签，区分系统预设和用户自定义的标签
    description = Column(Text, nullable=True)  # 标签描述，解释标签的含义和适用场景
    display_order = Column(Integer, default=0)  # 显示顺序，控制在界面上的排序位置
    
    # 关联关系
    clothes_tags = relationship("ClothesTag", back_populates="tag", cascade="all, delete-orphan")  # 关联的服装标签映射，一对多关系
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间，记录标签添加时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间，自动更新


class ClothesTag(Base):
    """服装标签关联模型
    
    作为服装与标签之间的中间表，建立多对多关联关系。
    支持记录标签是由用户手动添加还是由AI智能识别生成的。
    每件服装可以关联多个不同类别的标签，实现多维度描述。
    便于基于标签进行服装的快速筛选、检索和推荐。
    """
    __tablename__ = "clothes_tags"

    id = Column(Integer, primary_key=True, index=True)  # 关联ID，主键，系统自动生成
    clothes_id = Column(Integer, ForeignKey("clothes.id"), index=True)  # 服装ID，外键关联clothes表
    tag_id = Column(Integer, ForeignKey("tags.id"), index=True)  # 标签ID，外键关联tags表
    
    # 标签来源
    is_ai_generated = Column(Boolean, default=False)  # 是否由AI生成，区分用户手动添加和AI自动识别
    confidence = Column(Float, nullable=True)  # AI识别置信度，仅对AI生成的标签有效
    
    # 关联关系
    clothes = relationship("Clothes", back_populates="clothes_tags")  # 关联的服装对象，双向关联
    tag = relationship("Tag", back_populates="clothes_tags")  # 关联的标签对象，双向关联
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间，记录关联创建时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间，自动更新 