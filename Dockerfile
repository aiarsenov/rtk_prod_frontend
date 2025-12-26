# RTK Analytica Frontend - Development Dockerfile
# 
# Этот Dockerfile используется для локальной разработки.
# Он запускает Vite dev server с hot-reload.
#
# Для production используйте multi-stage build с nginx.

FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json для установки зависимостей
# (в dev режиме используем volume mount, но нужен fallback)
COPY frontend/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код (для production build)
# В dev режиме это перезаписывается volume mount
COPY frontend/ ./

# Открываем порт для Vite dev server
EXPOSE 3000

# Запускаем Vite dev server
# --host позволяет доступ извне контейнера
CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]

