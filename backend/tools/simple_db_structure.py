#!/usr/bin/env python3
"""简单的数据库结构查看工具，无需复杂依赖"""

import os
import sys
from pathlib import Path

# 将项目根目录添加到 Python 路径
current_dir = Path(__file__).resolve().parent
backend_root = current_dir.parent
sys.path.append(str(backend_root))

from sqlalchemy import inspect
from sqlalchemy.orm import class_mapper

# 修复导入路径：使用 app.db.base 而不是 app.db.base_class
from app.db.base import Base

# 手动导入所有模型类以便在Base.metadata中注册
# 用try-except块处理可能的导入错误
try:
    from app.models.user import User
    from app.models.clothes import Clothes, ClothesImage
    from app.models.tag import Tag, ClothesTag
    from app.models.outfit import Outfit, OutfitItem
except ImportError as e:
    print(f"导入模型时出错: {e}")
    sys.exit(1)

def print_table_structure():
    """打印所有表结构"""
    print("\n=== 数据库表结构 ===\n")
    
    # 获取所有已正确导入并注册到Base.metadata的模型
    models_in_metadata = {}
    for table_name, table_obj in Base.metadata.tables.items():
        # 尝试从表名反查模型类 (这可能不完美，但比硬编码好)
        # 更好的方式是在模型类上加标记
        for model_cls in Base.__subclasses__(): # 假设Base是所有模型的基类
            if hasattr(model_cls, '__tablename__') and model_cls.__tablename__ == table_name:
                models_in_metadata[table_name] = model_cls
                break
        # 如果找不到对应的类，可能需要改进查找逻辑或手动维护列表
        # if table_name not in models_in_metadata:
        #     print(f"警告: 找不到表 {table_name} 对应的模型类")
    
    # 使用从 metadata 获取的表和模型
    tables = Base.metadata.tables
    table_names = sorted(tables.keys())
    registered_models = [m for m in models_in_metadata.values() if m] # 过滤掉None
    
    # 打印每个表的结构
    for table_name in table_names:
        table = tables[table_name]
        print(f"\n表名: {table_name}")
        print("-" * 80)
        print(f"{'列名':<20} {'类型':<25} {'主键':<5} {'可空':<5} {'索引':<5}")
        print("-" * 80)
        
        # 获取表的所有列
        for column in table.columns:
            print(f"{column.name:<20} {str(column.type):<25} {'✓' if column.primary_key else ' ':<5} "
                  f"{'✓' if column.nullable else ' ':<5} {'✓' if hasattr(column, 'index') and column.index else ' ':<5}")
    
    # 打印表关系
    print("\n\n=== 表间关系 ===\n")
    print(f"{'源表':<20} {'关系':<5} {'目标表':<20} {'关系属性':<30}")
    print("-" * 80)
    
    for model in registered_models: # 使用从metadata获取的模型列表
        model_name = model.__name__
        if hasattr(model, "__mapper__") and hasattr(model.__mapper__, "relationships"):
            for rel_name, rel in model.__mapper__.relationships.items():
                try:
                    target_model = rel.mapper.class_.__name__
                    rel_type = "1:N" if rel.uselist else "N:1"
                    if rel.secondary is not None:
                        rel_type = "N:N"
                        
                    cascade = str(rel.cascade)
                    print(f"{model_name:<20} {rel_type:<5} {target_model:<20} {cascade:<30}")
                except Exception as e:
                    print(f"处理{model_name}的关系时出错: {e}")

if __name__ == "__main__":
    print_table_structure() 