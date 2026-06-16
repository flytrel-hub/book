class InMemoryBookRepository {
    constructor() {
        this.books = [];
        this.nextId = 1;
    }

    add(book) {
        const newBook = { ...book, id: this.nextId++ };
        this.books.push(newBook);
        return newBook;
    }

    remove(id) {
        const index = this.books.findIndex(b => b.id === id);
        if (index === -1) return false;
        this.books.splice(index, 1);
        return true;
    }

    findById(id) {
        return this.books.find(b => b.id === id) || null;
    }

    findAll() {
        return [...this.books];
    }

    findByTitle(title) {
        return this.books.find(b => b.title.toLowerCase().includes(title.toLowerCase()));
    }

    findByGenre(genre) {
        return this.books.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
    }

    findByAuthor(author) {
        return this.books.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
    }

    count() {
        return this.books.length;
    }

    save(books) {
        this.books = books;
    }
}

if (typeof module !== 'undefined') module.exports = InMemoryBookRepository;
