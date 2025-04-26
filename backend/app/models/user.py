from datetime import datetime
from typing import Dict, List, Optional

from sqlalchemy import Column, String, Integer, Boolean, DateTime, JSON
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import relationship

from app.db.base import Base


class User(Base):
    """用户模型
    
    存储系统用户的基本信息和账号数据，支持微信小程序登录认证。
    记录用户的个人资料、权限设置和偏好信息，与服装和搭配建立关联。
    提供用户风格偏好和使用习惯分析，支持个性化推荐功能。
    作为系统的核心用户实体，管理用户的身份和权限。
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)  # 用户ID，主键，系统自动生成
    openid = Column(String(100), unique=True, index=True)  # 微信小程序用户唯一标识，用于微信登录验证
    
    # 用户资料
    nickname = Column(String(50), index=True)  # 用户昵称，显示名称
    avatar_url = Column(String(255), nullable=True)  # 用户头像URL，存储头像图片地址
    gender = Column(Integer, nullable=True)  # 性别：0-未知，1-男，2-女
    phone = Column(String(20), nullable=True)  # 手机号码，可选，用于通知和找回账号
    
    # 账号状态
    is_active = Column(Boolean, default=True)  # 是否激活，控制用户账号是否可用
    is_admin = Column(Boolean, default=False)  # 是否管理员，具有特殊权限的用户
    
    # 用户偏好，存储为JSON格式以支持灵活的数据结构
    style_preference = Column(MutableDict.as_mutable(JSON), default=dict)  # 风格偏好，记录用户喜好的服装风格
    color_preference = Column(MutableDict.as_mutable(JSON), default=dict)  # 颜色偏好，记录用户喜好的颜色搭配
    season_preference = Column(MutableDict.as_mutable(JSON), default=dict)  # 季节偏好，记录用户更关注的季节穿搭
    
    # 使用统计
    last_login_at = Column(DateTime, nullable=True)  # 上次登录时间，记录用户活跃情况
    login_count = Column(Integer, default=0)  # 登录次数，记录用户活跃度
    
    # 关联关系
    clothes = relationship("Clothes", back_populates="user", cascade="all, delete-orphan")  # 用户的服装列表，一对多关系
    outfits = relationship("Outfit", back_populates="user", cascade="all, delete-orphan")  # 用户的搭配列表，一对多关系
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)  # 创建时间，记录用户注册时间
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 更新时间，自动更新 