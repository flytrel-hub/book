const BookService = require('../src/bookService');

describe('BookService', () => {

    test('Добавление книги', () => {
        const service = new BookService();

        service.addBook('JavaScript');

        expect(service.getBooks()).toContain('JavaScript');
    });

    test('Удаление книги', () => {
        const service = new BookService();

        service.addBook('JavaScript');
        service.removeBook('JavaScript');

        expect(service.getBooks()).toHaveLength(0);
    });

});
