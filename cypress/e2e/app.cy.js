describe('Book Library UI', () => {

    beforeEach(() => {
        cy.visit('/');
    });

    it('Отображает заголовок', () => {
        cy.get('h1').should('contain', 'Book Library');
    });

    it('Отображает поле ввода и кнопку', () => {
        cy.get('#titleInput').should('exist');
        cy.get('#addBtn').should('exist');
    });

    it('Отображает список книг', () => {
        cy.get('#bookList li').should('have.length.greaterThan', 0);
    });

    it('Добавляет книгу через UI', () => {
        cy.get('#titleInput').type('Тестовая книга');
        cy.get('#addBtn').click();
        cy.get('#bookList').should('contain', 'Тестовая книга');
    });

    it('Удаляет книгу через UI', () => {
        cy.get('#bookList li').then(($li) => {
            const countBefore = $li.length;
            cy.get('#bookList li').last().find('button').click();
            cy.get('#bookList li').should('have.length', countBefore - 1);
        });
    });

    it('Не добавляет пустую книгу', () => {
        cy.get('#bookList li').then(($li) => {
            const countBefore = $li.length;
            cy.get('#addBtn').click();
            cy.get('#bookList li').should('have.length', countBefore);
        });
    });

    it('Добавляет книгу по Enter', () => {
        cy.get('#titleInput').type('Enter книга{enter}');
        cy.get('#bookList').should('contain', 'Enter книга');
    });
});
