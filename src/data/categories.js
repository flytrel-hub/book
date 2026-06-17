const { pool } = require('./db');

async function getAll() {
    const { rows } = await pool.query('SELECT * FROM categories');
    return rows;
}

async function getById(id) {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return rows[0] || null;
}

async function create(category) {
    const { rows } = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [category.name]);
    return rows[0];
}

module.exports = { getAll, getById, create };
