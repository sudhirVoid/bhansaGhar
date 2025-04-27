import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack); // Log the error for debugging
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        data: null,
        error: err.error || null,
    });
}