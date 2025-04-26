import os
import io
from typing import Dict, List, Optional, Any
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from PIL import Image

from app import models
from app.api import deps
from app.services.model_service import get_model
from app.core.config import settings
from app.models.user import User

router = APIRouter()

@router.post("/analyze-image", status_code=status.HTTP_200_OK)
async def analyze_image(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    分析上传的服装图片，返回分类和特征
    
    1. 接收图片文件
    2. 进行服装识别和特征提取
    3. 返回分析结果
    """
    # 1. 验证图片格式
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="只支持JPG和PNG格式图片"
        )
    
    try:
        # 2. 读取图片
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # 3. 调用模型进行预测
        model = get_model()
        prediction_result = model.predict(image)
        
        # 4. 提取特征向量
        features = model.extract_features(image)
        
        # 5. 生成标签
        tags = model.generate_tags(image)
        
        # 6. 组合返回结果
        result = {
            "file_name": file.filename,
            "prediction": prediction_result,
            "features": features[:20] if len(features) > 20 else features,  # 限制特征向量长度
            "generated_tags": tags
        }
        
        return result
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"图片分析失败: {str(e)}"
        )

@router.post("/analyze-existing", status_code=status.HTTP_200_OK)
async def analyze_existing_image(
    image_path: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    分析已存在的服装图片，返回分类和特征
    
    接收已上传图片的路径
    """
    # 检查路径是否存在且合法
    full_path = Path(settings.IMAGE_STORAGE_PATH) / image_path
    if not full_path.exists() or not full_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="图片不存在"
        )
    
    try:
        # 调用模型进行预测
        model = get_model()
        prediction_result = model.predict(str(full_path))
        
        # 提取特征向量
        features = model.extract_features(str(full_path))
        
        # 生成标签
        tags = model.generate_tags(str(full_path))
        
        # 组合返回结果
        result = {
            "image_path": image_path,
            "prediction": prediction_result,
            "features": features[:20] if len(features) > 20 else features,  # 限制特征向量长度
            "generated_tags": tags
        }
        
        return result
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"图片分析失败: {str(e)}"
        )

@router.post("/generate-tags", status_code=status.HTTP_200_OK)
async def generate_tags(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    为上传的服装图片生成标签
    """
    # 验证图片格式
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="只支持JPG和PNG格式图片"
        )
    
    try:
        # 读取图片
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # 生成标签
        model = get_model()
        tags = model.generate_tags(image)
        
        return {"tags": tags}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"标签生成失败: {str(e)}"
        )

@router.get("/model-info", status_code=status.HTTP_200_OK)
async def get_model_info(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    获取当前加载的模型信息
    """
    model = get_model()
    
    return {
        "model_name": model.model_name,
        "device": str(model.device),
        "num_classes": len(model.class_names),
        "class_names": model.class_names,
        "feature_names": model.feature_names
    } 