const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const mockController = {
    async getAllMocks(req, res) {
        try {
            const mocks = await prisma.mock.findMany({
                where: { userId: req.user.id },
                include: {
                    endpoints: {
                        select: {
                            id: true,
                            path: true,
                            method: true,
                            statusCode: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            res.json({
                mocks: mocks.map(mock => ({
                    ...mock,
                    endpointCount: mock.endpoints.length,
                    mockUrl: `${req.protocol}://${req.get('host')}/mock/${mock.id}`
                }))
            });

        } catch (error) {
            console.error('Get mocks error:', error);
            res.status(500).json({
                error: 'Failed to retrieve mocks',
                message: 'An error occurred while retrieving mocks'
            });
        }
    },

    async createMock(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }

            const { name, description, baseUrl } = req.body;

            // Verificar que el usuario no tenga un mock con el mismo nombre
            const existingMock = await prisma.mock.findFirst({
                where: {
                    userId: req.user.id,
                    name
                }
            });

            if (existingMock) {
                return res.status(400).json({
                    error: 'Mock already exists',
                    message: 'A mock with this name already exists'
                });
            }

            const mock = await prisma.mock.create({
                data: {
                    name,
                    description,
                    baseUrl,
                    userId: req.user.id
                }
            });

            res.status(201).json({
                message: 'Mock created successfully',
                mock: {
                    ...mock,
                    mockUrl: `${req.protocol}://${req.get('host')}/mock/${mock.id}`
                }
            });

        } catch (error) {
            console.error('Create mock error:', error);
            res.status(500).json({
                error: 'Failed to create mock',
                message: 'An error occurred while creating the mock'
            });
        }
    },

    async getMockById(req, res) {
        try {
            const { id } = req.params;

            const mock = await prisma.mock.findFirst({
                where: {
                    id,
                    userId: req.user.id
                },
                include: {
                    endpoints: {
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });

            if (!mock) {
                return res.status(404).json({
                    error: 'Mock not found',
                    message: 'Mock not found or access denied'
                });
            }

            res.json({
                mock: {
                    ...mock,
                    mockUrl: `${req.protocol}://${req.get('host')}/mock/${mock.id}`
                }
            });

        } catch (error) {
            console.error('Get mock error:', error);
            res.status(500).json({
                error: 'Failed to retrieve mock',
                message: 'An error occurred while retrieving the mock'
            });
        }
    },

    async updateMock(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }

            const { id } = req.params;
            const { name, description, baseUrl, isActive } = req.body;

            // Verificar que el mock existe y pertenece al usuario
            const existingMock = await prisma.mock.findFirst({
                where: {
                    id,
                    userId: req.user.id
                }
            });

            if (!existingMock) {
                return res.status(404).json({
                    error: 'Mock not found',
                    message: 'Mock not found or access denied'
                });
            }

            // Verificar que no exista otro mock con el mismo nombre
            if (name && name !== existingMock.name) {
                const duplicateMock = await prisma.mock.findFirst({
                    where: {
                        userId: req.user.id,
                        name,
                        id: { not: id }
                    }
                });

                if (duplicateMock) {
                    return res.status(400).json({
                        error: 'Mock already exists',
                        message: 'A mock with this name already exists'
                    });
                }
            }

            const updatedMock = await prisma.mock.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(description !== undefined && { description }),
                    ...(baseUrl !== undefined && { baseUrl }),
                    ...(isActive !== undefined && { isActive })
                }
            });

            res.json({
                message: 'Mock updated successfully',
                mock: updatedMock
            });

        } catch (error) {
            console.error('Update mock error:', error);
            res.status(500).json({
                error: 'Failed to update mock',
                message: 'An error occurred while updating the mock'
            });
        }
    },

    async deleteMock(req, res) {
        try {
            const { id } = req.params;

            const existingMock = await prisma.mock.findFirst({
                where: {
                    id,
                    userId: req.user.id
                }
            });

            if (!existingMock) {
                return res.status(404).json({
                    error: 'Mock not found',
                    message: 'Mock not found or access denied'
                });
            }

            await prisma.mock.delete({
                where: { id }
            });

            res.json({
                message: 'Mock deleted successfully'
            });

        } catch (error) {
            console.error('Delete mock error:', error);
            res.status(500).json({
                error: 'Failed to delete mock',
                message: 'An error occurred while deleting the mock'
            });
        }
    }
};

module.exports = mockController;