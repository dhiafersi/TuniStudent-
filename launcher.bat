@echo off
setlocal
:menu
cls
color 0B
echo.
echo  ========================================
echo     TuniStudent - Project Manager
echo  ========================================
echo.
echo  1. Start All Services
echo  2. Stop All Services
echo  3. Check Status
echo  4. Rebuild All Services
echo  5. Open Frontend (http://localhost:4200)
echo  6. Open Discovery Server (http://localhost:8761)
echo  7. Open Keycloak Admin (http://localhost:8081)
echo  8. View Documentation
echo  9. Exit
echo.
echo  ========================================
echo.
set /p choice="Select an option (1-9): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto status
if "%choice%"=="4" goto rebuild
if "%choice%"=="5" goto frontend
if "%choice%"=="6" goto discovery
if "%choice%"=="7" goto keycloak
if "%choice%"=="8" goto docs
if "%choice%"=="9" goto exit

echo Invalid option. Please try again.
timeout /t 2 >nul
goto menu

:start
cls
call run_all.bat
goto menu

:stop
cls
call stop_all.bat
goto menu

:status
cls
call check_status.bat
goto menu

:rebuild
cls
call rebuild_all.bat
goto menu

:frontend
start http://localhost:4200
echo Opening Frontend...
timeout /t 2 >nul
goto menu

:discovery
start http://localhost:8761
echo Opening Discovery Server...
timeout /t 2 >nul
goto menu

:keycloak
start http://localhost:8081
echo Opening Keycloak Admin Console...
timeout /t 2 >nul
goto menu

:docs
cls
type SCRIPTS_README.md
echo.
echo.
pause
goto menu

:exit
echo.
echo Goodbye!
timeout /t 1 >nul
exit
