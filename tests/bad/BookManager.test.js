const BookManager = require('../../src/bad/BookManager');

describe('BookManager (До рефакторинга)', () => {

    let manager;

    beforeEach(() => {
        manager = new BookManager();
    });

    describe('Добавление книг', () => {
        test('Добавление книги с валидными данными', () => {
            const book = manager.addBook('JavaScript', 'Морони', 'Программирование');
            expect(book).toMatchObject({
                title: 'JavaScript',
                author: 'Морони',
                genre: 'Программирование'
            });
            expect(manager.getBookCount()).toBe(1);
        });

        test('Ошибка при пустом названии', () => {
            expect(() => manager.addBook('', 'Автор')).toThrow('Название книги не может быть пустым');
        });

        test('Ошибка при пустом авторе', () => {
            expect(() => manager.addBook('Книга', '')).toThrow('Автор не может быть пустым');
        });

        test('Ошибка при слишком длинном названии', () => {
            const longTitle = 'А'.repeat(201);
            expect(() => manager.addBook(longTitle, 'Автор')).toThrow('Название слишком длинное');
        });
    });

    describe('Удаление книг', () => {
        test('Удаление существующей книги', () => {
            const book = manager.addBook('Книга', 'Автор');
            manager.removeBook(book.id);
            expect(manager.getBookCount()).toBe(0);
        });

        test('Ошибка при удалении несуществующей книги', () => {
            expect(() => manager.removeBook(999)).toThrow('Книга не найдена');
        });
    });

    describe('Поиск книг', () => {
        beforeEach(() => {
            manager.addBook('JavaScript', 'Морони', 'Программирование');
            manager.addBook('Python', 'Петров', 'Программирование');
            manager.addBook('Детектив', 'Иванов', 'Детектив');
        });

        test('Поиск по названию', () => {
            const found = manager.findBookByTitle('javascript');
            expect(found.title).toBe('JavaScript');
        });

        test('Поиск по жанру', () => {
            const books = manager.getBooksByGenre('Программирование');
            expect(books).toHaveLength(2);
        });

        test('Поиск по автору', () => {
            const books = manager.getBooksByAuthor('Петров');
            expect(books).toHaveLength(1);
        });
    });

    describe('Экспорт данных', () => {
        beforeEach(() => {
            manager.addBook('Книга', 'Автор', 'Жанр');
        });

        test('Экспорт в CSV', () => {
            const csv = manager.exportToCSV();
            expect(csv).toContain('Книга');
            expect(csv).toContain('Автор');
        });

        test('Экспорт в HTML', () => {
            const html = manager.exportToHTML();
            expect(html).toContain('<table>');
            expect(html).toContain('Книга');
        });

        test('Экспорт в JSON', () => {
            const json = manager.exportToJSON();
            const parsed = JSON.parse(json);
            expect(parsed).toHaveLength(1);
        });
    });

    describe('Статистика', () => {
        test('Получение статистики', () => {
            manager.addBook('Книга1', 'Автор1', 'Жанр1');
            manager.addBook('Книга2', 'Автор1', 'Жанр2');
            const stats = manager.getStatistics();
            expect(stats.total).toBe(2);
            expect(stats.mostProlificAuthor).toBe('Автор1');
        });
    });

    describe('Сортировка', () => {
        test('Сортировка по названию', () => {
            manager.addBook('Б', 'Автор', 'Жанр');
            manager.addBook('А', 'Автор', 'Жанр');
            manager.addBook('В', 'Автор', 'Жанр');
            const sorted = manager.sortBooks('title');
            expect(sorted[0].title).toBe('А');
            expect(sorted[2].title).toBe('В');
        });
    });
});
