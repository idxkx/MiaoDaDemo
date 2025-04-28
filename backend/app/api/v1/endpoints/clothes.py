# backend/app/api/v1/endpoints/clothes.py
import io
import os
import uuid
from typing import List, Optional
import shutil
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Request, status, Form
from sqlalchemy.orm import Session
from PIL import Image # Pillow for potential post-processing
from rembg import remove # The star of the show!

from app import models # models 可以保持这样导入
from app.crud import clothes as crud_clothes # 直接导入 crud 对象
from app.crud import clothes_image as crud_clothes_image # 直接导入 crud 对象
from app.schemas.clothes import Clothes, ClothesCreate, ClothesImage, ClothesImageCreate, ClothesResponse, ClothesUpdate # 直接导入需要的 Schema 类
from app.api import deps
from app.core.config import settings # Import settings to get storage path
from app.models.user import User

router = APIRouter()

# Define the path for processed images based on settings
#确保 IMAGE_STORAGE_PATH 在 .env 和 config.py 中定义
PROCESSED_IMAGE_STORAGE_PATH = settings.IMAGE_STORAGE_PATH 
os.makedirs(PROCESSED_IMAGE_STORAGE_PATH, exist_ok=True) # Ensure directory exists

# --- Clothes CRUD Endpoints ---
# (We can add CRUD endpoints for Clothes itself later here)

@router.post("/", response_model=ClothesResponse, status_code=status.HTTP_201_CREATED)
def create_clothes(
    clothes_in: ClothesCreate, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """创建新服装"""
    
    # 创建服装实例
    clothes = Clothes(
        user_id=current_user.id,
        **clothes_in.dict(exclude_unset=True)
    )
    
    db.add(clothes)
    db.commit()
    db.refresh(clothes)
    
    return clothes

@router.get("/", response_model=List[ClothesResponse])
def read_clothes(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """获取当前用户的所有服装"""
    clothes = db.query(Clothes).filter(
        Clothes.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return clothes

@router.get("/{clothes_id}", response_model=ClothesResponse)
def read_clothes_by_id(
    clothes_id: int, 
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """根据ID获取服装"""
    clothes = db.query(Clothes).filter(
        Clothes.id == clothes_id,
        Clothes.user_id == current_user.id
    ).first()
    
    if not clothes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="找不到指定服装或无权限"
        )
    
    return clothes

@router.put("/{clothes_id}", response_model=ClothesResponse)
def update_clothes(
    clothes_id: int,
    clothes_in: ClothesUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """更新服装信息"""
    clothes = db.query(Clothes).filter(
        Clothes.id == clothes_id,
        Clothes.user_id == current_user.id
    ).first()
    
    if not clothes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="找不到指定服装或无权限"
        )
    
    # 更新服装
    update_data = clothes_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(clothes, field, value)
    
    db.commit()
    db.refresh(clothes)
    
    return clothes

@router.delete("/{clothes_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_clothes(
    clothes_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """删除服装"""
    clothes = db.query(Clothes).filter(
        Clothes.id == clothes_id,
        Clothes.user_id == current_user.id
    ).first()
    
    if not clothes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="找不到指定服装或无权限"
        )
    
    db.delete(clothes)
    db.commit()
    
    return None

# --- Clothes Image Upload Endpoint ---

@router.post("/upload-image/", status_code=status.HTTP_201_CREATED)
async def upload_clothes_image(
    file: UploadFile = File(...),
    clothes_id: Optional[int] = Form(None),
    is_primary: bool = Form(False),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    上传服装图片
    
    1. 通过multipart/form-data上传图片文件
    2. 可选关联到已有服装(clothes_id)或后续关联
    3. 支持设置是否为主图(is_primary)
    4. 自动创建目录并生成唯一文件名
    """
    try:
        # 1. 验证图片格式
        allowed_types = ["image/jpeg", "image/png", "image/jpg"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="只支持JPG和PNG格式图片"
            )
        
        # 2. 验证clothes_id(如果提供了)
        if clothes_id:
            clothes = db.query(Clothes).filter(
                Clothes.id == clothes_id,
                Clothes.user_id == current_user.id
            ).first()
            
            if not clothes:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="找不到指定服装或无权限"
                )
        
        # 3. 创建存储路径和文件名
        today = datetime.now().strftime("%Y%m%d")
        user_dir = f"user_{current_user.id}"
        save_dir = os.path.join(settings.IMAGE_STORAGE_PATH, "processed", user_dir, today)
        
        # 确保目录存在
        os.makedirs(save_dir, exist_ok=True)
        
        # 生成唯一文件名
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(save_dir, unique_filename)
        relative_path = os.path.join("processed", user_dir, today, unique_filename)
        
        # 4. 保存文件
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"保存文件失败: {str(e)}"
            )
        
        # 构建完整的URL路径，使用settings中的BASE_URL
        base_url = settings.API_V1_STR
        full_image_url = f"{base_url}/storage/images/{relative_path}"
        
        # 5. 如果提供了clothes_id，创建图片记录
        if clothes_id:
            # 如果设置为主图，先将其他图片设为非主图
            if is_primary:
                db.query(ClothesImage).filter(
                    ClothesImage.clothes_id == clothes_id,
                    ClothesImage.is_primary == True
                ).update({"is_primary": False})
            
            # 创建新图片记录
            clothes_image = ClothesImage(
                clothes_id=clothes_id,
                image_url=relative_path,
                is_primary=is_primary
            )
            db.add(clothes_image)
            db.commit()
            db.refresh(clothes_image)
            
            return {
                "id": clothes_image.id,
                "clothes_id": clothes_id,
                "image_url": full_image_url,
                "is_primary": is_primary,
                "filename": file.filename,
                "file_size": file.size
            }
        
        # 6. 如果没有clothes_id，仅返回保存的路径信息
        return {
            "image_url": full_image_url,
            "filename": file.filename,
            "file_size": file.size,
            "message": "图片上传成功，使用返回的URL创建服装"
        }
    except HTTPException:
        # 直接重新抛出HTTP异常
        raise
    except Exception as e:
        # 处理其他未预期的异常
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"上传图片时发生错误: {str(e)}"
        )

# --- Add other image related endpoints like get_images, delete_image etc. later --- 