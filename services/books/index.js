const express = require('express');
const { Pool } = require('pg');

const app = express();
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
    const { rows } = await pool.query('SELECT COUNT(*) FROM books');
    if (parseInt(rows[0].count) === 0) {
        await pool.query(`INSERT INTO books (title, author_id, category_id, year) VALUES
            ('Clean Code', 1, 1, 2008),
            ('JavaScript: The Good Parts', 2, 1, 2008),
            ('1984', 3, 2, 1949)`);
    }
}

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'books' }));

app.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM books');
    res.json(rows);
});

app.get('/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
});

app.post('/', async (req, res) => {
    const { title, author_id, category_id, year } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });
    const { rows } = await pool.query(
        'INSERT INTO books (title, author_id, category_id, year) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, author_id, category_id, year]
    );
    res.status(201).json(rows[0]);
});

app.put('/:id', async (req, res) => {
    const { title, author_id, category_id, year } = req.body;
    const { rows } = await pool.query(
        'UPDATE books SET title=$1, author_id=$2, category_id=$3, year=$4 WHERE id=$5 RETURNING *',
        [title, author_id, category_id, year, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
});

app.delete('/:id', async (req, res) => {
    const { rowCount } = await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted', id: parseInt(req.params.id) });
});

if (require.main === module) {
    init().then(() => {
        app.listen(3003, () => console.log('Books service on :3003'));
    });
}

module.exports = app;
