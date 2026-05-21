@echo off
setlocal
chcp 65001 > nul
REM ── Этикетаж — установка (Windows) ──────────────────────────────────────────────
echo.
echo   Этикетаж
echo   =========
echo.

REM Переходим в папку скрипта (корень проекта)
cd /d "%~dp0"

REM Проверить Python
python --version >nul 2>&1 || (echo [ERR] python не найден && pause && exit /b 1)
echo [OK] Python найден

REM Проверить Node
node --version >nul 2>&1 || (echo [ERR] node не найден && pause && exit /b 1)
echo [OK] Node найден
echo.

REM Виртуальное окружение в папке backend
if not exist "backend\venv\Scripts\activate.bat" (
  echo Создаём виртуальное окружение в backend\venv...
  cd backend
  python -m venv venv
  cd ..
)
echo [OK] Виртуальное окружение готово

REM Зависимости Python
echo Устанавливаем зависимости Python...
cd backend
call venv\Scripts\activate.bat
pip install -q -r requirements.txt
cd ..
echo [OK] Python зависимости установлены

REM Зависимости фронтенда
if not exist "frontend\node_modules" (
  echo Устанавливаем npm-пакеты...
  cd frontend
  npm install
  cd ..
) else (
  echo [OK] npm-пакеты уже установлены
)

echo.
echo Установка завершена!
pause