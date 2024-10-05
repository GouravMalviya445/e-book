import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: "user created",
    })
}

export { createUser };