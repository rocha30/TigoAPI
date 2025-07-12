const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const endpointController = {
    async getEndpointsByMock(req, res) {
        try {
            const { mockId } = req.params;

            // Verificar que el mock existe y pertenece al usuario
            const mock = await prisma.mock.findFirst({
                where: {
                    id: mockId,
                    userId: req.user.id
                }
            });

            if (!mock) {
                return res.status(404).json({
                    error: 'Mock not found',
                    message: 'Mock not found or access denied'
                });
            }

            const endpoints = await prisma.endpoint.findMany({
                where: { mockId },
                orderBy: { createdAt: 'desc' }
            });

            res.json({
                endpoints
            });

        } catch (error) {
            console.error('Get endpoints error:', error);
            res.status(500).json({
                error: 'Failed to retrieve endpoints',
                message: 'An error occurred while retrieving endpoints'
            });
        }
    },

    async createEndpoint(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }

            const { mockId } = req.params;
            const { path, method, statusCode = 200, response, headers, delay = 0 } = req.body;

            // Verificar que el mock existe y pertenece al usuario
            const mock = await prisma.mock.findFirst({
                where: {
                    id: mockId,
                    userId: req.user.id
                }
            });

            if (!mock) {
                return res.status(404).json({
                    error: 'Mock not found',
                    message: 'Mock not found or access denied'
                });
            }

            // Verificar que no existe un endpoint con el mismo path y method
            const existingEndpoint = await prisma.endpoint.findFirst({
                where: {
                    mockId,
                    path,
                    method: method.toUpperCase()
                }
            });

            if (existingEndpoint) {
                return res.status(400).json({
                    error: 'Endpoint already exists',
                    message: 'An endpoint with this path and method already exists'
                });
            }

            const endpoint = await prisma.endpoint.create({
                data: {
                    path,
                    method: method.toUpperCase(),
                    statusCode,
                    response,
                    headers,
                    delay,
                    mockId
                }
            });

            res.status(201).json({
                message: 'Endpoint created successfully',
                endpoint
            });

        } catch (error) {
            console.error('Create endpoint error:', error);
            res.status(500).json({
                error: 'Failed to create endpoint',
                message: 'An error occurred while creating the endpoint'
            });
        }
    },

    async getEndpointById(req, res) {
        try {
            const { id } = req.params;

            const endpoint = await prisma.endpoint.findFirst({
                where: { id },
                include: {
                    mock: {
                        select: {
                            id: true,
                            name: true,
                            userId: true
                        }
                    }
                }
            });

            if (!endpoint) {
                return res.status(404).json({
                    error: 'Endpoint not found',
                    message: 'Endpoint not found'
                });
            }

            // Verificar que el usuario tiene acceso al mock
            if (endpoint.mock.userId !== req.user.id) {
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'You do not have permission to access this endpoint'
                });
            }

            res.json({
                endpoint
            });

        } catch (error) {
            console.error('Get endpoint error:', error);
            res.status(500).json({
                error: 'Failed to retrieve endpoint',
                message: 'An error occurred while retrieving the endpoint'
            });
        }
    },

    async updateEndpoint(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }

            const { id } = req.params;
            const { path, method, statusCode, response, headers, delay } = req.body;

            const endpoint = await prisma.endpoint.findFirst({
                where: { id },
                include: {
                    mock: {
                        select: {
                            id: true,
                            userId: true
                        }
                    }
                }
            });

            if (!endpoint) {
                return res.status(404).json({
                    error: 'Endpoint not found',
                    message: 'Endpoint not found'
                });
            }

            // Verificar que el usuario tiene acceso al mock
            if (endpoint.mock.userId !== req.user.id) {
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'You do not have permission to update this endpoint'
                });
            }

            // Verificar que no existe otro endpoint con el mismo path y method
            if (path && method) {
                const existingEndpoint = await prisma.endpoint.findFirst({
                    where: {
                        mockId: endpoint.mockId,
                        path,
                        method: method.toUpperCase(),
                        id: { not: id }
                    }
                });

                if (existingEndpoint) {
                    return res.status(400).json({
                        error: 'Endpoint already exists',
                        message: 'An endpoint with this path and method already exists'
                    });
                }
            }

            const updatedEndpoint = await prisma.endpoint.update({
                where: { id },
                data: {
                    ...(path && { path }),
                    ...(method && { method: method.toUpperCase() }),
                    ...(statusCode && { statusCode }),
                    ...(response && { response }),
                    ...(headers !== undefined && { headers }),
                    ...(delay !== undefined && { delay })
                }
            });

            res.json({
                message: 'Endpoint updated successfully',
                endpoint: updatedEndpoint
            });

        } catch (error) {
            console.error('Update endpoint error:', error);
            res.status(500).json({
                error: 'Failed to update endpoint',
                message: 'An error occurred while updating the endpoint'
            });
        }
    },

    async deleteEndpoint(req, res) {
        try {
            const { id } = req.params;

            const endpoint = await prisma.endpoint.findFirst({
                where: { id },
                include: {
                    mock: {
                        select: {
                            userId: true
                        }
                    }
                }
            });

            if (!endpoint) {
                return res.status(404).json({
                    error: 'Endpoint not found',
                    message: 'Endpoint not found'
                });
            }

            // Verificar que el usuario tiene acceso al mock
            if (endpoint.mock.userId !== req.user.id) {
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'You do not have permission to delete this endpoint'
                });
            }

            await prisma.endpoint.delete({
                where: { id }
            });

            res.json({
                message: 'Endpoint deleted successfully'
            });

        } catch (error) {
            console.error('Delete endpoint error:', error);
            res.status(500).json({
                error: 'Failed to delete endpoint',
                message: 'An error occurred while deleting the endpoint'
            });
        }
    }
};

module.exports = endpointController;
