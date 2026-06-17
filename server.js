const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function init() {
    await pool.query(`CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author_id INTEGER,
        category_id INTEGER,
        year INTEGER
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )`);

    const { rows: bookCount } = await pool.query('SELECT COUNT(*) FROM books');
    if (parseInt(bookCount[0].count) === 0) {
        await pool.query(`INSERT INTO authors (name) VALUES ('Robert Martin'), ('Douglas Crockford'), ('George Orwell')`);
        await pool.query(`INSERT INTO categories (name) VALUES ('Programming'), ('Fiction')`);
        await pool.query(`INSERT INTO books (title, author_id, category_id, year) VALUES
            ('Clean Code', 1, 1, 2008),
            ('JavaScript: The Good Parts', 2, 1, 2008),
            ('1984', 3, 2, 1949)`);
    }
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// --- Authors ---
app.get('/api/authors', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM authors');
    res.json(rows);
});
app.get('/api/authors/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Author not found' });
    res.json(rows[0]);
});
app.post('/api/authors', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const { rows } = await pool.query('INSERT INTO authors (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(rows[0]);
});

// --- Categories ---
app.get('/api/categories', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM categories');
    res.json(rows);
});
app.get('/api/categories/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Category not found' });
    res.json(rows[0]);
});
app.post('/api/categories', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const { rows } = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(rows[0]);
});

// --- Books ---
app.get('/api/books', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM books');
    res.json(rows);
});
app.get('/api/books/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
});
app.post('/api/books', async (req, res) => {
    const { title, author_id, category_id, year } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });
    const { rows } = await pool.query(
        'INSERT INTO books (title, author_id, category_id, year) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, author_id, category_id, year]
    );
    res.status(201).json(rows[0]);
});
app.put('/api/books/:id', async (req, res) => {
    const { title, author_id, category_id, year } = req.body;
    const { rows } = await pool.query(
        'UPDATE books SET title=$1, author_id=$2, category_id=$3, year=$4 WHERE id=$5 RETURNING *',
        [title, author_id, category_id, year, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
});
app.delete('/api/books/:id', async (req, res) => {
    const { rowCount } = await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted', id: parseInt(req.params.id) });
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
init().then(() => {
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
});
