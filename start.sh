#!/usr/bin/env bash
# Запускает бэкенд и фронтенд одновременно.
# Ctrl+C останавливает оба процесса.

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

# ── проверки ──────────────────────────────────────────────────────────────────
command -v python3 >/dev/null 2>&1 || { echo "❌  python3 не найден"; exit 1; }
command -v node    >/dev/null 2>&1 || { echo "❌  node не найден";    exit 1; }
command -v npm     >/dev/null 2>&1 || { echo "❌  npm не найден";     exit 1; }

# Проверить/установить npm-пакет docx глобально
node -e "require('docx')" 2>/dev/null || {
  echo "⚙️  Устанавливаем npm-пакет docx..."
  npm install -g docx
}

# ── виртуальное окружение ─────────────────────────────────────────────────────
if [ ! -d "$ROOT/.venv" ]; then
  echo "⚙️  Создаём виртуальное окружение Python..."
  python3 -m venv "$ROOT/.venv"
fi
source "$ROOT/.venv/bin/activate"
pip install -q -r "$ROOT/backend/requirements.txt"

# ── frontend зависимости ──────────────────────────────────────────────────────
if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "⚙️  Устанавливаем npm-пакеты..."
  (cd "$ROOT/frontend" && npm install)
fi

# ── запуск ────────────────────────────────────────────────────────────────────
echo ""
echo "  Бэкенд  →  http://localhost:8000"
echo "  Фронтенд →  http://localhost:5173"
echo "  Swagger  →  http://localhost:8000/api/docs"
echo "  Ctrl+C для остановки"
echo ""

trap 'kill 0' SIGINT SIGTERM

(cd "$ROOT" && uvicorn backend.main:app --reload --port 8000) &
(cd "$ROOT/frontend" && npm run dev) &

wait
