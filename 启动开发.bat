@echo off
chcp 65001 >nul
echo ========================================
echo       情绪盲盒 - 启动脚本
echo ========================================
echo.

:: 检查Node.js是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查依赖是否安装
if not exist "node_modules" (
    echo [提示] 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

echo [提示] 正在启动应用...
echo.

:: 启动Electron开发模式
npm run electron:dev

pause
