import requests
import logging
from typing import Optional, Dict, Any

from app.core.config import settings

# 配置日志
logger = logging.getLogger(__name__)

def get_wechat_openid(code: str) -> Optional[str]:
    """
    通过微信小程序临时登录凭证code获取用户唯一标识openid
    
    参数:
        code: 小程序前端登录时获取的临时凭证
        
    返回:
        成功返回用户openid，失败返回None
    """
    # 开发环境下模拟返回
    if settings.ENVIRONMENT == "development" and not settings.WECHAT_APPID:
        logger.warning("开发环境下，使用测试openid")
        return f"test_openid_{code[-4:]}"  # 基于code后4位生成测试openid
    
    # 请求微信API
    try:
        api_url = "https://api.weixin.qq.com/sns/jscode2session"
        params = {
            "appid": settings.WECHAT_APPID,
            "secret": settings.WECHAT_APP_SECRET,
            "js_code": code,
            "grant_type": "authorization_code"
        }
        
        response = requests.get(api_url, params=params)
        data = response.json()
        
        if "errcode" in data and data["errcode"] != 0:
            logger.error(f"微信登录API错误: {data}")
            return None
            
        return data.get("openid")
    except Exception as e:
        logger.exception(f"微信登录请求异常: {str(e)}")
        return None


def get_access_token() -> Optional[str]:
    """
    获取微信小程序全局接口调用凭据
    
    返回:
        成功返回access_token，失败返回None
    """
    # 开发环境下模拟返回
    if settings.ENVIRONMENT == "development" and not settings.WECHAT_APPID:
        logger.warning("开发环境下，使用测试access_token")
        return "test_access_token"
    
    try:
        api_url = "https://api.weixin.qq.com/cgi-bin/token"
        params = {
            "grant_type": "client_credential",
            "appid": settings.WECHAT_APPID,
            "secret": settings.WECHAT_APP_SECRET
        }
        
        response = requests.get(api_url, params=params)
        data = response.json()
        
        if "errcode" in data and data["errcode"] != 0:
            logger.error(f"获取access_token错误: {data}")
            return None
            
        return data.get("access_token")
    except Exception as e:
        logger.exception(f"获取access_token异常: {str(e)}")
        return None

def basic_auth_login(username: str, password: str) -> Optional[str]:
    """
    基本的用户名密码验证函数
    
    参数:
        username: 用户名
        password: 密码
        
    返回:
        成功返回用户ID，失败返回None
    """
    # 这里实现简单的用户名/密码验证逻辑
    # 在实际应用中，应该从数据库验证用户凭据
    logger.info(f"用户 {username} 尝试登录")
    
    # 测试账号，实际应用中应从数据库验证
    test_accounts = {
        "user1": "password1",
        "user2": "password2",
        "admin": "admin123"
    }
    
    if username in test_accounts and test_accounts[username] == password:
        return username  # 使用用户名作为用户ID
    
    logger.warning(f"用户 {username} 登录失败：凭据无效")
    return None 