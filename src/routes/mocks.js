const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const mockController = require('../controllers/mockController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Mock:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         baseUrl:
 *           type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/mocks:
 *   get:
 *     summary: Get all mocks for authenticated user
 *     tags: [Mocks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of mocks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mock'
 */
router.get('/', authenticateToken, mockController.getAllMocks);

/**
 * @swagger
 * /api/mocks:
 *   post:
 *     summary: Create a new mock
 *     tags: [Mocks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               baseUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mock created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mock'
 */
router.post('/', [
    authenticateToken,
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters')
], mockController.createMock);

/**
 * @swagger
 * /api/mocks/{id}:
 *   get:
 *     summary: Get mock by ID
 *     tags: [Mocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mock details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mock'
 *       404:
 *         description: Mock not found
 */
router.get('/:id', authenticateToken, mockController.getMockById);

/**
 * @swagger
 * /api/mocks/{id}:
 *   put:
 *     summary: Update mock
 *     tags: [Mocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               baseUrl:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Mock updated successfully
 */
router.put('/:id', [
    authenticateToken,
    body('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters')
], mockController.updateMock);

/**
 * @swagger
 * /api/mocks/{id}:
 *   delete:
 *     summary: Delete mock
 *     tags: [Mocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mock deleted successfully
 *       404:
 *         description: Mock not found
 */
router.delete('/:id', authenticateToken, mockController.deleteMock);

module.exports = router;