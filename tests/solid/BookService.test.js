const BookService = require('../../src/solid/BookService');
const InMemoryBookRepository = require('../../src/solid/InMemoryBookRepository');
const BookValidator = require('../../src/solid/BookValidator');
const BookFormatter = require('../../src/solid/BookFormatter');
const BookStatistics = require('../../src/solid/BookStatistics');
const ConsoleNotifier = require('../../src/solid/ConsoleNotifier');

describe('BookService (После рефакторинга — SOLID)', () => {

    let service;

    beforeEach(() => {
        service = new BookService();
    });

    describe('SRP — Единственная ответственность', () => {
        test('BookService отвечает только за бизнес-логику', () => {
            expect(typeof service.addBook).toBe('function');
            expect(typeof service.removeBook).toBe('function');
            expect(typeof service.getBooks).toBe('function');
        });

        test('BookValidator отвечает только за валидацию', () => {
            const validator = new BookValidator();
            expect(validator.isValid({ title: 'Книга', author: 'Автор' })).toBe(true);
            expect(validator.isValid({ title: '', author: 'Автор' })).toBe(false);
        });

        test('BookFormatter отвечает только за форматирование', () => {
            const formatter = new BookFormatter();
            const books = [{ id: 1, title: 'Тест', author: 'Автор', genre: 'Жанр' }];
            expect(formatter.toCSV(books)).toContain('Тест');
            expect(formatter.toJSON(books)).toContain('Тест');
        });

        test('BookStatistics отвечает только за статистику', () => {
            const stats = new BookStatistics();
            const result = stats.getStatistics([
                { genre: 'Фантастика', author: 'Автор1' },
                { genre: 'Детектив', author: 'Автор1' }
            ]);
            expect(result.total).toBe(2);
        });
    });

    describe('OCP — Открытость/Закрытость', () => {
        test('Можно заменить репозиторий без изменения BookService', () => {
            class CustomRepository extends InMemoryBookRepository {
                add(book) {
                    const saved = super.add(book);
                    saved.customField = true;
                    return saved;
                }
            }
            const customService = new BookService(new CustomRepository());
            const book = customService.addBook('Книга', 'Автор');
            expect(book.customField).toBe(true);
        });

        test('Можно заменить нотификатор без изменения BookService', () => {
            class MockNotifier {
                constructor() { this.messages = []; }
                send(msg) { this.messages.push(msg); }
            }
            const mock = new MockNotifier();
            const customService = new BookService(null, null, null, null, mock);
            customService.addBook('Книга', 'Автор');
            expect(mock.messages).toHaveLength(1);
            expect(mock.messages[0]).toContain('Книга');
        });
    });

    describe('LSP — Подстановка Лисков', () => {
        test('Любой репозиторий, реализующий интерфейс, работает с BookService', () => {
            const service1 = new BookService(new InMemoryBookRepository());
            const book1 = service1.addBook('Книга', 'Автор');
            expect(book1.title).toBe('Книга');
        });
    });

    describe('ISP — Разделение интерфейсов', () => {
        test('Каждый класс имеет узкий интерфейс', () => {
            const validator = new BookValidator();
            const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(validator)).filter(k => k !== 'constructor');
            expect(keys).toEqual(expect.arrayContaining(['validate', 'isValid']));
            expect(keys).toHaveLength(2);
        });
    });

    describe('DIP — Инверсия зависимостей', () => {
        test('BookService зависит от абстракций, не от конкретик', () => {
            class MockRepository {
                constructor() { this.books = []; this.nextId = 1; }
                add(book) { const b = { ...book, id: this.nextId++ }; this.books.push(b); return b; }
                remove(id) { this.books = this.books.filter(b => b.id !== id); return true; }
                findById(id) { return this.books.find(b => b.id === id) || null; }
                findAll() { return [...this.books]; }
                findByTitle(t) { return this.books.find(b => b.title.includes(t)); }
                findByGenre(g) { return this.books.filter(b => b.genre === g); }
                findByAuthor(a) { return this.books.filter(b => b.author.includes(a)); }
                count() { return this.books.length; }
                save(books) { this.books = books; }
            }
            const mockRepo = new MockRepository();
            const service = new BookService(mockRepo);
            service.addBook('Тест', 'Автор');
            expect(mockRepo.books).toHaveLength(1);
        });
    });

    describe('Интеграционные тесты', () => {
        test('Добавление и получение книг', () => {
            const book = service.addBook('JavaScript', 'Морони', 'Программирование');
            expect(book.title).toBe('JavaScript');
            expect(service.getBookCount()).toBe(1);
        });

        test('Ошибка при пустом названии', () => {
            expect(() => service.addBook('', 'Автор')).toThrow('Название книги не может быть пустым');
        });

        test('Удаление книги', () => {
            const book = service.addBook('Книга', 'Автор');
            service.removeBook(book.id);
            expect(service.getBookCount()).toBe(0);
        });

        test('Поиск по названию', () => {
            service.addBook('JavaScript', 'Автор', 'Жанр');
            const found = service.findBookByTitle('javascript');
            expect(found.title).toBe('JavaScript');
        });

        test('Экспорт в CSV', () => {
            service.addBook('Книга', 'Автор', 'Жанр');
            const csv = service.exportToCSV();
            expect(csv).toContain('Книга');
        });

        test('Сортировка', () => {
            service.addBook('Б', 'Автор', 'Жанр');
            service.addBook('А', 'Автор', 'Жанр');
            const sorted = service.sortBooks('title');
            expect(sorted[0].title).toBe('А');
        });

        test('Статистика', () => {
            service.addBook('Книга1', 'Автор1', 'Жанр1');
            service.addBook('Книга2', 'Автор1', 'Жанр2');
            const stats = service.getStatistics();
            expect(stats.total).toBe(2);
            expect(stats.mostProlificAuthor).toBe('Автор1');
        });
    });
});
