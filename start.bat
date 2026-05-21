@echo off
chcp 1251 > nul
cd /d "%~dp0"

echo.
echo   Этикетаж
echo   ========
echo.

REM Проверяем venv в папке backend
if not exist "backend\venv\Scripts\activate.bat" (
    echo Ошибка: venv не найден в backend\venv
    pause
    exit /b 1
)

echo Запуск серверов...
echo   Бэкенд  -> http://localhost:8000
echo   Фронтенд -> http://localhost:5173
echo   Swagger -> http://localhost:8000/api/docs
echo.

REM Запуск бэкенда (venv в папке backend)
start "Backend" cmd /k "cd backend && venv\Scripts\activate.bat && uvicorn main:app --port 8000"

REM Запуск фронтенда
start "Frontend" cmd /k "cd frontend && npm run dev"

echo Серверы запущены. Закройте окна для остановки.
pause