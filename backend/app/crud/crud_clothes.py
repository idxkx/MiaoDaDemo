from typing import Any, List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.clothes import Clothes # 确保导入你的 Clothes 模型
from app.schemas.clothes import ClothesCreate, ClothesUpdate # 确保导入你的 Clothes Schema

class CRUDClothes(CRUDBase[Clothes, ClothesCreate, ClothesUpdate]):
    def create_with_owner(
        self, db: Session, *, obj_in: ClothesCreate, user_id: int
    ) -> Clothes:
        """创建一件指定所有者的服装"""
        # 使用 Pydantic v2 的 model_dump 或 v1 的 dict
        if hasattr(obj_in, 'model_dump'):
            obj_in_data = obj_in.model_dump()
        else:
            obj_in_data = obj_in.dict()

        db_obj_data = jsonable_encoder(obj_in_data)
        db_obj = self.model(**db_obj_data, user_id=user_id) # 添加 user_id
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Clothes]:
        """获取指定用户的所有服装，支持分页"""
        return (
            db.query(self.model)
            .filter(Clothes.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    # 基类已经提供了 get(id) 方法，如果需要可以通过 clothes.get(db, id=...) 调用
    # 基类也提供了 get_multi() 方法，如果需要获取所有用户的服装可以调用


# 创建一个实例供其他地方导入使用
clothes = CRUDClothes(Clothes) 