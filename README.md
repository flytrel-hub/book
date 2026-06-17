# Лабораторная работа №10: Проектирование микросервисной архитектуры

## Проект: Book Library (Микросервисы)

### Архитектура

```
                    ┌─────────────────┐
                    │   Web Browser   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Nginx Gateway  │
                    │     (:80)       │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼─────────┐ ┌─────▼──────┐ ┌─────────▼─────────┐
│ Authors Service   │ │ Categories │ │ Books Service     │
│ Node.js :3001     │ │ :3002      │ │ Node.js :3003     │
└─────────┬─────────┘ └─────┬──────┘ └─────────┬─────────┘
          │                  │                  │
┌─────────▼─────────┐ ┌─────▼──────┐ ┌─────────▼─────────┐
│ PostgreSQL        │ │ PostgreSQL │ │ PostgreSQL        │
│ (authors)         │ │ (categories│ │ (books)           │
└───────────────────┘ └────────────┘ └───────────────────┘
```

### Микросервисы

| Сервис | Порт | БД | Зона ответственности |
|--------|------|----|---------------------|
| Authors | 3001 | PostgreSQL (authors) | CRUD авторов |
| Categories | 3002 | PostgreSQL (categories) | CRUD категорий |
| Books | 3003 | PostgreSQL (books) | CRUD книг |
| Nginx Gateway | 80 | — | Маршрутизация, статика |

### API Эндпоинты

| Сервис | Метод | URL | Описание |
|--------|-------|-----|----------|
| Authors | GET | /api/authors | Список авторов |
| Authors | GET | /api/authors/:id | Автор по ID |
| Authors | POST | /api/authors | Создать автора |
| Categories | GET | /api/categories | Список категорий |
| Categories | POST | /api/categories | Создать категорию |
| Books | GET | /api/books | Список книг |
| Books | GET | /api/books/:id | Книга по ID |
| Books | POST | /api/books | Создать книгу |
| Books | PUT | /api/books/:id | Обновить книгу |
| Books | DELETE | /api/books/:id | Удалить книгу |

### Технологии

| Компонент | Технология | Обоснование |
|-----------|-----------|-------------|
| Authors Service | Node.js + Express | Быстрая разработка REST API |
| Categories Service | Node.js + Express | Простота, единый стек |
| Books Service | Node.js + Express | Основной сервис, CRUD |
| API Gateway | Nginx | Высокая производительность, проксирование |
| Базы данных | PostgreSQL (3 шт.) | ACID, надёжность, изоляция данных |

### Запуск

```bash
docker-compose up --build
```

Откроется:
- **Веб-интерфейс:** http://localhost
- **Authors API:** http://localhost/api/authors
- **Categories API:** http://localhost/api/categories
- **Books API:** http://localhost/api/books

### Взаимодействие

- **Синхронное (HTTP):** Клиент → Gateway → Сервисы
- Каждый сервис работает с **своей** базой данных
- Gateway маршрутизирует по URL-префиксам

### Структура файлов

```
prod/
├── docker-compose.yml
├── .dockerignore
├── README.md
├── docs/
│   └── architecture.puml
├── gateway/
│   └── nginx.conf
├── public/
│   └── index.html
└── services/
    ├── authors/
    │   ├── Dockerfile
    │   ├── package.json
    │   └── index.js
    ├── categories/
    │   ├── Dockerfile
    │   ├── package.json
    │   └── index.js
    └── books/
        ├── Dockerfile
        ├── package.json
        └── index.js
```

### Паттерны

| Паттерн | Применение |
|---------|-----------|
| API Gateway | Единая точка входа, маршрутизация |
| Database per Service | Изоляция данных каждого сервиса |
| Health Check | /health эндпоинт в каждом сервисе |
