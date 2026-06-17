const { pool } = require('./db');

async function getAll() {
    const { rows } = await pool.query('SELECT id, title, author_id as "authorId", category_id as "categoryId", year FROM books');
    return rows;
}

async function getById(id) {
    const { rows } = await pool.query('SELECT id, title, author_id as "authorId", category_id as "categoryId", year FROM books WHERE id = $1', [id]);
    return rows[0] || null;
}

async function create(book) {
    const { rows } = await pool.query(
        'INSERT INTO books (title, author_id, category_id, year) VALUES ($1, $2, $3, $4) RETURNING id, title, author_id as "authorId", category_id as "categoryId", year',
        [book.title, book.authorId, book.categoryId, book.year]
    );
    return rows[0];
}

async function update(id, data) {
    const fields = [];
    const values = [];
    let i = 1;
    if (data.title) { fields.push(`title = $${i++}`); values.push(data.title); }
    if (data.authorId) { fields.push(`author_id = $${i++}`); values.push(data.authorId); }
    if (data.categoryId) { fields.push(`category_id = $${i++}`); values.push(data.categoryId); }
    if (data.year) { fields.push(`year = $${i++}`); values.push(data.year); }
    if (fields.length === 0) return null;
    values.push(id);
    const { rows } = await pool.query(
        `UPDATE books SET ${fields.join(', ')} WHERE id = $${i} RETURNING id, title, author_id as "authorId", category_id as "categoryId", year`,
        values
    );
    return rows[0] || null;
}

async function remove(id) {
    const { rowCount } = await pool.query('DELETE FROM books WHERE id = $1', [id]);
    return rowCount > 0;
}

module.exports = { getAll, getById, create, update, remove };
