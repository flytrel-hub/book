const express = require('express');
const router = express.Router();
const authors = require('../data/authors');

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Получить список всех авторов
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Список авторов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */
router.get('/', (req, res) => {
    res.json(authors.getAll());
});

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Получить автора по ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Автор найден
 *       404:
 *         description: Автор не найден
 */
router.get('/:id', (req, res) => {
    const author = authors.getById(parseInt(req.params.id));
    if (!author) return res.status(404).json({ error: 'Автор не найден' });
    res.json(author);
});

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Добавить нового автора
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Автор создан
 */
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name обязателен' });
    const author = authors.create({ name });
    res.status(201).json(author);
});

module.exports = router;
