from fastapi import APIRouter

from app.api.v1 import users, clothes, outfits, tags, models

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(clothes.router, prefix="/clothes", tags=["clothes"])
api_router.include_router(outfits.router, prefix="/outfits", tags=["outfits"])
api_router.include_router(tags.router, prefix="/tags", tags=["tags"])
api_router.include_router(models.router, prefix="/models", tags=["models"]) 