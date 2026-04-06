// server/config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'U.E.N. Pedro Emilio Coll API',
            version: '2.3.0',
            description: 'API para la gestión del sitio web de la U.E.N. Pedro Emilio Coll',
            contact: {
                name: 'Desarrollador',
                email: 'contacto@uenpedroemiliocoll.edu.ve'
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Servidor de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./server/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
