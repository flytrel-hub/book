const request = require('supertest');
const app = require('../../src/server');
const store = require('../../src/data/store');

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

describe('Integration — Books API', () => {

    test('GET /api/books возвращает список книг', async () => {
        const res = await request(app).get('/api/books');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('title');
    });

    test('GET /api/books/:id возвращает книгу', async () => {
        const res = await request(app).get('/api/books/1');
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Clean Code');
    });

    test('GET /api/books/:id возвращает 404', async () => {
        const res = await request(app).get('/api/books/999');
        expect(res.status).toBe(404);
    });

    test('POST /api/books создаёт книгу', async () => {
        const res = await request(app)
            .post('/api/books')
            .send({ title: 'Новая', authorId: 1, categoryId: 1, year: 2024 });
        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Новая');
        expect(res.body.id).toBe(3);
    });

    test('POST /api/books возвращает 400 без обязательных полей', async () => {
        const res = await request(app)
            .post('/api/books')
            .send({ title: 'Без автора' });
        expect(res.status).toBe(400);
    });

    test('PUT /api/books/:id обновляет книгу', async () => {
        const res = await request(app)
            .put('/api/books/1')
            .send({ title: 'Обновлённая' });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Обновлённая');
    });

    test('DELETE /api/books/:id удаляет книгу', async () => {
        const res = await request(app).delete('/api/books/1');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Книга удалена');
    });

    test('DELETE /api/books/:id возвращает 404', async () => {
        const res = await request(app).delete('/api/books/999');
        expect(res.status).toBe(404);
    });
});

describe('Integration — Authors API', () => {

    test('GET /api/authors возвращает список авторов', async () => {
        const res = await request(app).get('/api/authors');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    test('POST /api/authors создаёт автора', async () => {
        const res = await request(app)
            .post('/api/authors')
            .send({ name: 'Новый автор' });
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Новый автор');
    });
});

describe('Integration — Categories API', () => {

    test('GET /api/categories возвращает список категорий', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    test('POST /api/categories создаёт категорию', async () => {
        const res = await request(app)
            .post('/api/categories')
            .send({ name: 'Fiction' });
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Fiction');
    });
});

describe('Integration — Root endpoint', () => {

    test('GET / возвращает HTML-страницу', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('text/html');
        expect(res.text).toContain('Book Library');
    });
});
