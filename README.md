# 🚀 Bisa - Quora Clone Project

A full-stack mobile application built with React Native (Expo) frontend and Spring Boot backend, featuring user authentication, post management, fact-checking, and social features.

## 📋 Prerequisites

Before running the project, make sure you have the following installed:

### **Required Software:**
- **Java 17** or higher - [Download here](https://adoptium.net/)
- **Node.js 18** or higher - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### **Optional (for mobile testing):**
- **Expo Go** app on your phone - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🛠️ Installation & Setup

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/Genesis-Z-R/Group-39.git
cd Group-39
```

### **Step 2: Backend Setup**

#### **Navigate to Backend Directory:**
```bash
cd Mobile-App-Project-backend
```

#### **Run the Backend:**
```bash
# On Windows:
.\mvnw.cmd spring-boot:run

# On macOS/Linux:
./mvnw spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.5.3)

2024-01-XX XX:XX:XX.XXX  INFO 1234 --- [main] com.bisa.BisaApplication : Starting BisaApplication...
2024-01-XX XX:XX:XX.XXX  INFO 1234 --- [main] com.bisa.BisaApplication : Started BisaApplication in X.XXX seconds
```

**Backend will be available at:** `http://localhost:8080`

### **Step 3: Frontend Setup**

#### **Open a New Terminal Window and Navigate to Frontend:**
```bash
cd Mobile-App-Project-G39-frontend
```

#### **Install Dependencies:**
```bash
npm install
```

#### **Start the Frontend:**
```bash
npm start
```

**Expected Output:**
```
› Metro waiting on exp://192.168.1.XXX:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
› Press d │ open developer tools
› Press r │ reload app
› Press m │ toggle menu
```

## 📱 How to Access the App

### **Option 1: Mobile Device (Recommended)**
1. Install **Expo Go** app on your phone
2. Scan the QR code shown in the terminal
3. The app will load on your device

### **Option 2: Web Browser**
1. Press `w` in the terminal where Expo is running
2. App will open in your browser at `http://localhost:19006`

### **Option 3: Simulator/Emulator**
- **iOS Simulator:** Press `i` (macOS only)
- **Android Emulator:** Press `a` (requires Android Studio)

## 🔧 Troubleshooting

### **Backend Issues:**

#### **Port 8080 Already in Use:**
```bash
# Check what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace XXXX with the PID)
taskkill /PID XXXX /F
```

#### **Maven Wrapper Not Found:**
```bash
# If mvnw.cmd doesn't exist, use Maven directly
mvn spring-boot:run
```

#### **Java Version Issues:**
```bash
# Check Java version
java -version

# Should show Java 17 or higher
```

### **Frontend Issues:**

#### **Dependencies Not Installing:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Expo Issues:**
```bash
# Clear Expo cache
npx expo start --clear

# Or reset completely
npx expo install --fix
```

#### **Network Issues:**
```bash
# If you can't connect from phone, try:
npx expo start --tunnel
```

## 🌟 Features to Demo

Once the app is running, you can showcase:

### **Core Features:**
- 🔐 **Authentication** - Login/Register with Firebase
- 📝 **Post Management** - Create, read, update posts
- 👤 **User Profiles** - View and edit user profiles
- 🔗 **Follow System** - Follow/unfollow users
- 💬 **Comments** - Add and view comments on posts
- 👍 **Upvoting** - Like and upvote posts

### **Advanced Features:**
- 🤖 **AI Fact-Checking** - Verify post content with AI
- 📊 **Share Analytics** - Track post sharing metrics
- 🎨 **Modern UI** - Responsive design with NativeWind
- 📱 **Cross-Platform** - Works on iOS, Android, and Web

### **Demo Flow:**
1. **Login/Register** - Show authentication
2. **Browse Feed** - Display posts with "Read More" functionality
3. **User Profiles** - Click on user avatars to see profiles
4. **Post Details** - Show full-screen post view
5. **Interactions** - Demonstrate follow, comment, upvote features
6. **Fact-Checking** - Show AI-powered content verification

## 📁 Project Structure

```
bisa/
├── Mobile-App-Project-backend/     # Spring Boot Backend
│   ├── src/main/java/com/bisa/
│   │   ├── controller/             # REST API endpoints
│   │   ├── service/                # Business logic
│   │   ├── repository/             # Data access layer
│   │   ├── model/                  # Entity classes
│   │   └── config/                 # Configuration
│   └── pom.xml                     # Maven dependencies
├── Mobile-App-Project-G39-frontend/ # React Native Frontend
│   ├── app/                        # Expo Router screens
│   ├── src/
│   │   ├── services/               # API calls
│   │   ├── context/                # React Context
│   │   └── types/                  # TypeScript interfaces
│   └── package.json                # Node.js dependencies
└── README.md                       # This file
```

## 🔗 API Endpoints

### **Authentication:**
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user details

### **Posts:**
- `GET /api/posts` - Get all posts
- `GET /api/posts/{id}/detail` - Get post details
- `POST /api/posts/{id}/view` - Track post view
- `GET /api/posts/{id}/comments/paginated` - Get comments

### **User Profiles:**
- `GET /api/users/{id}/profile` - Get user profile
- `GET /api/users/{id}/posts` - Get user posts
- `POST /api/users/{id}/follow` - Follow user
- `DELETE /api/users/{id}/unfollow` - Unfollow user

### **Health Check:**
- `GET /api/hello/health` - Backend status

## 🚀 Quick Start Commands

### **For Development:**
```bash
# Terminal 1 - Backend
cd Mobile-App-Project-backend
.\mvnw.cmd spring-boot:run

# Terminal 2 - Frontend
cd Mobile-App-Project-G39-frontend
npm install
npm start
```

### **For Demo:**
```bash
# Just run frontend with mock data
cd Mobile-App-Project-G39-frontend
npm install
npm start
```

## 📞 Support

If you encounter any issues:

1. **Check the troubleshooting section above**
2. **Verify all prerequisites are installed**
3. **Ensure ports 8080 and 19006 are available**
4. **Check your network connection for mobile testing**

## 🎯 Presentation Tips

### **Before Demo:**
- Test all features beforehand
- Have backup mock data ready
- Prepare your phone with Expo Go installed
- Test network connectivity

### **During Demo:**
- Start with authentication
- Show the main feed
- Demonstrate user interactions
- Highlight the fact-checking feature
- Show cross-platform compatibility

---

**Happy coding! 🚀**

*Built with ❤️ by Group 39* 