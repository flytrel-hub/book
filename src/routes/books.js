const express = require('express');
const router = express.Router();
const books = require('../data/books');

router.get('/', async (req, res) => {
    res.json(await books.getAll());
});

router.get('/:id', async (req, res) => {
    const book = await books.getById(parseInt(req.params.id));
    if (!book) return res.status(404).json({ error: 'Книга не найдена' });
    res.json(book);
});

router.post('/', async (req, res) => {
    const { title, authorId, categoryId, year } = req.body;
    if (!title || !authorId || !categoryId) {
        return res.status(400).json({ error: 'title, authorId, categoryId обязательны' });
    }
    const book = await books.create({ title, authorId, categoryId, year });
    res.status(201).json(book);
});

router.put('/:id', async (req, res) => {
    const book = await books.update(parseInt(req.params.id), req.body);
    if (!book) return res.status(404).json({ error: 'Книга не найдена' });
    res.json(book);
});

router.delete('/:id', async (req, res) => {
    const removed = await books.remove(parseInt(req.params.id));
    if (!removed) return res.status(404).json({ error: 'Книга не найдена' });
    res.json({ message: 'Книга удалена', id: parseInt(req.params.id) });
});

module.exports = router;
