const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { error } = require('console');

const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Access token is required',
                message: 'Pleas provide a valid acces token'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, username: true }
        });

        if (!user) {
            return res.status(401).json({
                error: 'User not found',
                message: 'The user associated with this token no longer exists'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token',
                message: 'The provided token is invalid'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                message: 'The provided token has expired'
            });
        }

        console.error('Auth middleware error:', error);
        res.status(500).json({
            error: 'Authentication error',
            message: 'An error occurred during authentication'
        });
    }
};

module.exports = { authenticateToken };