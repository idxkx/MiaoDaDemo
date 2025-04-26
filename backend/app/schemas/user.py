from typing import Dict, Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class UserBase(BaseModel):
    """用户基础信息模型"""
    username: str
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None
    gender: Optional[int] = None
    phone: Optional[str] = None


class UserCreate(UserBase):
    """用户创建模型"""
    password: str
    

class UserUpdate(BaseModel):
    """用户更新模型"""
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None
    gender: Optional[int] = None
    phone: Optional[str] = None
    style_preference: Optional[Dict] = None
    color_preference: Optional[Dict] = None
    season_preference: Optional[Dict] = None


class UserInDBBase(UserBase):
    """数据库中的用户模型基类"""
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class User(UserInDBBase):
    """API响应中的用户模型"""
    pass


class UserInDB(UserInDBBase):
    """数据库中完整的用户模型（仅内部使用）"""
    hashed_password: str


class LoginRequest(BaseModel):
    """基本登录请求"""
    username: str = Field(..., description="用户名")
    password: str = Field(..., description="密码")


class Token(BaseModel):
    """令牌响应模型"""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """令牌负载模型"""
    sub: Optional[str] = None
    exp: Optional[int] = None 