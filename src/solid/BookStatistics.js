class BookStatistics {
    getStatistics(books) {
        const genres = {};
        const authors = {};
        books.forEach(book => {
            genres[book.genre] = (genres[book.genre] || 0) + 1;
            authors[book.author] = (authors[book.author] || 0) + 1;
        });
        return {
            total: books.length,
            genres,
            authors,
            mostPopularGenre: Object.keys(genres).reduce((a, b) => genres[a] > genres[b] ? a : b, ''),
            mostProlificAuthor: Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b, '')
        };
    }
}

if (typeof module !== 'undefined') module.exports = BookStatistics;
