import logging
from typing import Optional, Dict, Any

# 配置日志
logger = logging.getLogger(__name__)

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