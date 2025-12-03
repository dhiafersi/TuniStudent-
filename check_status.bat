@echo off
setlocal enabledelayedexpansion
color 0E

echo ========================================
echo   Checking TuniStudent Services Status
echo ========================================
echo.

echo Checking Docker Services...
echo ----------------------------------------
docker-compose ps
echo.

echo Checking Discovery Server (Port 8761)...
echo ----------------------------------------
curl -s http://localhost:8761/actuator/health >nul 2>&1
if errorlevel 1 (
    echo [X] Discovery Server is NOT running
) else (
    echo [OK] Discovery Server is running
)
echo.

echo Checking API Gateway (Port 8080)...
echo ----------------------------------------
curl -s http://localhost:8080/actuator/health >nul 2>&1
if errorlevel 1 (
    echo [X] API Gateway is NOT running
) else (
    echo [OK] API Gateway is running
)
echo.

echo Checking Keycloak (Port 8081)...
echo ----------------------------------------
curl -s http://localhost:8081 >nul 2>&1
if errorlevel 1 (
    echo [X] Keycloak is NOT running
) else (
    echo [OK] Keycloak is running
)
echo.

echo Checking Frontend (Port 4200)...
echo ----------------------------------------
curl -s http://localhost:4200 >nul 2>&1
if errorlevel 1 (
    echo [X] Frontend is NOT running
) else (
    echo [OK] Frontend is running
)
echo.

echo Running Java Processes:
echo ----------------------------------------
tasklist /FI "IMAGENAME eq java.exe" /FO TABLE 2>nul | findstr "java.exe"
echo.

echo Running Node Processes:
echo ----------------------------------------
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE 2>nul | findstr "node.exe"
echo.

echo ========================================
echo   Open Eureka Dashboard for full status:
echo   http://localhost:8761
echo ========================================
echo.
pause
