@echo off
echo ========================================
echo BISA App - TurboModule Fix Verification
echo ========================================
echo.

echo Checking current directory...
if not exist "package.json" (
    echo ERROR: Not in the correct directory!
    echo Please navigate to: C:\Users\HP\Downloads\Group-39-main (1)\Group-39-main\Bisa1
    echo.
    pause
    exit /b 1
)

echo ✅ Correct directory found
echo.

echo Checking package versions...
npm list react-native-reanimated react-native-gesture-handler react-native-screens

echo.
echo Checking for TurboModule errors...
echo Starting app with clear cache...

npx expo start --clear

echo.
echo If you see any TurboModule errors, please:
echo 1. Stop the server (Ctrl+C)
echo 2. Run: npx expo start --clear --reset-cache
echo 3. Try again
echo.
pause 