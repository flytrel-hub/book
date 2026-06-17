const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function init() {
    await pool.query(`CREATE TABLE IF NOT EXISTS authors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )`);
    const { rows } = await pool.query('SELECT COUNT(*) FROM authors');
    if (parseInt(rows[0].count) === 0) {
        await pool.query(`INSERT INTO authors (name) VALUES
            ('Robert Martin'), ('Douglas Crockford'), ('George Orwell')`);
    }
}

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'authors' }));

app.get('/', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM authors');
    res.json(rows);
});

app.get('/:id', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Author not found' });
    res.json(rows[0]);
});

app.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const { rows } = await pool.query('INSERT INTO authors (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(rows[0]);
});

if (require.main === module) {
    init().then(() => {
        app.listen(3001, () => console.log('Authors service on :3001'));
    });
}

module.exports = app;
