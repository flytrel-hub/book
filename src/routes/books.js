const express = require('express');
const router = express.Router();
const books = require('../data/books');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         authorId:
 *           type: integer
 *         categoryId:
 *           type: integer
 *         year:
 *           type: integer
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Получить список всех книг
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Список книг
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', (req, res) => {
    res.json(books.getAll());
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Получить книгу по ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Книга найдена
 *       404:
 *         description: Книга не найдена
 */
router.get('/:id', (req, res) => {
    const book = books.getById(parseInt(req.params.id));
    if (!book) return res.status(404).json({ error: 'Книга не найдена' });
    res.json(book);
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Добавить новую книгу
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, authorId, categoryId]
 *             properties:
 *               title:
 *                 type: string
 *               authorId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Книга создана
 */
router.post('/', (req, res) => {
    const { title, authorId, categoryId, year } = req.body;
    if (!title || !authorId || !categoryId) {
        return res.status(400).json({ error: 'title, authorId, categoryId обязательны' });
    }
    const book = books.create({ title, authorId, categoryId, year });
    res.status(201).json(book);
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Обновить книгу
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               authorId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Книга обновлена
 *       404:
 *         description: Книга не найдена
 */
router.put('/:id', (req, res) => {
    const book = books.update(parseInt(req.params.id), req.body);
    if (!book) return res.status(404).json({ error: 'Книга не найдена' });
    res.json(book);
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Удалить книгу
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Книга удалена
 *       404:
 *         description: Книга не найдена
 */
router.delete('/:id', (req, res) => {
    const removed = books.remove(parseInt(req.params.id));
    if (!removed) return res.status(404).json({ error: 'Книга не найдена' });
    res.json({ message: 'Книга удалена', id: parseInt(req.params.id) });
});

module.exports = router;
