describe('Book Library UI', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('Отображает заголовок', () => {
        cy.get('h1').should('contain', 'Book Library');
    });

    it('Отображает поле ввода и кнопку', () => {
        cy.get('#bookInput').should('exist');
        cy.get('#addBtn').should('exist');
    });

    it('Отображает список книг', () => {
        cy.get('#bookList li').should('have.length.greaterThan', 0);
    });

    it('Добавляет книгу через UI', () => {
        cy.get('#bookInput').type('Тестовая книга');
        cy.get('#authorInput').type('Тестовый автор');
        cy.get('#genreInput').type('Тестовый жанр');
        cy.get('#addBtn').click();
        cy.get('#bookList').should('contain', 'Тестовая книга');
    });

    it('Удаляет книгу через UI', () => {
        cy.get('#bookList li').first().find('button').click();
        cy.get('#bookList li').should('have.length', 2);
    });

    it('Кнопки экспорта работают', () => {
        cy.get('#exportJson').click();
        cy.get('#output').should('contain', 'Clean Code');
    });

    it('Кнопка статистики работает', () => {
        cy.get('#showStats').click();
        cy.get('#output').should('contain', 'total');
    });
});
