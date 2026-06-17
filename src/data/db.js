const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function init() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS authors (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author_id INTEGER REFERENCES authors(id),
            category_id INTEGER REFERENCES categories(id),
            year INTEGER
        )
    `);

    const { rows } = await pool.query('SELECT COUNT(*) FROM books');
    if (parseInt(rows[0].count) === 0) {
        await pool.query(`INSERT INTO authors (name) VALUES ('Robert Martin'), ('Douglas Crockford'), ('George Orwell')`);
        await pool.query(`INSERT INTO categories (name) VALUES ('Programming'), ('Fiction')`);
        await pool.query(`INSERT INTO books (title, author_id, category_id, year) VALUES ('Clean Code', 1, 1, 2008), ('JavaScript', 2, 1, 2008), ('1984', 3, 2, 1949)`);
    }
}

module.exports = { pool, init };
