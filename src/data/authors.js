const { pool } = require('./db');

async function getAll() {
    const { rows } = await pool.query('SELECT * FROM authors');
    return rows;
}

async function getById(id) {
    const { rows } = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
    return rows[0] || null;
}

async function create(author) {
    const { rows } = await pool.query('INSERT INTO authors (name) VALUES ($1) RETURNING *', [author.name]);
    return rows[0];
}

module.exports = { getAll, getById, create };
