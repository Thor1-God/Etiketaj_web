# Этикетаж

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003b57?logo=sqlite&logoColor=white)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-c9a84c)](LICENSE)

Веб-приложение для ведения базы картин и генерации этикеток для художественных выставок.

---

## Возможности

| | |
|---|---|
| **База данных** | ФИО художника, годы жизни, год создания, название, материал, техника, размер |
| **Поиск** | По фамилии, имени, названию, инвентарному номеру — мгновенно с дебаунсом |
| **Художники** | Дерево авторов с раскрывающимися списками работ, клик — фильтрация таблицы |
| **Сортировка** | По любому столбцу, клик по заголовку таблицы, направление ↑↓ |
| **Автозаполнение** | При вводе фамилии подставляет имя, отчество и годы жизни из базы |
| **Выпадающие списки** | Материал и техника с готовыми вариантами + ввод своего значения |
| **Предпросмотр** | Этикетка обновляется в реальном времени при вводе данных |
| **Генерация .docx** | Word-файл A4, один столбец, зазоры для разрезки, Times New Roman |

---

## Быстрый старт

### Требования

| Инструмент | Версия |
|---|---|
| Python | 3.10+ |
| Node.js | 18+ |
| npm `docx` (глобально) | `npm install -g docx` |

### Linux / macOS

```bash
https://github.com/Thor1-God/Etiketaj_web.git
cd etiketaj
chmod +x start.sh && ./start.sh
```

### Windows

```bat
https://github.com/Thor1-God/Etiketaj_web.git
cd etiketaj
start.bat
```

Скрипт автоматически создаёт виртуальное окружение Python, устанавливает зависимости и запускает оба сервера.

Откройте [http://localhost:5173](http://localhost:5173)

> Swagger / интерактивная документация API: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

## Ручной запуск

```bash
# Терминал 1 — бэкенд
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000

# Терминал 2 — фронтенд
cd frontend
npm install
npm run dev
```

---

## Структура проекта

```
etikej/
│
├── backend/                        # Python FastAPI
│   ├── main.py                     # Приложение, CORS, инициализация БД
│   ├── database.py                 # SQLAlchemy, сессия, тестовые данные
│   ├── models.py                   # ORM-модель Painting
│   ├── schemas.py                  # Pydantic-схемы (валидация)
│   ├── routes/
│   │   ├── paintings.py            # CRUD + поиск + художники
│   │   └── generate.py             # POST /api/generate → .docx
│   └── requirements.txt
│
├── docx-gen/
│   └── generate.js                 # Node.js скрипт генерации Word-файла
│
├── frontend/                       # React + Vite
│   ├── index.html
│   ├── vite.config.js              # Proxy /api → localhost:8000
│   └── src/
│       ├── App.jsx                 # Только импорты и компоновка
│       ├── App.module.css
│       ├── main.jsx
│       │
│       ├── api/
│       │   └── index.js            # Все fetch-запросы к API
│       │
│       ├── store/
│       │   └── index.js            # Zustand — весь глобальный стейт
│       │
│       ├── hooks/
│       │   ├── useDebounce.js      # Дебаунс значения
│       │   └── useSearch.js        # Дебаунсированный поиск + фильтры
│       │
│       ├── styles/
│       │   └── globals.css         # CSS-переменные, тёмная тема, сброс
│       │
│       └── components/
│           ├── layout/
│           │   ├── Header.jsx      # Шапка — логотип + статистика
│           │   └── Sidebar.jsx     # Дерево художников
│           ├── database/
│           │   ├── DbTable.jsx     # Таблица картин с сортировкой
│           │   └── Toolbar.jsx     # Поиск + сортировка + кнопка «Новая»
│           ├── form/
│           │   ├── PaintingForm.jsx  # Форма добавления / редактирования
│           │   ├── LabelPreview.jsx  # Живой предпросмотр этикетки
│           │   └── formUtils.js      # Константы, validate, маппинг
│           ├── labels/
│           │   ├── LabelList.jsx   # Нижняя панель: список + генерация
│           │   └── LabelCard.jsx   # Карточка одной этикетки
│           └── ui/
│               └── Spinner.jsx     # Индикатор загрузки
│
├── start.sh                        # Запуск Linux / macOS
├── start.bat                       # Запуск Windows
└── .gitignore
```

---

## API

| Метод | URL | Описание |
|-------|-----|----------|
| `GET` | `/api/paintings` | Список с фильтрами и сортировкой |
| `GET` | `/api/paintings/artists` | Художники + их работы |
| `GET` | `/api/paintings/{id}` | Одна запись |
| `POST` | `/api/paintings` | Создать |
| `PUT` | `/api/paintings/{id}` | Обновить |
| `DELETE` | `/api/paintings/{id}` | Удалить |
| `POST` | `/api/generate` | Скачать .docx |

**Параметры `GET /api/paintings`:**

| Параметр | Описание |
|---|---|
| `search` | По фамилии, имени, названию, инв. номеру |
| `inv` | По инвентарному номеру |
| `artist` | Фильтр по фамилии художника |
| `sort` | `last_name` / `year` / `title` / `inventory_number` / `birth_year` |
| `dir` | `asc` / `desc` |

Полная интерактивная документация: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

## Поля базы данных

| Поле | Обяз. | Описание | Пример |
|---|:---:|---|---|
| `inventory_number` | | Инвентарный номер | КП-001 |
| `last_name` | ✓ | Фамилия | Репин |
| `first_name` | | Имя | Илья |
| `patronymic` | | Отчество | Ефимович |
| `birth_year` | | Год рождения | 1844 |
| `death_year` | | Год смерти | 1930 |
| `year` | ✓ | Год создания | 1884 |
| `title` | ✓ | Название | Не ждали |
| `material` | | Материал | Холст |
| `technique` | | Техника | Масло |
| `size` | | Размер | 160×167 см |
| `notes` | | Примечания (не печатаются) | — |

---

## Формат этикетки

```
┌────────────────────────────────────────────────┐
│                                                │
│       Репин Илья Ефимович (1844–1930)          │  жирный, 14pt
│             «Не ждали», 1884 г.                │  курсив, 13pt
│                 Холст, масло                   │  11pt
│                 160×167 см                     │  10pt
│                                       КП-001   │  серый, 8pt
│                                                │
└────────────────────────────────────────────────┘
```

Документ: A4, поля 2 см, один столбец, зазор ~0.6 см между этикетками (линия разреза). Незаполненные строки не печатаются.

---

## База данных

Файл `backend/exhibition.db` создаётся автоматически при первом запуске с 10 примерами картин.

**Резервная копия:** скопируйте `exhibition.db`. Для восстановления — положите обратно.

---

## Стек

**Backend:** Python 3.10+, FastAPI, SQLAlchemy 2, SQLite, Pydantic v2

**Frontend:** React 18, Vite 5, Zustand, CSS Modules

**Генерация Word:** Node.js + npm-пакет `docx`

---

## Лицензия

MIT
