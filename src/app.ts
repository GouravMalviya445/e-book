import express from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { userRouter } from './user/userRouter';

const app = express();

// globle middleware
app.use(express.json());

// all routes
app.use("/api/users", userRouter);


// global error handler
app.use(globalErrorHandler);

export { app };