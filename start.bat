@echo off
chcp 65001 >nul
color 0A
cls

echo 正在启动智能穿搭助手...

REM 停止可能运行中的Python进程
taskkill /f /im python.exe /t >nul 2>nul
timeout /t 1 /nobreak > nul

REM 启动后端服务
echo 正在启动后端服务...
start cmd /k "cd /d %~dp0backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak > nul

REM 启动前端服务
echo 正在启动前端服务...
start cmd /k "cd /d %~dp0frontend && python -m http.server 3000"

timeout /t 3 /nobreak > nul

REM 打开浏览器
start http://localhost:3000

echo.
echo 应用启动完成！
echo - 前端页面：http://localhost:3000
echo - 后端API：http://localhost:8000
echo.
echo 提示：关闭本窗口不会停止应用，需关闭命令窗口才能完全停止。 