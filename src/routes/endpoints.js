const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const endpointController = require('../controllers/endpointController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Endpoint:
 *       type: object
 *       required:
 *         - path
 *         - method
 *         - response
 *       properties:
 *         id:
 *           type: string
 *         path:
 *           type: string
 *           example: "/users"
 *         method:
 *           type: string
 *           enum: [GET, POST, PUT, DELETE, PATCH]
 *         statusCode:
 *           type: integer
 *           default: 200
 *         response:
 *           type: object
 *           example: {"message": "Hello World"}
 *         headers:
 *           type: object
 *           example: {"Content-Type": "application/json"}
 *         delay:
 *           type: integer
 *           default: 0
 */

/**
 * @swagger
 * /api/endpoints/mock/{mockId}:
 *   get:
 *     summary: Get all endpoints for a specific mock
 *     tags: [Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mockId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of endpoints
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Endpoint'
 */
router.get('/mock/:mockId', authenticateToken, endpointController.getEndpointsByMock);

/**
 * @swagger
 * /api/endpoints/mock/{mockId}:
 *   post:
 *     summary: Create a new endpoint for a mock
 *     tags: [Endpoints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mockId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - path
 *               - method
 *               - response
 *             properties:
 *               path:
 *                 type: string
 *                 example: "/users"
 *               method:
 *                 type: string
 *                 enum: [GET, POST, PUT, DELETE, PATCH]
 *               statusCode:
 *                 type: integer
 *                 default: 200
 *               response:
 *                 type: object
 *               headers:
 *                 type: object
 *               delay:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Endpoint created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Endpoint'
 */
router.post('/mock/:mockId', [
  authenticateToken,
  body('path')
    .notEmpty()
    .withMessage('Path is required')
    .matches(/^\/.*/)
    .withMessage('Path must start with /'),
  body('method')
    .isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
    .withMessage('Method must be GET, POST, PUT, DELETE, or PATCH'),
  body('statusCode')
    .optional()
    .isInt({ min: 100, max: 599 })
    .withMessage('Status code must be between 100 and 599'),
  body('response')
    .notEmpty()
    .withMessage('Response is required'),
  body('delay')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Delay must be a positive integer')
], endpointController.createEndpoint);

/**
 * @swagger
 * /api/endpoints/{id}:
 *   get:
 *     summary: Get endpoint by ID
 *     tags: [Endpoints]
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
 *         description: Endpoint details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Endpoint'
 */
router.get('/:id', authenticateToken, endpointController.getEndpointById);

/**
 * @swagger
 * /api/endpoints/{id}:
 *   put:
 *     summary: Update endpoint
 *     tags: [Endpoints]
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
 *               path:
 *                 type: string
 *               method:
 *                 type: string
 *                 enum: [GET, POST, PUT, DELETE, PATCH]
 *               statusCode:
 *                 type: integer
 *               response:
 *                 type: object
 *               headers:
 *                 type: object
 *               delay:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Endpoint updated successfully
 */
router.put('/:id', [
  authenticateToken,
  body('path')
    .optional()
    .matches(/^\/.*/)
    .withMessage('Path must start with /'),
  body('method')
    .optional()
    .isIn(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
    .withMessage('Method must be GET, POST, PUT, DELETE, or PATCH'),
  body('statusCode')
    .optional()
    .isInt({ min: 100, max: 599 })
    .withMessage('Status code must be between 100 and 599'),
  body('delay')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Delay must be a positive integer')
], endpointController.updateEndpoint);

/**
 * @swagger
 * /api/endpoints/{id}:
 *   delete:
 *     summary: Delete endpoint
 *     tags: [Endpoints]
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
 *         description: Endpoint deleted successfully
 */
router.delete('/:id', authenticateToken, endpointController.deleteEndpoint);

module.exports = router;