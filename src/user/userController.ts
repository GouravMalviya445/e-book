import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // validation 
    if (!name || !email || !password) {
        const error = createHttpError(400, "All feilds are required");
        return next(error); 
    }

    // process
    // response

    res.status(200).json({
        message: "user created",
    })
}

export { createUser };