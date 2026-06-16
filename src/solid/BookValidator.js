class BookValidator {
    validate(book) {
        const errors = [];
        if (!book.title || book.title.trim() === '') {
            errors.push('Название книги не может быть пустым');
        }
        if (!book.author || book.author.trim() === '') {
            errors.push('Автор не может быть пустым');
        }
        if (book.title && book.title.length > 200) {
            errors.push('Название слишком длинное');
        }
        return errors;
    }

    isValid(book) {
        return this.validate(book).length === 0;
    }
}

if (typeof module !== 'undefined') module.exports = BookValidator;
