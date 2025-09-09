# 🚀 Установка и запуск HaRry AI HR

## Предварительные требования

- **Node.js 18+** - для frontend
- **Python 3.8+** - для backend
- **npm** или **yarn** - менеджер пакетов

## Быстрый запуск

### Windows
```bash
# Запуск всех серверов одной командой
start-all.bat

# Или по отдельности:
start-backend.bat    # Backend на http://localhost:8000
start-frontend.bat   # Frontend на http://localhost:5173
```

### Linux/macOS
```bash
# Сделать скрипты исполняемыми
chmod +x *.sh

# Запуск всех серверов одной командой
./start-all.sh

# Или по отдельности:
./start-backend.sh   # Backend на http://localhost:8000
./start-frontend.sh  # Frontend на http://localhost:5173
```

## Ручная установка

### 1. Frontend (React + TypeScript)

```bash
cd frontend

# Установка зависимостей
npm install

# Создание файла .env
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# Запуск dev сервера
npm run dev
```

**Frontend будет доступен на:** http://localhost:5173

### 2. Backend (FastAPI + Python)

```bash
cd backend

# Создание виртуального окружения
python -m venv .venv

# Активация виртуального окружения
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера
uvicorn app.main:app --reload --port 8000
```

**Backend будет доступен на:** http://localhost:8000

## Проверка установки

### 1. Проверка Frontend
Откройте http://localhost:5173 в браузере. Должна загрузиться главная страница с дашбордом.

### 2. Проверка Backend
Откройте http://localhost:8000 в браузере. Должно появиться сообщение:
```json
{"message": "HaRry AI HR API is running"}
```

### 3. Проверка API
Откройте http://localhost:8000/api/interviews в браузере. Должен вернуться JSON с данными интервью.

## Возможные проблемы

### Frontend не запускается
```bash
# Очистка кэша
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend не запускается
```bash
# Проверка Python версии
python --version

# Переустановка зависимостей
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

### Ошибки CORS
Убедитесь, что backend запущен на порту 8000, а frontend на 5173.

### Ошибки WebSocket
Проверьте, что backend поддерживает WebSocket соединения.

## Структура проекта

```
HaRry/
├── frontend/          # React приложение
│   ├── src/
│   │   ├── components/ # UI компоненты
│   │   ├── pages/     # Страницы
│   │   ├── api/       # API клиент
│   │   └── types/     # TypeScript типы
│   └── package.json
├── backend/           # FastAPI сервер
│   ├── app/
│   │   ├── main.py    # Главный файл
│   │   ├── schemas.py # Pydantic модели
│   │   └── data.py    # Мок данные
│   └── requirements.txt
└── start-*.bat/sh     # Скрипты запуска
```

## Разработка

### Frontend команды
```bash
cd frontend
npm run dev      # Запуск dev сервера
npm run build    # Сборка для продакшена
npm run lint     # Проверка кода
npm run preview  # Предварительный просмотр сборки
```

### Backend команды
```bash
cd backend
uvicorn app.main:app --reload --port 8000  # Запуск с автоперезагрузкой
uvicorn app.main:app --host 0.0.0.0 --port 8000  # Запуск для всех интерфейсов
```

## Отладка

### Логи Frontend
Откройте Developer Tools в браузере (F12) и посмотрите вкладку Console.

### Логи Backend
Логи выводятся в терминал, где запущен uvicorn.

### Проверка соединения
```bash
# Проверка API
curl http://localhost:8000/api/interviews

# Проверка WebSocket
# Используйте браузерные инструменты разработчика
```

## Поддержка

Если возникли проблемы:
1. Проверьте файл `TROUBLESHOOTING.md`
2. Убедитесь, что все зависимости установлены
3. Проверьте версии Node.js и Python
4. Создайте Issue с описанием проблемы
