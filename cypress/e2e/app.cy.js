describe('Book Library API (Cypress)', () => {

    it('GET /api/books возвращает список книг', () => {
        cy.request('/api/books').then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.greaterThan(0);
            expect(res.body[0]).to.have.property('title');
        });
    });

    it('GET /api/books/:id возвращает книгу', () => {
        cy.request('/api/books/1').then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.title).to.eq('Clean Code');
        });
    });

    it('GET /api/books/:id возвращает 404', () => {
        cy.request({ url: '/api/books/999', failOnStatusCode: false }).then((res) => {
            expect(res.status).to.eq(404);
        });
    });

    it('POST /api/books создаёт книгу', () => {
        cy.request('POST', '/api/books', {
            title: 'Cypress книга',
            authorId: 1,
            categoryId: 1,
            year: 2024
        }).then((res) => {
            expect(res.status).to.eq(201);
            expect(res.body.title).to.eq('Cypress книга');
        });
    });

    it('POST /api/books возвращает 400 без полей', () => {
        cy.request({ method: 'POST', url: '/api/books', body: { title: 'Тест' }, failOnStatusCode: false }).then((res) => {
            expect(res.status).to.eq(400);
        });
    });

    it('DELETE /api/books/:id удаляет книгу', () => {
        cy.request('POST', '/api/books', { title: 'Удаляемая', authorId: 1, categoryId: 1 }).then((res) => {
            const id = res.body.id;
            cy.request('DELETE', `/api/books/${id}`).then((del) => {
                expect(del.status).to.eq(200);
                expect(del.body.message).to.eq('Книга удалена');
            });
        });
    });

    it('GET / возвращает информацию об API', () => {
        cy.request('/').then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.message).to.eq('Book Library API');
            expect(res.body.docs).to.eq('/api-docs');
        });
    });
});
