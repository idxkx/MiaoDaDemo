import secrets
import os
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API配置
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 访问令牌有效期（分钟）
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 天
    # BACKEND_CORS_ORIGINS是一个JSON格式的字符串列表，例如：'["http://localhost", "http://localhost:4200"]'
    BACKEND_CORS_ORIGINS: List[Union[AnyHttpUrl, str]] = []
    
    # 应用配置
    ENVIRONMENT: str = "development"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    # 数据库配置
    DATABASE_URL: str = "sqlite:///./app.db"
    ALGORITHM: str = "HS256"
    FRONTEND_API_BASE_URL: str = "http://127.0.0.1:8000"
    MODEL_BASE_PATH: str = "./models/"

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # 数据库配置
    # 使用 str 类型以允许 SQLite 或其他数据库 URI
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    
    # 如果没有设置数据库连接，默认使用SQLite
    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    def assemble_db_connection(cls, v: Optional[str]) -> Any:
        if isinstance(v, str):
            return v
        # 使用环境变量或默认值
        return os.environ.get("DATABASE_URL", "sqlite:///./app.db")
    
    # AI模型配置
    ACTIVE_CLOTHING_MODEL: str = "MD_resnet50_40_32_10e4_clothes_model"
    MODELS_DIR: str = "../../models"
    
    # DeepSeek API配置
    DEEPSEEK_API_KEY: Optional[str] = None
    
    # Stable Diffusion API配置
    STABLE_DIFFUSION_API_URL: Optional[str] = None
    
    # 存储配置
    STORAGE_TYPE: str = "local"  # local 或 cloud
    LOCAL_STORAGE_PATH: str = "./storage"
    IMAGE_STORAGE_PATH: str = "./storage/images/processed/"
    
    # 缓存配置
    CACHE_TYPE: str = "memory"  # memory 或 redis
    REDIS_URL: Optional[str] = None

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"  # 允许额外字段


settings = Settings() 