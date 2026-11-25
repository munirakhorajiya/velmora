@echo off
title Velmora Full-Stack Runner
color 0A

echo ========================================================
echo         VELMORA ATELIER - FULL STACK RUNNER
echo ========================================================
echo.
echo [1/3] Starting Django Headless REST API (Port 8000)...
set "PY_CMD=python"
if exist "%~dp0velmora\.venv\Scripts\python.exe" set "PY_CMD=.venv\Scripts\python.exe"
if exist "%~dp0velmora\venv\Scripts\python.exe" set "PY_CMD=venv\Scripts\python.exe"
start "Velmora Django API" cmd /k "cd /d %~dp0velmora && %PY_CMD% manage.py runserver 127.0.0.1:8000"

echo [2/3] Waiting 2 seconds for API to initialize...
timeout /t 2 /nobreak > nul

echo [3/3] Starting React Vite Frontend (Port 5173)...
start "Velmora React Frontend" cmd /k "cd /d %~dp0frontend && pnpm dev --open"

echo.
echo ========================================================
echo Velmora is running!
echo - React Frontend:  http://localhost:5173/
echo - Django REST API: http://127.0.0.1:8000/api/v1/
echo - Django Admin:    http://127.0.0.1:8000/admin/
echo ========================================================
echo Close the two command windows whenever you wish to stop.
