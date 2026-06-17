const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function init() {
    await pool.query(`CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )`);
    const { rows } = await pool.query('SELECT COUNT(*) FROM categories');
    if (parseInt(rows[0].count) === 0) {
        await pool.query(`INSERT INTO categories (name) VALUES ('Programming'), ('Fiction')`);
    }
}

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'categories' }));

app.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM categories');
    res.json(rows);
});

app.get('/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Category not found' });
    res.json(rows[0]);
});

app.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const { rows } = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(rows[0]);
});

if (require.main === module) {
    init().then(() => {
        app.listen(3002, () => console.log('Categories service on :3002'));
    });
}

module.exports = app;
