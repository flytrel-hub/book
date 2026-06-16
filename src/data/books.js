let books = [
    { id: 1, title: "Clean Code", authorId: 1, categoryId: 1, year: 2008 },
    { id: 2, title: "JavaScript: The Good Parts", authorId: 2, categoryId: 1, year: 2008 },
    { id: 3, title: "1984", authorId: 3, categoryId: 2, year: 1949 }
];

let nextId = 4;

function getAll() { return books; }
function getById(id) { return books.find(b => b.id === id); }
function create(book) {
    const newBook = { id: nextId++, ...book };
    books.push(newBook);
    return newBook;
}
function update(id, data) {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...data };
    return books[index];
}
function remove(id) {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
}

module.exports = { getAll, getById, create, update, remove };
