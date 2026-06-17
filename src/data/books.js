const store = require('./store');

function getAll() { return store.read().books; }
function getById(id) { return store.read().books.find(b => b.id === id); }
function create(book) {
    const db = store.read();
    const newBook = { id: db.counters.books++, ...book };
    db.books.push(newBook);
    store.write(db);
    return newBook;
}
function update(id, data) {
    const db = store.read();
    const index = db.books.findIndex(b => b.id === id);
    if (index === -1) return null;
    db.books[index] = { ...db.books[index], ...data };
    store.write(db);
    return db.books[index];
}
function remove(id) {
    const db = store.read();
    const index = db.books.findIndex(b => b.id === id);
    if (index === -1) return false;
    db.books.splice(index, 1);
    store.write(db);
    return true;
}

module.exports = { getAll, getById, create, update, remove };
