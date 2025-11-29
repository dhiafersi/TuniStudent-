# TuniStudent

Full-stack app to help Tunisian students discover the best local deals across 24 cities.

## Tech
- Backend: Spring Boot 3, Spring Security (JWT), JPA, MySQL
- Frontend: Angular 17 (standalone), Tailwind, Angular Material (optional)

## Quick Start

### Backend
1. Create MySQL database or let it auto-create.
2. Copy `application.properties.example` to `application.properties`:
   ```bash
   cd backend/src/main/resources
   copy application.properties.example application.properties
   ```
3. Update `backend/src/main/resources/application.properties`:
   - `spring.datasource.username` and `spring.datasource.password`
   - `tunistudent.jwt.secret` (base64-encoded long secret)
   - Generate a secure JWT secret: `openssl rand -base64 32`
4. Build & run:
```bash
cd backend
mvn spring-boot:run
```
Backend on http://localhost:8080

Seeded users:
- admin / admin123 (ROLE_ADMIN)
- student / student123 (ROLE_STUDENT)

OpenAPI docs: http://localhost:8080/swagger-ui/index.html

### Frontend
1. Install deps and start
```bash
cd frontend
npm install
npm run start
```
Frontend on http://localhost:4200

## Configuration
- Backend: Copy `application.properties.example` to `application.properties` and configure your settings
- Frontend services point to `http://localhost:8080` by default

## Features
- Register/Login (JWT)
- List cities, categories
- Deals listing (search, by city/category), details
- Rate deals (1..5)
- Favorites for logged-in users
- Admin CRUD for deals/categories (secured on backend)

## Notes
- Tailwind enabled for dark, glassmorphism UI.
- Add more polish (toasts, loaders, pagination) in a follow-up.

