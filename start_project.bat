@echo off
echo Starting TuniStudent Project...

echo Starting Keycloak (Docker)...
docker-compose up -d

echo Starting Backend (Spring Boot)...
start "TuniStudent Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Starting Frontend (Angular)...
start "TuniStudent Frontend" cmd /k "cd frontend && npm start"

echo Project started!
echo Keycloak: http://localhost:8081
echo Backend: http://localhost:8080
echo Frontend: http://localhost:4200
pause
