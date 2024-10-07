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
        
        // process
        const newUser = await User.create({ name, email, password });

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

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // validation 
    if (!email || !password) {
        return next(createHttpError(400, "All fields are required"));
    }
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(createHttpError(404, "User not found"));
        }

        // match the password
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return next(createHttpError(400, "Incorrect username or password"));
        }

        try {
            // create access token
            const token = jwt.sign({ sub: user._id }, config.accessTokenKey as string, { expiresIn: config.accessTokenExpiry });
            
            res.status(200).json({accessToken: token});
        
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return next(createHttpError(500, "Error while generating access token"));
        }
        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return next(createHttpError(500, "Error while finding the user"));
    }
        
}

export {
    createUser,
    loginUser
};