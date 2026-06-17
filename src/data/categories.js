const store = require('./store');

function getAll() { return store.read().categories; }
function getById(id) { return store.read().categories.find(c => c.id === id); }
function create(category) {
    const db = store.read();
    const newCategory = { id: db.counters.categories++, ...category };
    db.categories.push(newCategory);
    store.write(db);
    return newCategory;
}

module.exports = { getAll, getById, create };
