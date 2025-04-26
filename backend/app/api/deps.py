from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.models.user import User
from app.core.config import settings
from app.schemas.user import TokenPayload

# 令牌获取器，指定oauth2 token URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    验证当前用户身份
    
    从请求中获取JWT令牌，验证并提取用户信息
    """
    try:
        # 解码JWT令牌
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="认证信息无效",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 从令牌中获取用户ID
    user_id = token_data.sub
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无法验证用户身份",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 查询用户信息
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在或已删除",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

def get_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    验证当前用户是否激活
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="用户已被停用",
        )
    return current_user

def get_admin_user(
    current_user: User = Depends(get_active_user),
) -> User:
    """
    验证当前用户是否为管理员
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要管理员权限",
        )
    return current_user 