export class AppError extends Error {
    constructor(statusCode, code, message) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
    }
}
export const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
            statusCode: err.statusCode,
        });
    }
    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: err.errors,
        });
    }
    // Mongoose cast error
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid ID format',
            code: 'INVALID_ID',
        });
    }
    // MongoDB duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            error: `${field} already exists`,
            code: 'DUPLICATE_KEY',
            field,
        });
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            code: 'INVALID_TOKEN',
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            code: 'TOKEN_EXPIRED',
        });
    }
    // Default server error
    res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
    });
};
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
//# sourceMappingURL=errorHandler.js.map