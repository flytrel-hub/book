const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Book Library API',
            version: '1.0.0',
            description: 'REST API для управления библиотекой книг',
        },
        servers: [
            {
                url: '/',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
