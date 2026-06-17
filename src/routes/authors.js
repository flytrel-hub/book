const express = require('express');
const router = express.Router();
const authors = require('../data/authors');

router.get('/', async (req, res) => {
    res.json(await authors.getAll());
});

router.get('/:id', async (req, res) => {
    const author = await authors.getById(parseInt(req.params.id));
    if (!author) return res.status(404).json({ error: 'Автор не найден' });
    res.json(author);
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name обязателен' });
    const author = await authors.create({ name });
    res.status(201).json(author);
});

module.exports = router;
