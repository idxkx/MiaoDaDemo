from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.user import LoginRequest, Token, User, UserCreate
from app.services.user import login, create_user, get_user_by_username

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    基础登录接口
    
    使用用户名密码获取访问令牌
    """
    user, token = login(db, login_data.username, login_data.password)
    
    if not user or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/register", response_model=User)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    用户注册接口
    
    创建新用户账号
    """
    # 检查用户名是否已存在
    db_user = get_user_by_username(db, user_data.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已被使用"
        )
    
    # 创建新用户
    user = create_user(db, user_data)
    return user


@router.post("/test-users", response_model=User, tags=["testing"])
def create_test_user(
    db: Session = Depends(get_db)
):
    """
    创建测试用户接口
    
    仅在开发环境可用，快速创建测试账号
    """
    # 检查用户是否已存在
    username = "testuser"
    db_user = get_user_by_username(db, username)
    
    if db_user:
        return db_user
    
    # 创建测试用户
    user_data = UserCreate(
        username=username,
        password="testpassword",
        nickname="测试用户",
        avatar_url="https://example.com/avatar.png",
        gender=0
    )
    
    return create_user(db, user_data) 