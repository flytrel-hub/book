const express = require('express');
const router = express.Router();
const categories = require('../data/categories');

router.get('/', async (req, res) => {
    res.json(await categories.getAll());
});

router.get('/:id', async (req, res) => {
    const category = await categories.getById(parseInt(req.params.id));
    if (!category) return res.status(404).json({ error: 'Категория не найдена' });
    res.json(category);
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name обязателен' });
    const category = await categories.create({ name });
    res.status(201).json(category);
});

module.exports = router;
