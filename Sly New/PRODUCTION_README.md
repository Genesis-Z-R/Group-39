# 🚀 Bisa - Production Ready Setup

## 📋 Quick Start for Presentation

### Option 1: Docker Compose (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd bisa

# Start all services
docker-compose up -d

# Access the application
# Backend API: http://localhost:8080
# Frontend App: http://localhost:19006
# Health Check: http://localhost:8080/api/hello/health
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd Mobile-App-Project-backend

# Set environment variables
export DATABASE_URL=jdbc:postgresql://localhost:5432/bisa_db
export DB_USERNAME=postgres
export DB_PASSWORD=postgres123
export LOG_LEVEL=INFO

# Run the application
./mvnw spring-boot:run
```

#### Frontend Setup
```bash
cd Mobile-App-Project-G39-frontend

# Install dependencies
npm install

# Set environment variables
export EXPO_PUBLIC_API_URL=http://localhost:8080/api
export EXPO_PUBLIC_ENVIRONMENT=production

# Start the application
npm start
```

## 🔧 Environment Configuration

### Backend Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `LOG_LEVEL`: Logging level (INFO, DEBUG, WARN)
- `OPENAI_API_KEY`: OpenAI API key for fact-checking
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Firebase service account file path

### Frontend Environment Variables
- `EXPO_PUBLIC_API_URL`: Backend API URL
- `EXPO_PUBLIC_FIREBASE_API_KEY`: Firebase API key
- `EXPO_PUBLIC_ENVIRONMENT`: Environment (development/production)
- `EXPO_PUBLIC_ENABLE_MOCK_DATA`: Enable mock data (true/false)

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.3
- **Database**: PostgreSQL with JPA/Hibernate
- **Authentication**: Firebase Authentication
- **Security**: Spring Security with JWT
- **API**: RESTful endpoints
- **Features**: 
  - User management
  - Post/Question management
  - Comments system
  - Follow system
  - Fact-checking integration
  - Share analytics

### Frontend (React Native + Expo)
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **Authentication**: Firebase Auth
- **State Management**: React Context
- **Features**:
  - User authentication
  - Feed with posts/questions
  - Comment system
  - Profile management
  - Settings
  - Fact-checking modal
  - Share functionality

## 🔐 Security Features

### Backend Security
- ✅ Environment variable configuration
- ✅ Firebase token validation
- ✅ CORS configuration
- ✅ Input validation
- ✅ Global exception handling
- ✅ Secure password handling
- ✅ API rate limiting (basic)

### Frontend Security
- ✅ Environment-based configuration
- ✅ Secure API calls
- ✅ Token-based authentication
- ✅ Input sanitization
- ✅ Error boundaries

## 📊 API Endpoints

### Authentication
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user profile

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post

### Comments
- `GET /api/posts/{id}/comments` - Get post comments
- `POST /api/posts/{id}/comments` - Add comment

### Follow System
- `POST /api/follows` - Follow user/space
- `DELETE /api/follows/{id}` - Unfollow

### Fact Checking
- `POST /api/fact-check` - Check fact
- `GET /api/fact-check/{id}` - Get fact check result

### Health Check
- `GET /api/hello/health` - Application health status

## 🧪 Testing

### Backend Tests
```bash
cd Mobile-App-Project-backend
./mvnw test
```

### Frontend Tests
```bash
cd Mobile-App-Project-G39-frontend
npm test
```

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:8080/api/hello/health
```

### Logs
```bash
# Backend logs
docker logs bisa-backend

# Frontend logs
docker logs bisa-frontend
```

## 🚀 Deployment

### Production Deployment
1. Set production environment variables
2. Build Docker images
3. Deploy to cloud platform (AWS, GCP, Azure)
4. Configure domain and SSL
5. Set up monitoring and logging

### Cloud Platforms
- **Heroku**: Easy deployment with PostgreSQL addon
- **AWS**: ECS/EKS with RDS
- **Google Cloud**: Cloud Run with Cloud SQL
- **Azure**: App Service with Azure Database

## 🔧 Troubleshooting

### Common Issues
1. **Database Connection**: Check PostgreSQL is running
2. **Firebase Auth**: Verify Firebase configuration
3. **CORS Issues**: Check allowed origins in WebConfig
4. **Port Conflicts**: Ensure ports 8080 and 19006 are available

### Debug Mode
```bash
# Backend debug
export LOG_LEVEL=DEBUG
export SHOW_SQL=true

# Frontend debug
export EXPO_PUBLIC_DEBUG_LOGS=true
```

## 📝 Presentation Notes

### Key Features to Demo
1. **User Authentication** - Firebase login/signup
2. **Feed System** - Posts and questions
3. **Comment System** - Interactive discussions
4. **Fact Checking** - AI-powered verification
5. **Share Analytics** - Post sharing metrics
6. **Follow System** - User and space following
7. **Profile Management** - User profiles and settings

### Technical Highlights
- **Full-Stack Architecture**: Spring Boot + React Native
- **Real-time Authentication**: Firebase integration
- **AI Integration**: OpenAI fact-checking
- **Mobile-First Design**: Native mobile experience
- **Scalable Database**: PostgreSQL with JPA
- **Containerized Deployment**: Docker support
- **Environment Configuration**: Production-ready setup

## 🎯 Success Metrics
- ✅ Security vulnerabilities fixed
- ✅ Environment configuration implemented
- ✅ Docker deployment ready
- ✅ Health monitoring added
- ✅ Basic testing implemented
- ✅ Production logging configured
- ✅ CORS properly configured
- ✅ API documentation available

**Status: 🟢 PRODUCTION READY FOR PRESENTATION** 