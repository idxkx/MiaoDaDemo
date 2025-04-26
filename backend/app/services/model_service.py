import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Union

import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

from app.core.config import settings

# 配置日志
logger = logging.getLogger(__name__)

class ClothingModel:
    """服装识别模型类，负责加载和管理预训练模型"""
    
    def __init__(self, model_name: str = None):
        """
        初始化服装识别模型
        
        Args:
            model_name: 模型名称，默认使用配置中的ACTIVE_CLOTHING_MODEL
        """
        self.model_name = model_name or settings.ACTIVE_CLOTHING_MODEL
        self.model_path = Path(settings.MODEL_BASE_PATH) / self.model_name
        
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"使用设备: {self.device}")
        
        # 模型相关属性
        self.model = None
        self.transform = None
        self.class_names = []
        self.feature_names = []
        
        # 加载模型
        self._load_model()
        
    def _load_model(self):
        """加载预训练模型和相关配置"""
        try:
            # 1. 加载类别和特征名称
            metadata_path = self.model_path / "metadata.json"
            if metadata_path.exists():
                with open(metadata_path, "r", encoding="utf-8") as f:
                    metadata = json.load(f)
                    self.class_names = metadata.get("class_names", [])
                    self.feature_names = metadata.get("feature_names", [])
            
            # 2. 初始化模型
            self.model = models.resnet50(pretrained=False)
            
            # 修改最后一层以匹配我们的分类数量
            num_classes = len(self.class_names) if self.class_names else 40
            self.model.fc = nn.Linear(2048, num_classes)
            
            # 3. 加载模型权重
            model_weights_path = self.model_path / "model.pth"
            if model_weights_path.exists():
                self.model.load_state_dict(torch.load(
                    model_weights_path, 
                    map_location=self.device
                ))
                logger.info(f"成功加载模型权重: {model_weights_path}")
            else:
                logger.warning(f"模型权重文件不存在: {model_weights_path}")
            
            # 4. 设置为评估模式
            self.model.to(self.device)
            self.model.eval()
            
            # 5. 设置图像预处理
            self.transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225]
                )
            ])
            
            logger.info(f"模型 '{self.model_name}' 加载成功")
            
        except Exception as e:
            logger.error(f"加载模型失败: {str(e)}")
            # 失败时初始化一个基础ResNet作为后备
            self._init_fallback_model()
    
    def _init_fallback_model(self):
        """初始化后备模型（未训练的基础ResNet）"""
        logger.info("初始化后备模型")
        self.model = models.resnet50(pretrained=True)
        self.model.eval()
        self.model.to(self.device)
        
        # 基本图像变换
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def extract_features(self, image: Union[str, Image.Image]) -> List[float]:
        """
        从图像中提取特征向量
        
        Args:
            image: 图像路径或PIL图像对象
            
        Returns:
            特征向量列表
        """
        # 确保模型已加载
        if self.model is None:
            logger.error("模型未加载")
            return []
        
        try:
            # 加载图像
            if isinstance(image, str):
                img = Image.open(image).convert('RGB')
            else:
                img = image
            
            # 预处理图像
            img_tensor = self.transform(img).unsqueeze(0).to(self.device)
            
            # 提取特征（使用最后一个池化层的输出）
            with torch.no_grad():
                # 获取预训练模型的特征提取器
                feature_extractor = nn.Sequential(*list(self.model.children())[:-1])
                features = feature_extractor(img_tensor)
                
                # 将特征张量展平为一维向量
                features = features.squeeze().cpu().numpy().tolist()
            
            return features
        
        except Exception as e:
            logger.error(f"特征提取失败: {str(e)}")
            return []
    
    def predict(self, image: Union[str, Image.Image]) -> Dict:
        """
        预测图像中的服装类别和属性
        
        Args:
            image: 图像路径或PIL图像对象
            
        Returns:
            包含预测结果的字典
        """
        # 确保模型已加载
        if self.model is None:
            logger.error("模型未加载")
            return {"error": "模型未加载"}
        
        try:
            # 加载图像
            if isinstance(image, str):
                img = Image.open(image).convert('RGB')
            else:
                img = image
            
            # 预处理图像
            img_tensor = self.transform(img).unsqueeze(0).to(self.device)
            
            # 进行预测
            with torch.no_grad():
                outputs = self.model(img_tensor)
                _, predicted = torch.max(outputs, 1)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
            
            # 获取预测结果
            predicted_class_idx = predicted.item()
            
            # 获取top-3类别及其概率
            _, top3_indices = torch.topk(probabilities, min(3, len(probabilities)))
            top3_indices = top3_indices.cpu().numpy()
            
            top3_predictions = []
            for idx in top3_indices:
                class_name = self.class_names[idx] if idx < len(self.class_names) else f"类别_{idx}"
                probability = probabilities[idx].item()
                top3_predictions.append({
                    "class": class_name,
                    "probability": round(probability, 4)
                })
            
            # 构建返回结果
            result = {
                "predicted_class": self.class_names[predicted_class_idx] if predicted_class_idx < len(self.class_names) else f"类别_{predicted_class_idx}",
                "confidence": round(probabilities[predicted_class_idx].item(), 4),
                "top3_predictions": top3_predictions
            }
            
            return result
        
        except Exception as e:
            logger.error(f"预测失败: {str(e)}")
            return {"error": f"预测失败: {str(e)}"}
    
    def generate_tags(self, image: Union[str, Image.Image]) -> List[str]:
        """
        为图像生成标签
        
        Args:
            image: 图像路径或PIL图像对象
            
        Returns:
            标签列表
        """
        prediction = self.predict(image)
        if "error" in prediction:
            return []
        
        tags = []
        
        # 添加主分类作为标签
        main_class = prediction.get("predicted_class")
        if main_class:
            tags.append(main_class)
        
        # 添加Top3预测中概率大于0.2的类别
        for pred in prediction.get("top3_predictions", []):
            if pred["probability"] > 0.2 and pred["class"] not in tags:
                tags.append(pred["class"])
        
        return tags
        
# 全局模型实例
_model_instance = None

def get_model() -> ClothingModel:
    """获取或创建服装识别模型实例"""
    global _model_instance
    if _model_instance is None:
        _model_instance = ClothingModel()
    return _model_instance

def reload_model(model_name: Optional[str] = None) -> ClothingModel:
    """重新加载服装识别模型"""
    global _model_instance
    _model_instance = ClothingModel(model_name)
    return _model_instance 