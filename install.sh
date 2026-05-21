#!/bin/bash

# Этикетаж — установка (Linux/Mac)
echo ""
echo "  Этикетаж"
echo "  ========="
echo ""

# Переход в папку скрипта
cd "$(dirname "$0")"

# Проверка Python
if ! command -v python3 &> /dev/null; then
    echo "[ERR] python3 не найден"
    exit 1
fi
echo "[OK] Python найден"

# Проверка Node
if ! command -v node &> /dev/null; then
    echo "[ERR] node не найден"
    exit 1
fi
echo "[OK] Node найден"
echo ""

# Виртуальное окружение в папке backend
if [ ! -f "backend/venv/bin/activate" ]; then
    echo "Создаём виртуальное окружение в backend/venv..."
    cd backend
    python3 -m venv venv
    cd ..
fi
echo "[OK] Виртуальное окружение готово"

# Зависимости Python
echo "Устанавливаем зависимости Python..."
cd backend
source venv/bin/activate
pip install -q -r requirements.txt
cd ..
echo "[OK] Python зависимости установлены"

# Зависимости фронтенда
if [ ! -d "frontend/node_modules" ]; then
    echo "Устанавливаем npm-пакеты..."
    cd frontend
    npm install
    cd ..
else
    echo "[OK] npm-пакеты уже установлены"
fi

echo ""
echo "Установка завершена!"
echo "Запустите ./start.sh для старта серверов"