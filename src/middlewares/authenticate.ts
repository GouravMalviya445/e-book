import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface IAuthRequest extends Request {
    userId: string;
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    // get users token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return next(createHttpError(401, "authorization token is required"));
    }
    // console.log(token)

    try {
        const decode = jwt.verify(token, config.accessTokenKey as string);
        // console.log("Decoded: ", decode)
        
        const _req = req as IAuthRequest;
        _req.userId = decode.sub as string;
        
    } catch (err) {
        console.log("Error in decoding the jwt token: ", err);
        return next(createHttpError(400, "token expired"));
    }
    
    next();
}; 

export {
    authenticate
};