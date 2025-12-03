@echo off
setlocal enabledelayedexpansion
color 0D

echo ========================================
echo   Clean Build All Microservices
echo ========================================
echo.

echo This will rebuild all microservices from scratch.
echo This may take several minutes...
echo.
pause

echo [1/5] Building Discovery Server...
cd discovery-server
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Failed to build Discovery Server!
    pause
    exit /b 1
)
cd ..
echo [OK] Discovery Server built
echo.

echo [2/5] Building API Gateway...
cd api-gateway
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Failed to build API Gateway!
    pause
    exit /b 1
)
cd ..
echo [OK] API Gateway built
echo.

echo [3/5] Building User Service...
cd user-service
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Failed to build User Service!
    pause
    exit /b 1
)
cd ..
echo [OK] User Service built
echo.

echo [4/5] Building Deal Service...
cd deal-service
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Failed to build Deal Service!
    pause
    exit /b 1
)
cd ..
echo [OK] Deal Service built
echo.

echo [5/5] Building Notification Service...
cd notification-service
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Failed to build Notification Service!
    pause
    exit /b 1
)
cd ..
echo [OK] Notification Service built
echo.

echo Building Main Backend...
cd backend
call mvn clean install -DskipTests
if errorlevel 1 (
    echo [ERROR] Failed to build Backend!
    pause
    exit /b 1
)
cd ..
echo [OK] Backend built
echo.

echo ========================================
echo   All services built successfully!
echo ========================================
echo.
echo You can now run: run_all.bat
echo.
pause
