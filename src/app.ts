import express from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { userRouter } from './user/userRouter';
import { bookRouter } from './book/bookRouter';

const app = express();

// globle middleware
app.use(express.json());

// all routes
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);


// global error handler
app.use(globalErrorHandler);

export { app };