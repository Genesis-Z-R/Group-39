#!/bin/bash

echo "========================================"
echo "    Bisa Project Setup Script"
echo "========================================"
echo

echo "Checking prerequisites..."
echo

# Check Java
if command -v java &> /dev/null; then
    echo "✅ Java is installed"
    java -version
else
    echo "❌ Java is not installed or not in PATH"
    echo "Please install Java 17 or higher from: https://adoptium.net/"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed"
    node --version
else
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js 18 or higher from: https://nodejs.org/"
    exit 1
fi

echo
echo "========================================"
echo "    Starting Backend..."
echo "========================================"
echo

cd Mobile-App-Project-backend
if [ -f "./mvnw" ]; then
    echo "Starting Spring Boot backend..."
    echo "Backend will be available at: http://localhost:8080"
    echo "Press Ctrl+C to stop the backend"
    echo
    ./mvnw spring-boot:run &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
else
    echo "❌ Maven wrapper not found"
    echo "Please ensure you're in the correct directory"
    exit 1
fi

echo
echo "========================================"
echo "    Starting Frontend..."
echo "========================================"
echo

cd ../Mobile-App-Project-G39-frontend
if [ -f "package.json" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    
    echo
    echo "Starting Expo development server..."
    echo "Frontend will be available at: http://localhost:19006"
    echo "Press Ctrl+C to stop the frontend"
    echo
    npm start
else
    echo "❌ package.json not found"
    echo "Please ensure you're in the correct directory"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Cleanup function
cleanup() {
    echo
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    echo "Setup stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM 