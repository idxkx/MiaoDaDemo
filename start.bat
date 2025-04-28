@echo off
chcp 65001 > nul
echo 正在启动喵搭智能时尚助手...
echo.

REM 设置环境变量
set BACKEND_PORT=8000
set FRONTEND_PORT=3000

REM 检查Python环境
echo 检查Python环境...
python --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到Python环境，请安装Python 3.8+
    echo 您可以从 https://www.python.org/downloads/ 下载安装Python
    pause
    exit /b
)

REM 激活虚拟环境
echo 激活虚拟环境...
if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
) else (
    echo [警告] 未检测到虚拟环境，将使用系统Python
)

REM 启动后端服务器
echo 启动后端服务器 (端口 %BACKEND_PORT%)...
start cmd /k "cd backend && python -m uvicorn main:app --reload --port %BACKEND_PORT% --host 127.0.0.1"

REM 启动前端服务
echo 启动前端服务 (端口 %FRONTEND_PORT%)...
start cmd /k "cd frontend && python -m http.server %FRONTEND_PORT%"

echo.
echo 服务已启动:
echo - 后端API: http://localhost:%BACKEND_PORT%
echo - 前端网站: http://localhost:%FRONTEND_PORT%
echo.
echo 请使用浏览器访问: http://localhost:%FRONTEND_PORT% 开始使用喵搭智能时尚助手
echo.
echo 按任意键退出此窗口 (服务将在后台继续运行)
pause > nul 