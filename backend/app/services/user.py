from typing import Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import create_access_token, verify_password, get_password_hash


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """根据ID获取用户"""
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """根据用户名获取用户"""
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    """创建新用户"""
    hashed_password = get_password_hash(user_in.password)
    
    db_user = User(
        username=user_in.username,
        hashed_password=hashed_password,
        nickname=user_in.nickname,
        avatar_url=user_in.avatar_url,
        gender=user_in.gender,
        phone=user_in.phone,
        is_active=True,
        is_admin=False,
        style_preference={},
        color_preference={},
        season_preference={},
        login_count=1
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, db_user: User, user_in: UserUpdate) -> User:
    """更新用户信息"""
    # 将用户输入数据转为字典，排除None值
    update_data = user_in.dict(exclude_unset=True)
    
    # 遍历更新数据并更新用户对象
    for field, value in update_data.items():
        if value is not None:  # 只更新非None值
            setattr(db_user, field, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    """删除用户"""
    user = get_user_by_id(db, user_id)
    if not user:
        return False
    
    db.delete(user)
    db.commit()
    return True


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """
    验证用户身份
    
    参数:
        db: 数据库会话
        username: 用户名
        password: 密码
        
    返回:
        验证成功返回用户对象，失败返回None
    """
    user = get_user_by_username(db, username)
    if not user:
        return None
    
    # 验证密码
    if not verify_password(password, user.hashed_password):
        return None
    
    # 更新登录次数和时间
    user.login_count += 1
    user.last_login_at = datetime.utcnow()
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user


def login(db: Session, username: str, password: str) -> Tuple[Optional[User], Optional[str]]:
    """
    用户登录
    
    参数:
        db: 数据库会话
        username: 用户名
        password: 密码
        
    返回:
        (用户对象, JWT令牌) 或 (None, None)
    """
    # 验证用户
    user = authenticate_user(db, username, password)
    if not user:
        return None, None
    
    # 生成令牌
    token = create_access_token(subject=str(user.id))
    
    return user, token 