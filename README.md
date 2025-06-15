# Flipping Card Game - Backend

Spring Boot backend for the Flipping Card Game application.

## Features
- User authentication (JWT)
- Score tracking
- Theme management
- Leaderboard

## Tech Stack
- Java 17
- Spring Boot 3.1.0
- MySQL
- JWT Authentication
- Swagger API Documentation

## Database Setup
1. Run initialization script:
```bash
mysql -u root -p < init_db.sql
```

2. Configure database in `application.properties`

## API Documentation
After starting the application, access Swagger UI at:
http://localhost:3000/swagger-ui.html

## Endpoints
- `GET /api/users` - Get all users
- `GET /api/scores/{userId}` - Get user scores
- `GET /api/themes` - Get all themes
