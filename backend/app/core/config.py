import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, PostgresDsn, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 访问令牌有效期（分钟）
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 天
    # BACKEND_CORS_ORIGINS是一个JSON格式的字符串列表，例如：'["http://localhost", "http://localhost:4200"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

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
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return "sqlite:///./app.db"
    
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
    
    # 腾讯云COS配置（如果使用）
    COS_SECRET_ID: Optional[str] = None
    COS_SECRET_KEY: Optional[str] = None
    COS_REGION: Optional[str] = None
    COS_BUCKET: Optional[str] = None
    
    # 缓存配置
    CACHE_TYPE: str = "memory"  # memory 或 redis
    REDIS_URL: Optional[str] = None
    
    # 日志配置
    LOG_LEVEL: str = "INFO"

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings() 