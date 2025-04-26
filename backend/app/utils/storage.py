import os
import shutil
from typing import Optional, List, BinaryIO
from pathlib import Path
import uuid
from datetime import datetime
import logging
from fastapi import UploadFile

from app.core.config import settings

# 配置日志
logger = logging.getLogger(__name__)

# 确保存储目录存在
def ensure_dir_exists(dir_path: str) -> None:
    """确保目录存在，如不存在则创建"""
    Path(dir_path).mkdir(parents=True, exist_ok=True)

# 生成唯一文件名
def generate_unique_filename(original_filename: str) -> str:
    """
    生成唯一的文件名
    
    参数:
        original_filename: 原始文件名
    
    返回:
        唯一文件名，格式为：{uuid}_{timestamp}_{original_filename}
    """
    # 获取文件扩展名
    if '.' in original_filename:
        ext = original_filename.rsplit('.', 1)[1].lower()
    else:
        ext = ''
    
    # 生成唯一文件名
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    
    if ext:
        return f"{unique_id}_{timestamp}.{ext}"
    else:
        return f"{unique_id}_{timestamp}"

# 本地存储实现
def save_file_local(
    upload_file: UploadFile,
    subdir: str = ""
) -> Optional[str]:
    """
    将上传文件保存到本地存储
    
    参数:
        upload_file: FastAPI上传文件
        subdir: 子目录，例如'images'或'documents'
        
    返回:
        成功返回相对路径，失败返回None
    """
    try:
        # 确定存储目录
        storage_dir = settings.LOCAL_STORAGE_PATH
        if subdir:
            storage_dir = os.path.join(storage_dir, subdir)
        
        # 创建目录（如果不存在）
        ensure_dir_exists(storage_dir)
        
        # 生成唯一文件名
        unique_filename = generate_unique_filename(upload_file.filename)
        file_path = os.path.join(storage_dir, unique_filename)
        
        # 保存文件
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        # 返回相对路径
        if subdir:
            return f"{subdir}/{unique_filename}"
        else:
            return unique_filename
            
    except Exception as e:
        logger.exception(f"保存文件失败: {str(e)}")
        return None
    finally:
        # 确保关闭文件
        upload_file.file.close()

# 删除本地文件
def delete_file_local(file_path: str) -> bool:
    """
    删除本地存储的文件
    
    参数:
        file_path: 文件相对路径
        
    返回:
        删除成功返回True，否则返回False
    """
    try:
        # 构建完整路径
        full_path = os.path.join(settings.LOCAL_STORAGE_PATH, file_path)
        
        # 检查文件是否存在
        if not os.path.exists(full_path):
            logger.warning(f"要删除的文件不存在: {full_path}")
            return False
        
        # 删除文件
        os.remove(full_path)
        logger.info(f"成功删除文件: {full_path}")
        return True
    except Exception as e:
        logger.exception(f"删除文件失败: {str(e)}")
        return False

# 获取文件URL
def get_file_url(file_path: str) -> str:
    """
    获取文件的访问URL
    
    参数:
        file_path: 文件相对路径
        
    返回:
        文件的完整URL
    """
    # 本地开发环境
    if settings.ENVIRONMENT == "development":
        host = f"http://{settings.APP_HOST}:{settings.APP_PORT}"
        return f"{host}/storage/{file_path}"
    
    # 生产环境（如果有配置）
    if hasattr(settings, "STORAGE_BASE_URL") and settings.STORAGE_BASE_URL:
        return f"{settings.STORAGE_BASE_URL}/{file_path}"
    
    # 默认
    return f"/storage/{file_path}" 