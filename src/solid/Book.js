class Book {
    constructor(id, title, author, genre, addedAt) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre || 'Неизвестный жанр';
        this.addedAt = addedAt || new Date().toISOString();
    }
}

if (typeof module !== 'undefined') module.exports = Book;
