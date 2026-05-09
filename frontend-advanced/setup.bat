@echo off
REM CipherShield Advanced Frontend - Setup Script for Windows

echo.
echo =========================================
echo   CipherShield Advanced Frontend - Setup
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js 16 or higher from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.
echo [OK] npm is installed
npm --version
echo.

REM Install dependencies
echo [RUNNING] Installing npm dependencies...
echo.
npm install

if errorlevel 1 (
    echo.
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo =========================================
echo   [SUCCESS] Installation Complete!
echo =========================================
echo.
echo Available commands:
echo   npm run dev     - Start dev server at http://localhost:5173
echo   npm run build   - Build for production
echo   npm run preview - Preview production build
echo.
echo Before running, make sure the backend is started:
echo   cd ../backend
echo   python app.py
echo.
echo.
pause
