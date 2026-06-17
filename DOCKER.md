# Лабораторная работа №9: Контейнеризация приложения с Docker

## Структура файлов

```
├── Dockerfile              # Образ приложения
├── docker-compose.yml      # Многоконтейнерный запуск (app + PostgreSQL)
├── .dockerignore           # Исключения при сборке
└── src/data/db.js          # Подключение к PostgreSQL
```

## Что делает

- **Контейнер app** — Node.js API (Express + Swagger)
- **Контейнер db** — PostgreSQL 16
- При запуске автоматически создаются таблицы и заполняются тестовыми данными

## Запуск

```bash
# Сборка и запуск
docker-compose up --build

# В фоне
docker-compose up --build -d

# Остановка
docker-compose down

# Удалить данные
docker-compose down -v
```

## Проверка

```bash
# API
curl http://localhost:3000/api/books

# Swagger
open http://localhost:3000/api-docs

# PostgreSQL
psql -h localhost -U postgres -d booklibrary
```

## Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 3000
CMD ["node", "src/server.js"]
```

## docker-compose.yml

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on:
      db: { condition: service_healthy }
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: booklibrary
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: pg_isready -U postgres
```

## полезные команды Docker

```bash
docker ps                        # запущенные контейнеры
docker images                    # собранные образы
docker logs book-library-app-1   # логи приложения
docker exec -it book-library-db-1 psql -U postgres  # войти в БД
docker-compose down -v           # остановить и удалить данные
```
