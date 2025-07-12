const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /mock/{mockId}/{path}:
 *   get:
 *     summary: Execute a mock endpoint
 *     tags: [Mock Execution]
 *     parameters:
 *       - in: path
 *         name: mockId
 *         required: true
 *         schema:
 *           type: string
 *         description: The mock ID
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The endpoint path
 *     responses:
 *       200:
 *         description: Mock response
 *       404:
 *         description: Mock or endpoint not found
 */

// Middleware para manejar cualquier método HTTP con path específico
router.all('/:mockId/*', async (req, res) => {
    try {
        const { mockId } = req.params;
        const path = '/' + (req.params[0] || ''); // Path dinámico
        const method = req.method.toUpperCase();

        // Verificar que el mock existe y está activo
        const mock = await prisma.mock.findFirst({
            where: {
                id: mockId,
                isActive: true
            }
        });

        if (!mock) {
            return res.status(404).json({
                error: 'Mock not found',
                message: 'Mock not found or inactive'
            });
        }

        // Buscar el endpoint específico
        const endpoint = await prisma.endpoint.findFirst({
            where: {
                mockId,
                path,
                method
            }
        });

        if (!endpoint) {
            return res.status(404).json({
                error: 'Endpoint not found',
                message: `Endpoint ${method} ${path} not found in mock`,
                available: await prisma.endpoint.findMany({
                    where: { mockId },
                    select: { method: true, path: true }
                })
            });
        }

        // Aplicar delay si existe
        if (endpoint.delay && endpoint.delay > 0) {
            await new Promise(resolve => setTimeout(resolve, endpoint.delay));
        }

        // Aplicar headers personalizados
        if (endpoint.headers) {
            Object.keys(endpoint.headers).forEach(key => {
                res.set(key, endpoint.headers[key]);
            });
        }

        // Enviar respuesta
        res.status(endpoint.statusCode).json(endpoint.response);

    } catch (error) {
        console.error('Execute mock error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while executing the mock'
        });
    }
});

// Ruta para el path raíz
router.all('/:mockId', async (req, res) => {
    try {
        const { mockId } = req.params;
        const path = '/'; // Path raíz
        const method = req.method.toUpperCase();

        // Verificar que el mock existe y está activo
        const mock = await prisma.mock.findFirst({
            where: {
                id: mockId,
                isActive: true
            }
        });

        if (!mock) {
            return res.status(404).json({
                error: 'Mock not found',
                message: 'Mock not found or inactive'
            });
        }

        // Buscar el endpoint específico
        const endpoint = await prisma.endpoint.findFirst({
            where: {
                mockId,
                path,
                method
            }
        });

        if (!endpoint) {
            return res.status(404).json({
                error: 'Endpoint not found',
                message: `Endpoint ${method} ${path} not found in mock`
            });
        }

        // Aplicar delay si existe
        if (endpoint.delay && endpoint.delay > 0) {
            await new Promise(resolve => setTimeout(resolve, endpoint.delay));
        }

        // Aplicar headers personalizados
        if (endpoint.headers) {
            Object.keys(endpoint.headers).forEach(key => {
                res.set(key, endpoint.headers[key]);
            });
        }

        // Enviar respuesta
        res.status(endpoint.statusCode).json(endpoint.response);

    } catch (error) {
        console.error('Execute mock error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while executing the mock'
        });
    }
});

module.exports = router;