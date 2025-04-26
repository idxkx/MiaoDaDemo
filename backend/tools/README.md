# 数据库可视化工具

本目录下包含了多种查看数据库结构的工具脚本。

## 安装依赖

首先安装必要的依赖：

```bash
pip install -r ../requirements.txt
```

对于Windows系统，还需要安装Graphviz：
1. 下载并安装：https://graphviz.org/download/
2. 确保将Graphviz的bin目录添加到系统PATH中

## 工具使用方法

### 1. 控制台显示数据库结构

使用Rich库在终端中显示数据库表结构和关系：

```bash
python show_db_structure.py
```

这将显示所有表的字段、类型、约束和表之间的关系。

### 2. 生成ER图 (ERAlchemy)

使用ERAlchemy生成实体关系图：

```bash
python generate_er_diagram.py
```

生成的图表将保存在 `diagrams/erd_diagram.png`。

### 3. 生成详细数据库图 (SQLAlchemy Schema Display)

使用SQLAlchemy Schema Display生成更详细的数据库结构图：

```bash
python generate_db_diagram.py
```

生成的图表将保存在 `diagrams/dbschema.png`。

## 注意事项

1. 这些工具只能显示SQLAlchemy模型定义的数据库结构，不会读取实际数据库中的表结构。
2. 需要确保数据库模型已正确定义并导入。
3. 图表生成工具需要Graphviz支持，请确保正确安装。 