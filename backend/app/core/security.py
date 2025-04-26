from datetime import datetime, timedelta
from typing import Any, Union

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

# 密码哈希上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 验证密码
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证明文密码与哈希密码是否匹配"""
    return pwd_context.verify(plain_password, hashed_password)

# 生成密码哈希
def get_password_hash(password: str) -> str:
    """对密码进行哈希处理"""
    return pwd_context.hash(password)

# 创建访问令牌
def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    """
    生成JWT访问令牌
    
    参数:
        subject: 令牌主体，通常是用户ID
        expires_delta: 令牌有效期
        
    返回:
        编码后的JWT令牌字符串
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# 创建微信小程序登录令牌
def create_wechat_token(openid: str) -> str:
    """
    为微信小程序用户创建访问令牌
    
    参数:
        openid: 微信用户的唯一标识
        
    返回:
        JWT令牌
    """
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_access_token(subject=openid, expires_delta=expires_delta) 