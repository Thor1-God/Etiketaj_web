#!/usr/bin/env bash
# Запускает бэкенд и фронтенд одновременно.
# Ctrl+C останавливает оба процесса.

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── проверки ──────────────────────────────────────────────────────────────────
command -v python3 >/dev/null 2>&1 || { echo "❌ python3 не найден"; exit 1; }
command -v node    >/dev/null 2>&1 || { echo "❌ node не найден";    exit 1; }

# ── проверка venv ────────────────────────────────────────────────────────────
if [ ! -d "$ROOT/backend/venv" ]; then
    echo "❌ Виртуальное окружение не найдено в backend/venv"
    echo "Запустите ./install.sh для установки"
    exit 1
fi

# ── запуск ────────────────────────────────────────────────────────────────────
echo ""
echo "  Этикетаж"
echo "  ========"
echo ""
echo "  Бэкенд  →  http://localhost:8000"
echo "  Фронтенд →  http://localhost:5173"
echo "  Swagger  →  http://localhost:8000/api/docs"
echo "  Ctrl+C для остановки"
echo ""

trap 'kill 0' SIGINT SIGTERM

# Запуск бэкенда из корня
(cd "$ROOT" && source backend/venv/bin/activate && uvicorn backend.main:app --reload --port 8000) &

# Запуск фронтенда
(cd "$ROOT/frontend" && npm run dev) &

wait