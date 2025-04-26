import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_create_test_user():
    """测试创建测试用户"""
    response = client.post("/api/v1/auth/test-users")
    
    # 验证响应
    assert response.status_code == 200
    assert "id" in response.json()
    assert response.json()["username"] == "testuser"

def test_login():
    """测试登录接口"""
    # 确保测试用户存在
    client.post("/api/v1/auth/test-users")
    
    # 使用测试用户登录
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "testuser", "password": "testpassword"}
    )
    
    # 验证响应
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_wrong_password():
    """测试登录失败（密码错误）"""
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "testuser", "password": "wrongpassword"}
    )
    
    # 验证响应
    assert response.status_code == 401

def test_me_endpoint_unauthorized():
    """测试未授权状态下访问个人信息"""
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401  # 未授权应返回401

def test_me_endpoint_authorized():
    """测试授权状态下访问个人信息"""
    # 确保测试用户存在
    client.post("/api/v1/auth/test-users")
    
    # 获取token
    login_response = client.post(
        "/api/v1/auth/login",
        json={"username": "testuser", "password": "testpassword"}
    )
    token = login_response.json()["access_token"]
    
    # 带token请求个人信息
    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # 验证响应
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["username"] == "testuser" 