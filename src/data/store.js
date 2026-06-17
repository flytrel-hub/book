const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

const defaultData = {
    books: [
        { id: 1, title: "Clean Code", authorId: 1, categoryId: 1, year: 2008 },
        { id: 2, title: "JavaScript: The Good Parts", authorId: 2, categoryId: 1, year: 2008 },
        { id: 3, title: "1984", authorId: 3, categoryId: 2, year: 1949 }
    ],
    authors: [
        { id: 1, name: "Robert Martin" },
        { id: 2, name: "Douglas Crockford" },
        { id: 3, name: "George Orwell" }
    ],
    categories: [
        { id: 1, name: "Programming" },
        { id: 2, name: "Fiction" }
    ],
    counters: { books: 4, authors: 4, categories: 3 }
};

function read() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
        return { ...defaultData };
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
}

function write(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { read, write };
