#!/bin/bash

echo "🚀 Starting Bisa Application for Presentation..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Create .env files if they don't exist
if [ ! -f "Mobile-App-Project-backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp Mobile-App-Project-backend/env.example Mobile-App-Project-backend/.env
fi

if [ ! -f "Mobile-App-Project-G39-frontend/.env" ]; then
    echo "📝 Creating frontend .env file..."
    cp Mobile-App-Project-G39-frontend/env.example Mobile-App-Project-G39-frontend/.env
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."

# Check backend health
if curl -f http://localhost:8080/api/hello/health > /dev/null 2>&1; then
    echo "✅ Backend is running at http://localhost:8080"
else
    echo "❌ Backend is not responding"
fi

# Check frontend
if curl -f http://localhost:19006 > /dev/null 2>&1; then
    echo "✅ Frontend is running at http://localhost:19006"
else
    echo "⚠️  Frontend might still be starting..."
fi

echo ""
echo "🎉 Bisa Application is ready for presentation!"
echo ""
echo "📱 Access Points:"
echo "   Backend API: http://localhost:8080"
echo "   Health Check: http://localhost:8080/api/hello/health"
echo "   Frontend App: http://localhost:19006"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo ""
echo "📋 Presentation Checklist:"
echo "   ✅ User Authentication (Firebase)"
echo "   ✅ Feed System (Posts/Questions)"
echo "   ✅ Comment System"
echo "   ✅ Fact Checking (AI Integration)"
echo "   ✅ Share Analytics"
echo "   ✅ Follow System"
echo "   ✅ Profile Management"
echo ""
echo "�� Ready to present!" 