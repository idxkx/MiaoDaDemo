from datetime import datetime
from typing import Optional, List

from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean
from sqlalchemy.orm import relationship

from app.db.base import Base


class User(Base):
    """用户模型"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)  # 用户ID，主键
    username = Column(String(50), unique=True, index=True)  # 用户名，唯一
    email = Column(String(100), unique=True, index=True)  # 电子邮箱，唯一
    hashed_password = Column(String(100))  # 加密后的密码
    
    # 个人信息
    full_name = Column(String(100), nullable=True)  # 全名
    bio = Column(Text, nullable=True)  # 个人简介
    avatar_url = Column(String(255), nullable=True)  # 头像URL
    
    # 账户状态
    is_active = Column(Boolean, default=True)  # 是否激活
    is_superuser = Column(Boolean, default=False)  # 是否为超级用户
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间
    
    # 关系
    clothes = relationship("Clothes", back_populates="user", cascade="all, delete-orphan")  # 用户拥有的服装
    outfits = relationship("Outfit", back_populates="user", cascade="all, delete-orphan")  # 用户创建的穿搭 