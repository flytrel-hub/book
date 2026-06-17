const store = require('../../src/data/store');
const booksData = require('../../src/data/books');
const authorsData = require('../../src/data/authors');
const categoriesData = require('../../src/data/categories');

// Очистка данных перед каждым тестом
beforeEach(() => {
    const freshData = {
        books: [
            { id: 1, title: "Clean Code", authorId: 1, categoryId: 1, year: 2008 },
            { id: 2, title: "JavaScript", authorId: 2, categoryId: 1, year: 2008 }
        ],
        authors: [
            { id: 1, name: "Robert Martin" },
            { id: 2, name: "Douglas Crockford" }
        ],
        categories: [
            { id: 1, name: "Programming" }
        ],
        counters: { books: 3, authors: 3, categories: 2 }
    };
    store.write(freshData);
});

describe('Unit Tests — Books', () => {

    test('getAll возвращает все книги', () => {
        const books = booksData.getAll();
        expect(books).toHaveLength(2);
    });

    test('getById находит книгу по id', () => {
        const book = booksData.getById(1);
        expect(book.title).toBe('Clean Code');
    });

    test('getById возвращает undefined для несуществующего id', () => {
        const book = booksData.getById(999);
        expect(book).toBeUndefined();
    });

    test('create добавляет книгу и возвращает её с id', () => {
        const newBook = booksData.create({ title: 'Новая', authorId: 1, categoryId: 1, year: 2024 });
        expect(newBook.id).toBe(3);
        expect(newBook.title).toBe('Новая');
        expect(booksData.getAll()).toHaveLength(3);
    });

    test('update обновляет существующую книгу', () => {
        const updated = booksData.update(1, { title: 'Обновлённая' });
        expect(updated.title).toBe('Обновлённая');
        expect(updated.authorId).toBe(1);
    });

    test('update возвращает null для несуществующей книги', () => {
        const result = booksData.update(999, { title: 'X' });
        expect(result).toBeNull();
    });

    test('remove удаляет книгу и возвращает true', () => {
        const result = booksData.remove(1);
        expect(result).toBe(true);
        expect(booksData.getAll()).toHaveLength(1);
    });

    test('remove возвращает false для несуществующей книги', () => {
        const result = booksData.remove(999);
        expect(result).toBe(false);
    });
});

describe('Unit Tests — Authors', () => {

    test('getAll возвращает всех авторов', () => {
        const authors = authorsData.getAll();
        expect(authors).toHaveLength(2);
    });

    test('getById находит автора', () => {
        const author = authorsData.getById(1);
        expect(author.name).toBe('Robert Martin');
    });

    test('create добавляет автора', () => {
        const newAuthor = authorsData.create({ name: 'Новый' });
        expect(newAuthor.id).toBe(3);
        expect(authorsData.getAll()).toHaveLength(3);
    });
});

describe('Unit Tests — Categories', () => {

    test('getAll возвращает все категории', () => {
        const categories = categoriesData.getAll();
        expect(categories).toHaveLength(1);
    });

    test('create добавляет категорию', () => {
        const newCategory = categoriesData.create({ name: 'Fiction' });
        expect(newCategory.id).toBe(2);
        expect(categoriesData.getAll()).toHaveLength(2);
    });
});

describe('Unit Tests — Store', () => {

    test('read возвращает объект с нужными ключами', () => {
        const data = store.read();
        expect(data).toHaveProperty('books');
        expect(data).toHaveProperty('authors');
        expect(data).toHaveProperty('categories');
        expect(data).toHaveProperty('counters');
    });

    test('write сохраняет данные', () => {
        const data = store.read();
        data.books.push({ id: 99, title: 'Тест', authorId: 1, categoryId: 1 });
        store.write(data);
        const reloaded = store.read();
        expect(reloaded.books).toHaveLength(3);
    });
});
