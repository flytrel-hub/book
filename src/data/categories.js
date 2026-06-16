let categories = [
    { id: 1, name: "Programming" },
    { id: 2, name: "Fiction" }
];

let nextId = 3;

function getAll() { return categories; }
function getById(id) { return categories.find(c => c.id === id); }
function create(category) {
    const newCategory = { id: nextId++, ...category };
    categories.push(newCategory);
    return newCategory;
}

module.exports = { getAll, getById, create };
