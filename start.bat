@echo off
echo ============================================
echo   Team Task Manager - Quick Start
echo ============================================
echo.
echo Starting Backend (Spring Boot)...
start "Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Waiting 20 seconds for backend to start...
timeout /t 20 /nobreak > nul

echo Starting Frontend (React)...
start "Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ============================================
echo   App will be ready at: http://localhost:5173
echo ============================================
pause
