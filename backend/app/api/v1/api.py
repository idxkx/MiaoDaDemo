from fastapi import APIRouter

# 移除 outfits, tags, models 的导入，因为它们目前不存在或未实现
from app.api.v1.endpoints import users, clothes, auth, recognition #, tags, models 

api_router = APIRouter()

# 添加认证路由
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(clothes.router, prefix="/clothes", tags=["clothes"])
api_router.include_router(recognition.router, prefix="/recognition", tags=["服装识别"])
# 移除 outfits.router 注册
# api_router.include_router(outfits.router, prefix="/outfits", tags=["outfits"])
# 移除 tags.router 注册 (假设 tags.py 也不存在或未完成)
# api_router.include_router(tags.router, prefix="/tags", tags=["tags"])
# 移除 models.router 注册 (假设 models.py 也不存在或未完成)
# api_router.include_router(models.router, prefix="/models", tags=["models"]) 