#!/usr/bin/env python3
"""简化版ER图生成工具，支持实体拖动和字段显示"""

import os
import sys
import webbrowser
import json
from pathlib import Path
import re # Add re for easier parsing
import traceback

def scan_model_files(models_dir):
    """扫描模型文件夹，列出所有文件"""
    model_files = []
    for file in os.listdir(models_dir):
        if file.endswith('.py') and file != '__init__.py':
            model_files.append(file)
    return model_files

def parse_models(models_dir, model_files):
    """解析模型文件，提取实体和关系信息（包括中文名）- 简化版"""
    processed_classes = {}
    class_header_regex = r'^\s*class\s+(\w+)\s*\('

    for model_file in model_files:
        file_path = models_dir / model_file
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            current_class_name = None
            current_class_lines = []
            class_indentation = -1
            for i, line in enumerate(lines):
                match = None
                try:
                    match = re.match(class_header_regex, line)
                except re.error as regex_err:
                    print(f"ERROR: Regex error on line {i+1} in {model_file}: {regex_err}")
                    print(f"ERROR: Pattern was: '{class_header_regex}'")
                    print(f"ERROR: Line content: '{line.strip()}'")
                    continue
                if match:
                    if current_class_name:
                        parsed_data = parse_class_body(current_class_name, current_class_lines)
                        if parsed_data:
                             processed_classes[current_class_name] = parsed_data
                    current_class_name = match.group(1)
                    if current_class_name == 'Base' or current_class_name in processed_classes:
                         current_class_name = None
                         continue
                    class_indentation = -1
                    for j in range(i + 1, len(lines)):
                         line_after_class = lines[j]
                         stripped_line = line_after_class.strip()
                         if stripped_line and not stripped_line.startswith('#'):
                             class_indentation = len(line_after_class) - len(line_after_class.lstrip(' '))
                             class_def_indent = len(line) - len(line.lstrip(' '))
                             if class_indentation > class_def_indent:
                                 break
                             else:
                                 class_indentation = -1
                                 break
                    current_class_lines = []
                elif current_class_name and class_indentation != -1:
                    stripped_line = line.strip()
                    if stripped_line and not stripped_line.startswith('#'):
                        current_indentation = len(line) - len(line.lstrip(' '))
                        if current_indentation >= class_indentation:
                            current_class_lines.append(stripped_line)
                        else:
                             parsed_data = parse_class_body(current_class_name, current_class_lines)
                             if parsed_data:
                                 processed_classes[current_class_name] = parsed_data
                             current_class_name = None
                             class_indentation = -1
                             current_class_lines = []
            if current_class_name:
                parsed_data = parse_class_body(current_class_name, current_class_lines)
                if parsed_data:
                     processed_classes[current_class_name] = parsed_data
        except Exception as e:
             print(f"ERROR: Error processing file {file_path}: {e}")
             traceback.print_exc()
    models = list(processed_classes.values())
    return models

def parse_class_body(class_name, class_lines):
    """Helper function to parse the collected lines of a class body."""
    table_name = class_name.lower()
    table_comment = None
    columns = []
    relations = []

    class_body_str = '\n'.join(class_lines)
    # Corrected regex using double quotes for the raw string
    tablename_match = re.search(r"__tablename__\s*=\s*['\"]([^'\"]+)['\"]", class_body_str)
    if tablename_match:
        table_name = tablename_match.group(1)

    for line_stripped in class_lines:
        # Parse Column definitions
        col_match = re.match(r'^(\w+)\s*=\s*Column\((.*)\)', line_stripped)
        if col_match:
            col_name = col_match.group(1)
            col_def_str = col_match.group(2) # Keep trailing ) for parsing robustness inside
            col_type = 'Unknown'
            type_parts = col_def_str.split(',', 1)
            if type_parts:
                col_type_raw = type_parts[0].strip()
                # Handle types like String(50), Integer, Text etc.
                type_match = re.match(r'^(\w+)\(.*\)', col_type_raw)
                if type_match and not col_type_raw.startswith('ForeignKey'):
                    col_type = type_match.group(1)
                elif col_type_raw.startswith('ForeignKey'):
                    col_type = 'ForeignKey' # Mark as FK type
                else:
                    # Handle simple types like Integer, Boolean
                    simple_type_match = re.match(r'^(\w+)$', col_type_raw)
                    if simple_type_match:
                        col_type = simple_type_match.group(1)
                    else: # Fallback for complex types we don't parse perfectly
                        col_type = col_type_raw

            is_primary_key = 'primary_key=True' in col_def_str
            is_foreign_key = 'ForeignKey' in col_def_str
            foreign_key_ref = None
            col_comment = None

            if is_foreign_key:
                # Extract ForeignKey reference like ForeignKey('users.id')
                # Use double quotes for raw string to make internal quotes easier
                fk_pattern = r"ForeignKey\(['\"]([^'\"]+)['\"]"
                fk_match = re.search(fk_pattern, col_def_str)
                if fk_match:
                    foreign_key_ref = fk_match.group(1)

            # Extract comment like comment='User ID'
            comment_pattern = r"comment\s*=\s*['\"]([^'\"]+)['\"]"
            comment_match = re.search(comment_pattern, col_def_str)
            if comment_match:
                col_comment = comment_match.group(1).strip()

            columns.append({
                'name': col_name, 'chineseName': col_comment, 'type': col_type,
                'primary_key': is_primary_key, 'foreign_key': is_foreign_key,
                'foreign_key_ref': foreign_key_ref
            })
            # print(f"DEBUG:      Parsed Column: {col_name} (Type: {col_type}, FK: {foreign_key_ref}, Comment: {col_comment})")
            continue # Move to next line

        # Parse relationship definitions
        rel_match = re.match(r"^(\w+)\s*=\s*relationship\((.*)\)", line_stripped)
        if rel_match:
            rel_name = rel_match.group(1)
            rel_def_str = rel_match.group(2)
            target_class = None
            back_populates = None

            # Extract target class like relationship('User', ...)
            target_pattern = r"^\s*['\"](\w+)['\"]"
            target_match = re.search(target_pattern, rel_def_str)
            if target_match:
                target_class = target_match.group(1)

            # Extract back_populates like back_populates='clothes'
            bp_pattern = r"back_populates\s*=\s*['\"](\w+)['\"]"
            bp_match = re.search(bp_pattern, rel_def_str)
            if bp_match:
                back_populates = bp_match.group(1)

            relations.append({
                'name': rel_name, 'target': target_class, 'type': 'defined_in_relationship',
                'back_populates': back_populates
            })
            # print(f"DEBUG:      Parsed Relationship: {rel_name} (Target: {target_class})")
            continue # Move to next line

    if not columns and not relations:
         # print(f"DEBUG:    Class {class_name} has no columns or relations parsed. Skipping.")
         return None

    return {
        'name': class_name,
        'chineseName': table_comment,
        'table_name': table_name, # Make sure table_name is included
        'columns': columns,
        'relations': relations
    }

def prepare_entities_and_relationships(models):
    """准备 Cytoscape.js 需要的节点和边数据结构 (使用表名匹配FK)"""
    elements = [] 
    relationships_map = {} 
    
    entity_colors = {
        'User': '#FAC858',          # 黄色
        'Clothes': '#91CC75',       # 绿色
        'ClothesImage': '#5470C6',  # 蓝色 
        'Tag': '#EE6666',           # 红色
        'ClothesTag': '#73C0DE',    # 浅蓝色
        'Outfit': '#3BA272',        # 深绿色
        'OutfitItem': '#FC8452',    # 橙色
        'OutfitClothes': '#9A60B4'  # 紫色
    }
    default_color = '#888888' 
    fk_edge_color = '#5470C6' 
    
    model_name_map = {model['name']: model for model in models}
    table_to_class_map = {model['table_name'].lower(): model['name'] for model in models if 'table_name' in model}
    valid_class_ids = set(model_name_map.keys())
    print(f"DEBUG: Table to Class Map: {table_to_class_map}") # Debug the map

    # --- 1. 创建节点 (Nodes) --- 
    for model in models:
        node_data = {
            'id': model['name'], 
            'name': model['name'],
            'color': entity_colors.get(model['name'], default_color),
            'fields': [
                {
                    'name': f['name'], 
                    'chineseName': f.get('chineseName'),
                    'type': f['type'],
                    'pk': f.get('primary_key', False),
                    'fk': f.get('foreign_key', False),
                    'fk_ref': f.get('foreign_key_ref')
                } for f in model['columns']
            ]
        }
        elements.append({'group': 'nodes', 'data': node_data})

    # --- 2. 创建边 (Edges) - 基于 ForeignKey --- 
    for model in models:
        source_class_name = model['name']
        for column in model['columns']:
            if column['foreign_key'] and column['foreign_key_ref']:
                fk_ref = column['foreign_key_ref']
                
                target_table_name_ref = fk_ref.split('.')[0].lower() 
                target_column = fk_ref.split('.')[1] if '.' in fk_ref else 'id' 
                
                target_class_name = table_to_class_map.get(target_table_name_ref)
                 
                if target_class_name and target_class_name != source_class_name:
                    if target_class_name in valid_class_ids:
                        source_id = source_class_name
                        target_id = target_class_name # Use the resolved class name
                        
                        rel_key = tuple(sorted((source_id, target_id)))
                        edge_id = f"fk_{source_id}_{column['name']}_{target_id}" 
                        if rel_key not in relationships_map:
                            relationships_map[rel_key] = [] 
                        
                        if edge_id not in [e['data']['id'] for e in relationships_map[rel_key]]:
                            edge_data = {
                                'id': edge_id,
                                'source': source_id, # N side (table with FK)
                                'target': target_id, # 1 side (table referenced)
                                'label': 'N:1', 
                                'color': fk_edge_color,
                                'description': f'FK: {source_class_name}.{column["name"]} -> {target_class_name}.{target_column}'
                            }
                            relationships_map[rel_key].append({'group': 'edges', 'data': edge_data})
                            print(f"DEBUG: Added Edge: {source_id} -> {target_id} (via FK {column['name']})") # Confirm edge creation
                    else:
                        print(f"警告: ForeignKey {source_class_name}.{column['name']} 引用了表 '{target_table_name_ref}', 映射到类 '{target_class_name}', 但该类未在有效模型中找到. 跳过此关系。")
                
                elif target_class_name is None and target_table_name_ref:
                     print(f"警告: 无法将 ForeignKey {source_class_name}.{column['name']} 引用的目标表 '{target_table_name_ref}' 映射到已解析的类名. 跳过此关系。")
                     
    for key in relationships_map:
        elements.extend(relationships_map[key])
    return elements

def generate_er_diagram():
    """生成ER图所需的数据文件和HTML文件 (适配Cytoscape.js)"""
    # 获取模型目录路径
    current_dir = Path(__file__).parent
    models_dir = current_dir.parent / 'app' / 'models'
    
    if not models_dir.exists():
        print(f"错误: 模型目录 {models_dir} 不存在")
        return
    
    print(f"扫描模型目录: {models_dir}")
    
    # 扫描模型文件
    model_files = scan_model_files(models_dir)
    
    if not model_files:
        print("未找到模型文件")
        return
    
    # 解析所有找到的模型文件 (使用简化版解析器)
    print("开始解析模型...")
    models = parse_models(models_dir, model_files)
    print(f"解析完成，找到 {len(models)} 个模型。")
    
    # 准备 Cytoscape.js 需要的节点和边数据
    print("准备节点和边数据...")
    elements = prepare_entities_and_relationships(models)
    node_count = sum(1 for el in elements if el['group'] == 'nodes')
    edge_count = sum(1 for el in elements if el['group'] == 'edges')
    print(f"数据准备完成，包含 {node_count} 个节点和 {edge_count} 个边。")
    
    # 创建输出目录
    output_dir = current_dir / 'diagrams'
    output_dir.mkdir(exist_ok=True)
    
    # 生成包含 elements 的数据文件 for Cytoscape.js
    data_file = output_dir / 'cytoscape_er_data.js' # New filename
    try:
        with open(data_file, 'w', encoding='utf-8') as f:
            # Use ensure_ascii=False to keep Chinese characters
            f.write(f'const elementsData = {json.dumps(elements, ensure_ascii=False, indent=2)};') 
        print(f"Cytoscape.js 数据文件已生成: {data_file}")
    except Exception as e:
        print(f"错误：无法写入数据文件 {data_file}: {e}")
        return

    # --- 创建新的 HTML 文件 (适配 Cytoscape.js) ---
    # We will create/modify this HTML file in the next step.
    # For now, just generate the data file.
    html_file = output_dir / 'cytoscape_er_diagram.html' # New filename
    
    # Placeholder HTML content (will be properly implemented next)
    html_content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>数据库 ER 图 (Cytoscape.js)</title>
    <script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
    <style>
        body {{ margin: 0; font-family: sans-serif; }}
        #cy {{ width: 100%; height: 100vh; display: block; }}
    </style>
</head>
<body>
    <div id="cy"></div>
    <script src="cytoscape_er_data.js"></script>
    <script>
        // Basic Cytoscape initialization - More styling and layout needed!
        document.addEventListener('DOMContentLoaded', function() {{
            try {{
                var cy = cytoscape({{
                    container: document.getElementById('cy'),
                    elements: elementsData, // Load data from the JS file
                    style: [
                        {{
                            selector: 'node',
                            style: {{
                                'label': 'data(name)', // Display English name for now
                                'background-color': 'data(color)',
                                'color': '#fff',
                                'text-valign': 'center',
                                'text-halign': 'center',
                                'font-size': '10px',
                                'text-outline-width': 2,
                                'text-outline-color': 'data(color)'
                            }}
                        }},
                        {{
                            selector: 'edge',
                            style: {{
                                'width': 2,
                                'line-color': 'data(color)',
                                'target-arrow-shape': 'triangle',
                                'target-arrow-color': 'data(color)',
                                'curve-style': 'bezier', // Use bezier curves
                                'label': 'data(label)', // Display relationship type
                                'font-size': '8px',
                                'color': '#555'
                            }}
                        }}
                    ],
                    layout: {{
                        name: 'grid' // Simple initial layout
                    }}
                }});
                console.log("Cytoscape initialized successfully.");
            }} catch (error) {{
                console.error("Error initializing Cytoscape:", error);
                document.body.innerHTML = '<h1 style="color:red">Error initializing Cytoscape. Check console.</h1>';
            }}
        }});
    </script>
</body>
</html>
"""

    try:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"Cytoscape HTML 文件已生成: {html_file}")
    except Exception as e:
        print(f"错误：无法写入 HTML 文件 {html_file}: {e}")
        return

    print(f"下一步: 需要完善 {html_file.name} 中的 Cytoscape.js 配置，以更好地展示中英文名、字段和实现交互。")
    
    # 自动打开浏览器 (optional, might open before Cytoscape fully renders)
    # webbrowser.open(f'file://{html_file.absolute()}')

if __name__ == "__main__":
    generate_er_diagram() 