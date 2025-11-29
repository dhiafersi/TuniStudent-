@echo off
echo Starting TuniStudent Microservices...

echo Starting Keycloak (Docker)...
docker-compose up -d

echo Starting Discovery Server...
start "Discovery Server" cmd /k "cd discovery-server && mvn spring-boot:run"
timeout /t 15

echo Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"
timeout /t 10

echo Starting User Service...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"

echo Starting Deal Service...
start "Deal Service" cmd /k "cd deal-service && mvn spring-boot:run"

echo Starting Notification Service...
start "Notification Service" cmd /k "cd notification-service && mvn spring-boot:run"

echo Starting Frontend...
start "TuniStudent Frontend" cmd /k "cd frontend && npm start"

echo Microservices started!
echo Discovery: http://localhost:8761
echo Gateway: http://localhost:8080
echo Frontend: http://localhost:4200
pause
