const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const booksRouter = require('./routes/books');
const authorsRouter = require('./routes/authors');
const categoriesRouter = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Book Library API'
}));

app.use('/api/books', booksRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/categories', categoriesRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'Book Library API',
        docs: '/api-docs'
    });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;
