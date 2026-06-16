let authors = [
    { id: 1, name: "Robert Martin" },
    { id: 2, name: "Douglas Crockford" },
    { id: 3, name: "George Orwell" }
];

let nextId = 4;

function getAll() { return authors; }
function getById(id) { return authors.find(a => a.id === id); }
function create(author) {
    const newAuthor = { id: nextId++, ...author };
    authors.push(newAuthor);
    return newAuthor;
}

module.exports = { getAll, getById, create };
