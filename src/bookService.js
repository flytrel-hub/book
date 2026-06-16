class BookService {
    constructor() {
        this.books = [];
    }

    addBook(title) {
        this.books.push(title);
    }

    removeBook(title) {
        this.books = this.books.filter(book => book !== title);
    }

    getBooks() {
        return this.books;
    }
}

if (typeof module !== 'undefined') module.exports = BookService;
