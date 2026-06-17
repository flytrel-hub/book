# Лабораторная работа №10: Проектирование микросервисной архитектуры

## Проект: Онлайн-магазин

### 1. Микросервисы

| Сервис | Ответственность | Язык | БД | Протокол |
|--------|-----------------|------|----|----------|
| **Users** | Регистрация, авторизация, профили | Node.js | PostgreSQL | REST |
| **Products** | Каталог товаров, поиск, остатки | Python | MongoDB | REST |
| **Orders** | Создание и управление заказами | Go | PostgreSQL | REST |
| **Payments** | Обработка платежей, возвраты | Java | PostgreSQL | REST |
| **Notifications** | Email, SMS, push-уведомления | Node.js | Redis | AMQP |

### 2. Взаимодействие между сервисами

#### Синхронное (REST)

```
Клиент → Gateway → Users Service      (авторизация)
Клиент → Gateway → Products Service   (каталог)
Клиент → Gateway → Orders Service     (создание заказа)
```

#### Асинхронное (RabbitMQ)

```
Orders Service → [О заказе] → RabbitMQ
    ├── Payments Service   (обработать платёж)
    └── Notifications Service (отправить уведомление)

Payments Service → [О платеже] → RabbitMQ
    └── Orders Service     (обновить статус)
```

### 3. Диаграмма архитектуры

Файл: `docs/architecture.puml` (PlantUML)

Отобразить онлайн: https://www.plantuml.com/plantuml/uml/

### 4. Технологии и обоснование

#### Users Service (Node.js + PostgreSQL)
- **Node.js** — быстрая разработка REST API, large ecosystem
- **PostgreSQL** — ACID, целостность данных пользователей
- **JWT** — stateless авторизация

#### Products Service (Python + MongoDB)
- **Python** — аналитика, ML-рекомендации в будущем
- **MongoDB** — гибкая схема для товаров с разными атрибутами
- **Elasticsearch** — полнотекстовый поиск

#### Orders Service (Go + PostgreSQL)
- **Go** — высокая производительность, низкое потребление памяти
- **PostgreSQL** — транзакции, консистентность заказов
- **Saga-паттерн** — распределённые транзакции

#### Payments Service (Java + PostgreSQL)
- **Java** — стабильность, интеграция с банковскими API
- **PostgreSQL** — надёжность хранения финансовых данных
- **PCI DSS** — безопасность платёжных данных

#### Notifications Service (Node.js + Redis)
- **Node.js** — неблокирующий I/O для массовых рассылок
- **Redis** — очереди, кеш, публикация событий
- **RabbitMQ** — надёжная доставка сообщений

### 5. Структура проекта

```
prod/
├── README.md                          # Этот файл
├── docs/
│   └── architecture.puml              # Диаграмма (PlantUML)
├── services/
│   ├── users/                         # Node.js + PostgreSQL
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   ├── products/                      # Python + MongoDB
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── app/
│   ├── orders/                        # Go + PostgreSQL
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   └── cmd/
│   ├── payments/                      # Java + PostgreSQL
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/
│   └── notifications/                 # Node.js + Redis
│       ├── Dockerfile
│       ├── package.json
│       └── src/
├── gateway/                           # API Gateway (Nginx)
│   └── nginx.conf
├── docker-compose.yml                 # Запуск всей системы
└── docs/
    └── architecture.puml
```

### 6. API Gateway

Nginx маршрутизирует запросы:

```
/api/users/*     → users-service:3001
/api/products/*  → products-service:5000
/api/orders/*    → orders-service:8080
/api/payments/*  → payments-service:8081
```

### 7. Запуск (docker-compose)

```bash
docker-compose up --build
```

Запустит:
- 5 микросервисов
- RabbitMQ
- PostgreSQL (3 экземпляра)
- MongoDB
- Redis
- Nginx Gateway

### 8. Диаграмма потока данных

```
┌─────────┐     ┌─────────┐     ┌──────────────┐
│ Клиент  │────▶│ Gateway │────▶│ Users        │
└─────────┘     │         │     │ (авторизация)│
                │         │     └──────────────┘
                │         │
                │         │     ┌──────────────┐
                │         │────▶│ Products     │
                │         │     │ (каталог)    │
                │         │     └──────────────┘
                │         │
                │         │     ┌──────────────┐     ┌─────────┐
                │         │────▶│ Orders       │────▶│ RabbitMQ│
                │         │     │ (заказы)     │     └────┬────┘
                └─────────┘     └──────────────┘          │
                                    ▲                     │
                                    │    ┌────────────────┼────────────────┐
                                    │    │                │                │
                              ┌─────┴────┴──┐    ┌───────┴──────┐  ┌──────┴──────┐
                              │ Orders      │    │ Payments     │  │ Notifications│
                              │ (статус)    │    │ (платежи)    │  │ (уведомления)│
                              └─────────────┘    └──────────────┘  └─────────────┘
```

### 9. Паттерны

| Паттерн | Где применяется |
|---------|-----------------|
| API Gateway | Маршрутизация, аутентификация |
| Saga | Распределённые транзакции (Orders → Payments) |
| Event Sourcing | История изменений заказов |
| CQRS | Чтение/запись в Products Service |
| Circuit Breaker | Отказоустойчивость между сервисами |
