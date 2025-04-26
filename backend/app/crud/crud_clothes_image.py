from typing import List

from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.crud.base import CRUDBase
from app.models.clothes import ClothesImage # 确保导入 ClothesImage 模型
from app.schemas.clothes import ClothesImageCreate, ClothesImageUpdate # 确保导入 Image Schema

class CRUDClothesImage(CRUDBase[ClothesImage, ClothesImageCreate, ClothesImageUpdate]):
    
    def create_with_clothes(
        self, db: Session, *, obj_in: ClothesImageCreate, clothes_id: int
    ) -> ClothesImage:
        """为指定的服装创建图片记录"""
        # 使用 Pydantic v2 的 model_dump 或 v1 的 dict
        if hasattr(obj_in, 'model_dump'):
            obj_in_data = obj_in.model_dump()
        else:
            obj_in_data = obj_in.dict()
            
        db_obj_data = jsonable_encoder(obj_in_data)
        db_obj = self.model(**db_obj_data, clothes_id=clothes_id) # 添加 clothes_id
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_clothes(
        self, db: Session, *, clothes_id: int, skip: int = 0, limit: int = 100
    ) -> List[ClothesImage]:
        """获取指定服装的所有图片记录"""
        return (
            db.query(self.model)
            .filter(ClothesImage.clothes_id == clothes_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    # 如果需要根据 URL 或其他字段查找图片，可以在这里添加方法


clothes_image = CRUDClothesImage(ClothesImage) 