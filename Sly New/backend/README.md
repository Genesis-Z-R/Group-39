# BISA Backend - Spring Boot API

A comprehensive Spring Boot backend for the BISA Q&A application with H2 database, JWT authentication, and RESTful APIs.

## 🚀 Features

- **Spring Boot 3.2.0** with Java 17
- **H2 In-Memory Database** for development
- **JWT Authentication** with Spring Security
- **JPA/Hibernate** for data persistence
- **RESTful APIs** for all CRUD operations
- **CORS Support** for cross-origin requests
- **File Upload** support for images
- **Validation** with Bean Validation

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## 🛠️ Installation & Setup

### 1. Clone and Navigate
```bash
cd backend
```

### 2. Build the Project
```bash
mvn clean install
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Access H2 Console
- URL: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:bisadb`
- Username: `sa`
- Password: `password`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user profile
- `GET /api/users/{id}/questions` - Get user's questions

### Questions
- `GET /api/questions` - Get all questions (paginated)
- `GET /api/questions/{id}` - Get question by ID
- `POST /api/questions` - Create new question
- `PUT /api/questions/{id}` - Update question
- `DELETE /api/questions/{id}` - Delete question
- `GET /api/questions/search` - Search questions
- `GET /api/questions/tags/{tag}` - Get questions by tag

### Answers
- `GET /api/questions/{questionId}/answers` - Get answers for question
- `POST /api/questions/{questionId}/answers` - Add answer to question
- `PUT /api/answers/{id}` - Update answer
- `DELETE /api/answers/{id}` - Delete answer

### Comments
- `GET /api/questions/{questionId}/comments` - Get comments for question
- `POST /api/questions/{questionId}/comments` - Add comment to question
- `GET /api/answers/{answerId}/comments` - Get comments for answer
- `POST /api/answers/{answerId}/comments` - Add comment to answer

### File Upload
- `POST /api/upload/image` - Upload image file

## 🗄️ Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `name`
- `email` (Unique)
- `password` (Encrypted)
- `bio`
- `location`
- `website`
- `profile_image`
- `reputation`
- `followers`
- `following`
- `is_verified`
- `created_at`
- `updated_at`

### Questions Table
- `id` (Primary Key)
- `title`
- `content`
- `author_id` (Foreign Key)
- `upvotes`
- `downvotes`
- `views`
- `is_answered`
- `created_at`
- `updated_at`

### Question Tags Table
- `question_id` (Foreign Key)
- `tag`

### Question Images Table
- `question_id` (Foreign Key)
- `image_url`

### Answers Table
- `id` (Primary Key)
- `content`
- `question_id` (Foreign Key)
- `author_id` (Foreign Key)
- `upvotes`
- `downvotes`
- `is_accepted`
- `created_at`
- `updated_at`

### Comments Table
- `id` (Primary Key)
- `content`
- `author_id` (Foreign Key)
- `question_id` (Foreign Key, nullable)
- `answer_id` (Foreign Key, nullable)
- `upvotes`
- `downvotes`
- `created_at`
- `updated_at`

## 🔧 Configuration

### Application Properties
- **Server Port**: 8080
- **Context Path**: /api
- **Database**: H2 In-Memory
- **JWT Secret**: bisaSecretKey2024ForJWTTokenGenerationAndValidation
- **JWT Expiration**: 24 hours
- **File Upload**: Max 10MB

### CORS Configuration
- All origins allowed for development
- All HTTP methods allowed
- All headers allowed

## 🔐 Security

- **JWT-based authentication**
- **Password encryption** with BCrypt
- **Role-based access control**
- **CORS protection**
- **Input validation**

## 📦 Project Structure

```
src/main/java/com/bisa/
├── BisaBackendApplication.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── QuestionController.java
│   ├── AnswerController.java
│   └── CommentController.java
├── entity/
│   ├── User.java
│   ├── Question.java
│   ├── Answer.java
│   └── Comment.java
├── dto/
│   ├── UserDto.java
│   ├── QuestionDto.java
│   ├── AnswerDto.java
│   └── CommentDto.java
├── repository/
│   ├── UserRepository.java
│   ├── QuestionRepository.java
│   ├── AnswerRepository.java
│   └── CommentRepository.java
├── service/
│   ├── UserService.java
│   ├── QuestionService.java
│   ├── AnswerService.java
│   └── CommentService.java
└── security/
    ├── JwtTokenProvider.java
    ├── UserPrincipal.java
    └── SecurityConfig.java
```

## 🚀 Deployment

### Development
```bash
mvn spring-boot:run
```

### Production
```bash
mvn clean package
java -jar target/bisa-backend-0.0.1-SNAPSHOT.jar
```

## 🔗 Frontend Integration

The backend is designed to work seamlessly with the React Native frontend. Update your frontend API calls to use the new endpoints:

- Base URL: `http://localhost:8080/api`
- Authentication: Include JWT token in Authorization header
- Content-Type: application/json for requests

## 📝 Notes

- H2 database is in-memory and data will be lost on restart
- For production, consider using PostgreSQL or MySQL
- JWT tokens expire after 24 hours
- File uploads are stored as URLs (consider cloud storage for production)
- All endpoints return JSON responses
- Error responses include appropriate HTTP status codes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 