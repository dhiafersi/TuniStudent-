@echo off
setlocal
color 0C

echo ========================================
echo      Stopping All TuniStudent Services
echo ========================================
echo.

echo Stopping Docker services (Keycloak + PostgreSQL)...
docker-compose down
echo [OK] Docker services stopped
echo.

echo Stopping all Java processes (Spring Boot)...
taskkill /F /FI "IMAGENAME eq java.exe" /FI "WINDOWTITLE eq *Service*" 2>nul
taskkill /F /FI "IMAGENAME eq java.exe" /FI "WINDOWTITLE eq *Discovery*" 2>nul
taskkill /F /FI "IMAGENAME eq java.exe" /FI "WINDOWTITLE eq *Gateway*" 2>nul
taskkill /F /FI "IMAGENAME eq java.exe" /FI "WINDOWTITLE eq *Backend*" 2>nul
echo [OK] Java processes stopped
echo.

echo Stopping Node.js processes (Angular)...
taskkill /F /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq *Frontend*" 2>nul
echo [OK] Node.js processes stopped
echo.

echo ========================================
echo   All services have been stopped!
echo ========================================
echo.
pause
