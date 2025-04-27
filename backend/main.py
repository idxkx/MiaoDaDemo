from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api.v1.api import api_router
import uvicorn
from pathlib import Path

app = FastAPI(
    title="智能穿搭助手API",
    description="智能穿搭助手微信小程序的后端API服务",
    version="0.1.0",
)

# 配置CORS - 确保OPTIONS预检请求能够正确处理
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 开发环境下允许所有来源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*"],  # 允许所有headers
    expose_headers=["*"],
    max_age=86400,  # 预检请求结果缓存时间（秒）
)

# 确保存储目录存在
Path(settings.LOCAL_STORAGE_PATH).mkdir(parents=True, exist_ok=True)

# 挂载存储目录作为静态文件
app.mount("/storage", StaticFiles(directory=settings.LOCAL_STORAGE_PATH), name="storage")

# 包含API路由
app.include_router(api_router, prefix=settings.API_V1_STR)

# 健康检查路由
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "服务正常运行"}

# 测试认证路由
@app.get("/test-auth")
async def test_auth():
    return {
        "status": "ok", 
        "message": "认证测试API可访问", 
        "cors_origins": settings.BACKEND_CORS_ORIGINS,
        "api_prefix": settings.API_V1_STR,
        "auth_endpoints": [
            f"{settings.API_V1_STR}/auth/login",
            f"{settings.API_V1_STR}/auth/register"
        ]
    }

# 直接运行时的入口
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 