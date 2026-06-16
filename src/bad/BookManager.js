class BookManager {
    constructor() {
        this.books = [];
        this.nextId = 1;
    }

    addBook(title, author, genre) {
        if (!title || title.trim() === '') {
            throw new Error('Название книги не может быть пустым');
        }
        if (!author || author.trim() === '') {
            throw new Error('Автор не может быть пустым');
        }
        if (title.length > 200) {
            throw new Error('Название слишком длинное');
        }

        const book = {
            id: this.nextId++,
            title: title.trim(),
            author: author.trim(),
            genre: genre || 'Неизвестный жанр',
            addedAt: new Date().toISOString()
        };
        this.books.push(book);
        return book;
    }

    removeBook(id) {
        const index = this.books.findIndex(b => b.id === id);
        if (index === -1) {
            throw new Error('Книга не найдена');
        }
        this.books.splice(index, 1);
    }

    findBookByTitle(title) {
        return this.books.find(b => b.title.toLowerCase().includes(title.toLowerCase()));
    }

    getBooksByGenre(genre) {
        return this.books.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
    }

    getBooksByAuthor(author) {
        return this.books.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
    }

    getBookCount() {
        return this.books.length;
    }

    saveToFile() {
        const fs = require('fs');
        const data = JSON.stringify(this.books, null, 2);
        fs.writeFileSync('books.json', data);
    }

    loadFromFile() {
        const fs = require('fs');
        if (fs.existsSync('books.json')) {
            const data = fs.readFileSync('books.json', 'utf-8');
            this.books = JSON.parse(data);
        }
    }

    saveToLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('books', JSON.stringify(this.books));
        }
    }

    loadFromLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            const data = localStorage.getItem('books');
            if (data) {
                this.books = JSON.parse(data);
            }
        }
    }

    exportToCSV() {
        let csv = 'ID,Название,Автор,Жанр,Дата\n';
        this.books.forEach(book => {
            csv += `${book.id},"${book.title}","${book.author}","${book.genre}","${book.addedAt}"\n`;
        });
        return csv;
    }

    exportToHTML() {
        let html = '<table><tr><th>ID</th><th>Название</th><th>Автор</th><th>Жанр</th></tr>';
        this.books.forEach(book => {
            html += `<tr><td>${book.id}</td><td>${book.title}</td><td>${book.author}</td><td>${book.genre}</td></tr>`;
        });
        html += '</table>';
        return html;
    }

    exportToJSON() {
        return JSON.stringify(this.books, null, 2);
    }

    validateBook(book) {
        const errors = [];
        if (!book.title || book.title.trim() === '') errors.push('Пустое название');
        if (!book.author || book.author.trim() === '') errors.push('Пустой автор');
        if (book.title && book.title.length > 200) errors.push('Слишком длинное название');
        if (book.title && book.title.length < 1) errors.push('Слишком короткое название');
        return errors;
    }

    getStatistics() {
        const genres = {};
        const authors = {};
        this.books.forEach(book => {
            genres[book.genre] = (genres[book.genre] || 0) + 1;
            authors[book.author] = (authors[book.author] || 0) + 1;
        });
        return {
            total: this.books.length,
            genres,
            authors,
            mostPopularGenre: Object.keys(genres).reduce((a, b) => genres[a] > genres[b] ? a : b, ''),
            mostProlificAuthor: Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b, '')
        };
    }

    sendNotification(message) {
        console.log(`[Уведомление]: ${message}`);
        if (typeof window !== 'undefined' && window.alert) {
            window.alert(message);
        }
    }

    addBookWithNotification(title, author, genre) {
        const book = this.addBook(title, author, genre);
        this.sendNotification(`Добавлена книга: "${book.title}"`);
        return book;
    }

    removeBookWithNotification(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) throw new Error('Книга не найдена');
        this.removeBook(id);
        this.sendNotification(`Удалена книга: "${book.title}"`);
    }

    sortBooks(field = 'title') {
        return [...this.books].sort((a, b) => {
            if (a[field] < b[field]) return -1;
            if (a[field] > b[field]) return 1;
            return 0;
        });
    }

    getPopularBooks() {
        return this.books.filter(b => b.genre === 'Фантастика' || b.genre === 'Детектив');
    }
}

if (typeof module !== 'undefined') module.exports = BookManager;
