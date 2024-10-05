import express from 'express';
import createHttpError from 'http-errors';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app = express();

// all routes
app.get("/", function (req, res, next) {
    const error = createHttpError(400, "Something gone wrong");
    next(error);
    throw error;
    res.status(200).json({
        message: "welcome to elib apis"
    });
});


// global error handler
app.use(globalErrorHandler);

export { app };