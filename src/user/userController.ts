import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { User } from './userModels';
import jwt from "jsonwebtoken";
import { config } from '../config/config';
import bcrypt from 'bcrypt';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // validation 
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error); 
    }

    // database call see if the user is already exist
    try {
        const user = await User.findOne({ email });
        if (user) {
            const error = createHttpError(400, "User already exist with this email");
            return next(error);
        }
        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return next(createHttpError(500, "Error white getting the user"));
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // process
        const newUser = await User.create({ name, email, password: hashedPassword });

        try {
            // token generation
            const token = jwt.sign({ sub: newUser._id, }, config.jwtPrivateKey as string, { expiresIn: config.jwtExpiry });

            // response
            res.status(201).json({
                accessToken: token
            });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            return next(createHttpError(500, "Error while generating the jwt token"));
        }        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return next(createHttpError(500, "Error while creating the user"));
    }

}

export {
    createUser,
};