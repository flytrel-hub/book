# Лабораторная работа №6: Применение принципов SOLID

## Структура проекта

```
src/
├── bad/
│   └── BookManager.js          # "Плохой" код (1 класс = всё)
├── solid/
│   ├── Book.js                 # Модель данных
│   ├── BookValidator.js        # Валидация
│   ├── InMemoryBookRepository.js # Хранение
│   ├── BookFormatter.js        # Экспорт (CSV/HTML/JSON)
│   ├── BookStatistics.js       # Статистика
│   ├── ConsoleNotifier.js      # Уведомления
│   └── BookService.js          # Бизнес-логика
tests/
├── bad/
│   └── BookManager.test.js     # 14 тестов
└── solid/
    └── BookService.test.js     # 16 тестов
```

---

## Сравнение: Bad vs SOLID

### SRP — Принцип единственной ответственности

**Bad:** Один класс делает всё (161 строка, ~20 методов)
```javascript
class BookManager {
    // Валидация
    validateBook(book) { ... }
    // Хранение
    addBook(title, author, genre) { ... }
    // Файловые операции
    saveToFile() { ... }
    loadFromFile() { ... }
    // localStorage
    saveToLocalStorage() { ... }
    loadFromLocalStorage() { ... }
    // Экспорт
    exportToCSV() { ... }
    exportToHTML() { ... }
    exportToJSON() { ... }
    // Уведомления
    sendNotification(message) { ... }
    // Статистика
    getStatistics() { ... }
}
```

**SOLID:** Каждый класс — одна ответственность (7 файлов по 15–30 строк)
```javascript
// BookValidator.js — только валидация
class BookValidator {
    validate(book) { ... }
}

// BookFormatter.js — только форматирование
class BookFormatter {
    toCSV(books) { ... }
    toHTML(books) { ... }
    toJSON(books) { ... }
}

// BookStatistics.js — только статистика
class BookStatistics {
    getStatistics(books) { ... }
}
```

---

### OCP — Принцип открытости/закрытости

**Bad:** Добавление нового хранилища = изменение класса
```javascript
// Добавили Redis? Меняем BookManager:
class BookManager {
    saveToRedis() { ... }   // ← модификация
    loadFromRedis() { ... } // ← модификация
}
```

**SOLID:** Добавление нового хранилища = новый класс
```javascript
class RedisBookRepository {
    add(book) { ... }
    findAll() { ... }
}

// BookService не трогаем!
const service = new BookService(new RedisBookRepository());
```

---

### LSP — Принцип подстановки Лисков

**Bad:** Нельзя подменить localStorage на файл без багов
```javascript
// localStorage-версия возвращает Promise
// Файловая — синхронную строку
// Клиентский код ломается при замене
```

**SOLID:** Любой репозиторий работает одинаково
```javascript
// InMemoryBookRepository
const service1 = new BookService(new InMemoryBookRepository());

// RedisBookRepository
const service2 = new BookService(new RedisBookRepository());

// Оба работают одинаково — интерфейс один
```

---

### ISP — Принцип разделения интерфейсов

**Bad:** Класс с 20+ методами — клиент зависит от того, что не использует
```javascript
// Клиенту нужен только поиск, а он依赖 от:
// saveToFile, loadFromFile, saveToLocalStorage,
// exportToCSV, exportToHTML, sendNotification...
```

**SOLID:** Каждый интерфейс минимален
```javascript
// BookValidator — 2 метода
class BookValidator {
    validate(book) { ... }
    isValid(book) { ... }
}

// BookFormatter — 3 метода
class BookFormatter {
    toCSV(books) { ... }
    toHTML(books) { ... }
    toJSON(books) { ... }
}
```

---

### DIP — Принцип инверсии зависимостей

**Bad:** Зависит от конкретных модулей (fs, localStorage, window)
```javascript
class BookManager {
    saveToFile() {
        const fs = require('fs');  // ← конкретный модуль
        fs.writeFileSync('books.json', ...);
    }
}
```

**SOLID:** Зависит от абстракций (интерфейсов)
```javascript
class BookService {
    constructor(repository) {
        this.repository = repository;  // ← абстракция
    }
    // Не знает откуда берёт данные — файл, БД, API
}
```

---

## Результаты тестов

| Код | Тестов | Статус |
|-----|--------|--------|
| Bad (`tests/bad/`) | 14 | Все проходят |
| SOLID (`tests/solid/`) | 16 | Все проходят |

## Запуск тестов

```bash
npm test              # Все тесты
npx jest tests/bad/   # Только bad
npx jest tests/solid/ # Только SOLID
```
