const store = require('./store');

function getAll() { return store.read().authors; }
function getById(id) { return store.read().authors.find(a => a.id === id); }
function create(author) {
    const db = store.read();
    const newAuthor = { id: db.counters.authors++, ...author };
    db.authors.push(newAuthor);
    store.write(db);
    return newAuthor;
}

module.exports = { getAll, getById, create };
