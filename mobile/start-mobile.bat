w@echo off
REM MedChain Mobile - Startup Script for Windows
echo 🏥 Starting MedChain Mobile App...
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 16 (
    echo ❌ Node.js version 16 or higher is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

REM Check if Expo CLI is installed
expo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Expo CLI...
    npm install -g @expo/cli
)

echo ✅ Expo CLI version: 
expo --version

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Check if backend is running (optional)
echo 🔍 Checking backend connectivity...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend server is running on http://localhost:8000
) else (
    echo ⚠️  Backend server is not running on http://localhost:8000
    echo    Make sure to start the MedChain backend first:
    echo    cd ..\backend ^& python main.py
    echo.
)

echo.
echo 🚀 Starting MedChain Mobile development server...
echo 📱 You can now:
echo    - Press 'i' to open iOS simulator
echo    - Press 'a' to open Android emulator
echo    - Press 'w' to open in web browser
echo    - Scan QR code with Expo Go app on your phone
echo.

REM Start the development server
npm start

pause
