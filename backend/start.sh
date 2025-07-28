#!/bin/bash

echo "🚀 Starting BISA Backend..."

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6+."
    exit 1
fi

echo "✅ Java and Maven found"

# Clean and build the project
echo "🔨 Building project..."
mvn clean install

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    # Start the application
    echo "🚀 Starting Spring Boot application..."
    echo "📱 API will be available at: http://localhost:8080/api"
    echo "🗄️ H2 Console will be available at: http://localhost:8080/api/h2-console"
    echo ""
    echo "Press Ctrl+C to stop the application"
    echo ""
    
    mvn spring-boot:run
else
    echo "❌ Build failed"
    exit 1
fi 