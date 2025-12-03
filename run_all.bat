@echo off
setlocal enabledelayedexpansion
color 0A

echo ========================================
echo    TuniStudent - Complete Startup
echo ========================================
echo.

REM Check if Docker is running
echo [1/7] Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running! Please start Docker Desktop first.
    pause
    exit /b 1
)
echo [OK] Docker is running

REM Check if Maven is installed
echo [2/7] Checking Maven...
mvn --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Maven is not installed or not in PATH!
    pause
    exit /b 1
)
echo [OK] Maven is installed

REM Check if Node.js is installed
echo [3/7] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH!
    pause
    exit /b 1
)
echo [OK] Node.js is installed
echo.

REM Start Docker services (Keycloak + PostgreSQL)
echo [4/7] Starting Docker Services (Keycloak + PostgreSQL)...
docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start Docker services!
    pause
    exit /b 1
)
echo [OK] Docker services started
echo Waiting 20 seconds for Keycloak to initialize...
timeout /t 20 /nobreak
echo.

REM Start Discovery Server
echo [5/7] Starting Discovery Server (Eureka)...
start "Discovery Server" cmd /k "color 0B && echo Discovery Server && cd discovery-server && mvn spring-boot:run"
echo Waiting 20 seconds for Discovery Server to start...
timeout /t 20 /nobreak
echo [OK] Discovery Server started
echo.

REM Start API Gateway
echo [6/7] Starting API Gateway...
start "API Gateway" cmd /k "color 0C && echo API Gateway && cd api-gateway && mvn spring-boot:run"
echo Waiting 15 seconds for API Gateway to start...
timeout /t 15 /nobreak
echo [OK] API Gateway started
echo.

REM Start all microservices
echo [7/7] Starting Microservices...

echo   - Starting User Service...
start "User Service" cmd /k "color 0D && echo User Service && cd user-service && mvn spring-boot:run"
timeout /t 3 /nobreak

echo   - Starting Deal Service...
start "Deal Service" cmd /k "color 0E && echo Deal Service && cd deal-service && mvn spring-boot:run"
timeout /t 3 /nobreak

echo   - Starting Notification Service...
start "Notification Service" cmd /k "color 09 && echo Notification Service && cd notification-service && mvn spring-boot:run"
timeout /t 3 /nobreak

echo   - Starting Backend (Main Service)...
start "TuniStudent Backend" cmd /k "color 0A && echo TuniStudent Backend && cd backend && mvn spring-boot:run"
echo.
echo Waiting 20 seconds for all microservices to initialize...
timeout /t 20 /nobreak
echo [OK] All microservices started
echo.

REM Start Frontend
echo Starting Frontend (Angular)...
start "TuniStudent Frontend" cmd /k "color 0F && echo TuniStudent Frontend && cd frontend && npm start"
echo.

echo ========================================
echo   ALL SERVICES STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Service URLs:
echo ----------------------------------------
echo Discovery Server:     http://localhost:8761
echo API Gateway:          http://localhost:8080
echo Keycloak Admin:       http://localhost:8081
echo   - Username: admin
echo   - Password: admin
echo Frontend:             http://localhost:4200
echo ----------------------------------------
echo.
echo Backend Services (via Gateway):
echo   - User Service:         http://localhost:8080/api/users
echo   - Deal Service:         http://localhost:8080/api/deals
echo   - Notification Service: http://localhost:8080/api/notifications
echo ----------------------------------------
echo.
echo TIP: Check Discovery Server (http://localhost:8761) to verify all services are registered.
echo.
echo Press any key to open the application in your browser...
pause >nul
start http://localhost:4200
echo.
echo To stop all services:
echo 1. Close all the opened command windows
echo 2. Run: docker-compose down
echo.
pause
