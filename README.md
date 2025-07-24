# Bisa Mobile App Project

This repository contains the full-stack implementation for the Bisa mobile application, including both backend and frontend codebases.

## Project Structure

```
/My Projects/bisa/
├── Mobile-App-Project-backend/         # Spring Boot backend (Java, PostgreSQL, Firebase Auth)
├── Mobile-App-Project-G39-frontend/    # React Native frontend (Expo, TypeScript)
├── .vscode/                            # (Optional) Workspace/editor settings
├── .expo/                              # (Optional) Expo settings for React Native
```

## Backend: Mobile-App-Project-backend
- **Framework:** Spring Boot (Java)
- **Database:** PostgreSQL
- **Authentication:** Firebase
- **API:** RESTful endpoints for User, Post, Comment, Space, Follow, Notification
- **How to run:**
  1. `cd Mobile-App-Project-backend`
  2. Configure your `application.properties` and provide your own `firebase-service-account.json` (not included in repo)
  3. `mvn spring-boot:run`

## Frontend: Mobile-App-Project-G39-frontend
- **Framework:** React Native (Expo, TypeScript)
- **How to run:**
  1. `cd Mobile-App-Project-G39-frontend`
  2. `npm install`
  3. `npx expo start`

## Notes
- **Secrets:** Never commit secrets (e.g., Firebase service account keys) to the repository.
- **Validation:** Frontend handles user input validation; backend validation is recommended for production.
- **CORS:** Enabled for all origins in development; restrict for production.

## Contributing
1. Fork the repo and create a feature branch.
2. Make your changes and commit with clear messages.
3. Push and open a pull request.

---

For more details, see the README files in each subproject. 