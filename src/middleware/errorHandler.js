const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Prisma errors
    if (err.code === 'P2002') {
        return res.status(400).json({
            error: 'Duplicate entry',
            message: 'A record with this information already exists'
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Record not found',
            message: 'The requested record was not found'
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            message: err.message,
            details: err.errors
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            message: 'The provided token is invalid'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            message: 'The provided token has expired'
        });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal server error' : 'Request failed',
        message: process.env.NODE_ENV === 'development' ? message : 'Something went wrong'
    });
};

module.exports = errorHandler;