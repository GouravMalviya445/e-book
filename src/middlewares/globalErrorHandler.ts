import { HttpError } from 'http-errors';
import { config } from '../config/config';
import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function globalErrorHandler(err: HttpError, req: Request, res: Response, next: NextFunction){
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === "development" ? err.stack : ""
    })

    return;
}

export { globalErrorHandler };