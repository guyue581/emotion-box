@echo off
chcp 65001 >nul
echo ========================================
echo       情绪盲盒 - 打包脚本
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

echo [提示] 正在构建Windows安装包...
echo         这可能需要几分钟时间，请耐心等待...
echo.

:: 构建Electron应用
npm run electron:build:win

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [成功] 构建完成！
    echo ========================================
    echo.
    echo 安装包位置: dist-electron/
    echo.
    set /p choice=是否打开输出目录？(Y/N):
    if /i "%choice%"=="Y" (
        explorer dist-electron
    )
) else (
    echo.
    echo [错误] 构建失败，请检查错误信息
)

pause
