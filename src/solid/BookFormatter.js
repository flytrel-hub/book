class BookFormatter {
    toCSV(books) {
        let csv = 'ID,Название,Автор,Жанр,Дата\n';
        books.forEach(book => {
            csv += `${book.id},"${book.title}","${book.author}","${book.genre}","${book.addedAt}"\n`;
        });
        return csv;
    }

    toHTML(books) {
        let html = '<table><tr><th>ID</th><th>Название</th><th>Автор</th><th>Жанр</th></tr>';
        books.forEach(book => {
            html += `<tr><td>${book.id}</td><td>${book.title}</td><td>${book.author}</td><td>${book.genre}</td></tr>`;
        });
        html += '</table>';
        return html;
    }

    toJSON(books) {
        return JSON.stringify(books, null, 2);
    }
}

if (typeof module !== 'undefined') module.exports = BookFormatter;
