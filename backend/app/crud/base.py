from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session

# 假设你的 SQLAlchemy Base 定义在 app.db.base_class
# 如果路径不同，请修改下面的导入
try:
    from app.db.base_class import Base
except ImportError:
    # 如果上面的导入失败，尝试备用路径
    from app.db.base import Base


ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        **Parameters**

        * `model`: A SQLAlchemy model class
        """
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        """获取指定ID的单个对象"""
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """获取多个对象，支持分页"""
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        """创建一个新对象"""
        # 使用 Pydantic v2 的 model_dump 或 v1 的 dict
        if hasattr(obj_in, 'model_dump'):
            obj_in_data = obj_in.model_dump()
        else:
            obj_in_data = obj_in.dict()
        
        # 使用 jsonable_encoder 确保数据类型兼容 SQLAlchemy
        db_obj_data = jsonable_encoder(obj_in_data)
        db_obj = self.model(**db_obj_data)  # type: ignore
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        """更新一个已存在的对象"""
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            # 使用 Pydantic v2 的 model_dump 或 v1 的 dict，排除未设置的字段
            if hasattr(obj_in, 'model_dump'):
                 update_data = obj_in.model_dump(exclude_unset=True)
            else:
                 update_data = obj_in.dict(exclude_unset=True)

        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> Optional[ModelType]:
        """根据ID删除一个对象"""
        obj = db.query(self.model).get(id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj 