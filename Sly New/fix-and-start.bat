@echo off
echo ========================================
echo BISA App - Complete Fix and Start Script
echo ========================================
echo.

echo Step 1: Checking current directory...
cd /d "C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1"

if not exist "package.json" (
    echo ERROR: Not in the correct directory!
    echo Current directory: %CD%
    echo.
    echo Please navigate to: C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1
    echo.
    pause
    exit /b 1
)

echo ✅ Correct directory found: %CD%
echo.

echo Step 2: Clearing all caches...
echo Clearing Metro cache...
npx expo start --clear --reset-cache >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Metro cache clear had issues, continuing...
)

echo Clearing npm cache...
npm cache clean --force >nul 2>&1

echo ✅ Caches cleared
echo.

echo Step 3: Checking for problematic files...
if exist "src\assets\default-avatar.png" (
    echo Found problematic default-avatar.png, removing...
    del "src\assets\default-avatar.png" >nul 2>&1
    echo ✅ Removed problematic file
) else (
    echo ✅ No problematic files found
)
echo.

echo Step 4: Starting the app...
echo Starting BISA app with clear cache...
echo.
echo If you see any errors, they will be displayed below:
echo ========================================

npx expo start --clear

echo.
echo ========================================
echo App startup complete!
echo.
echo If you encountered any errors:
echo 1. Make sure you're in the correct directory
echo 2. Try running: npx expo start --clear --reset-cache
echo 3. Check the troubleshooting guide
echo.
pause 