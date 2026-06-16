const express = require('express');
const router = express.Router();
const categories = require('../data/categories');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Получить список всех категорий
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', (req, res) => {
    res.json(categories.getAll());
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Получить категорию по ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Категория найдена
 *       404:
 *         description: Категория не найдена
 */
router.get('/:id', (req, res) => {
    const category = categories.getById(parseInt(req.params.id));
    if (!category) return res.status(404).json({ error: 'Категория не найдена' });
    res.json(category);
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Добавить новую категорию
 *     tags: [Categories]
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
 *         description: Категория создана
 */
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name обязателен' });
    const category = categories.create({ name });
    res.status(201).json(category);
});

module.exports = router;
