const Book = require('./Book');
const BookValidator = require('./BookValidator');
const InMemoryBookRepository = require('./InMemoryBookRepository');
const BookFormatter = require('./BookFormatter');
const BookStatistics = require('./BookStatistics');
const ConsoleNotifier = require('./ConsoleNotifier');

class BookService {
    constructor(
        repository = null,
        validator = null,
        formatter = null,
        statistics = null,
        notifier = null
    ) {
        this.repository = repository || new InMemoryBookRepository();
        this.validator = validator || new BookValidator();
        this.formatter = formatter || new BookFormatter();
        this.statistics = statistics || new BookStatistics();
        this.notifier = notifier || new ConsoleNotifier();
    }

    addBook(title, author, genre) {
        const bookData = { title: title?.trim(), author: author?.trim(), genre };
        const errors = this.validator.validate(bookData);
        if (errors.length > 0) {
            throw new Error(errors[0]);
        }
        const book = new Book(null, bookData.title, bookData.author, bookData.genre);
        const saved = this.repository.add(book);
        this.notifier.send(`Добавлена книга: "${saved.title}"`);
        return saved;
    }

    removeBook(id) {
        const book = this.repository.findById(id);
        if (!book) throw new Error('Книга не найдена');
        this.repository.remove(id);
        this.notifier.send(`Удалена книга: "${book.title}"`);
    }

    findBookByTitle(title) {
        return this.repository.findByTitle(title);
    }

    getBooksByGenre(genre) {
        return this.repository.findByGenre(genre);
    }

    getBooksByAuthor(author) {
        return this.repository.findByAuthor(author);
    }

    getBooks() {
        return this.repository.findAll();
    }

    getBookCount() {
        return this.repository.count();
    }

    sortBooks(field = 'title') {
        return this.repository.findAll().sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
        });
    }

    exportToCSV() {
        return this.formatter.toCSV(this.repository.findAll());
    }

    exportToHTML() {
        return this.formatter.toHTML(this.repository.findAll());
    }

    exportToJSON() {
        return this.formatter.toJSON(this.repository.findAll());
    }

    getStatistics() {
        return this.statistics.getStatistics(this.repository.findAll());
    }
}

if (typeof module !== 'undefined') module.exports = BookService;
