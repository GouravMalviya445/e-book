import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createBook = async (req: Request, res: Response, next: NextFunction) => {
    res.json({message: "book is successfully created"});
}


export {
    createBook
};