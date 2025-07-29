@echo off
echo ========================================
echo    Bisa Project Setup Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed or not in PATH
    echo Please install Java 17 or higher from: https://adoptium.net/
    pause
    exit /b 1
) else (
    echo ✅ Java is installed
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

echo.
echo ========================================
echo    Starting Backend...
echo ========================================
echo.

cd Mobile-App-Project-backend
if exist mvnw.cmd (
    echo Starting Spring Boot backend...
    start "Backend" cmd /k "mvnw.cmd spring-boot:run"
) else (
    echo ❌ Maven wrapper not found
    echo Please ensure you're in the correct directory
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Starting Frontend...
echo ========================================
echo.

cd ..\Mobile-App-Project-G39-frontend
if exist package.json (
    echo Installing frontend dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    
    echo.
    echo Starting Expo development server...
    start "Frontend" cmd /k "npm start"
) else (
    echo ❌ package.json not found
    echo Please ensure you're in the correct directory
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo 🌐 Backend: http://localhost:8080
echo 📱 Frontend: Check the Expo terminal window
echo.
echo 📋 Next Steps:
echo 1. Wait for both servers to start
echo 2. Scan QR code with Expo Go app
echo 3. Or press 'w' in Expo terminal for web
echo.
echo Press any key to exit...
pause >nul 