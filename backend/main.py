from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
import uvicorn

app = FastAPI(
    title="智能穿搭助手API",
    description="智能穿搭助手微信小程序的后端API服务",
    version="0.1.0",
)

# 配置CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# 包含API路由
app.include_router(api_router, prefix=settings.API_V1_STR)

# 健康检查路由
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "服务正常运行"}

# 直接运行时的入口
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 