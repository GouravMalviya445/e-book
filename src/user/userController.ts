import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { User } from './userModels';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // validation 
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error); 
    }

    // database call see if the user is already exist
    const user = await User.findOne({ email });
    if (user) {
        const error = createHttpError(400, "User already exist with this email");
        return next(error);
    }

    // process
    // response

    res.status(200).json({
        message: "user created",
    })
}

export { createUser };