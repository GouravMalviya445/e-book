import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/clooudinary";
import path from "node:path";
import createHttpError from "http-errors";
import { Book } from "./bookModel";
import fs from "node:fs";
import { IAuthRequest } from "../middlewares/authenticate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createBook = async (req: Request, res: Response, next: NextFunction) => {

    const { title, genre } = req.body;

    // console.log("Files: ", req   .files);

    // Type for multer
    const files = req.files as { [filename: string]: Express.Multer.File[] };

    // for cover image 
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const coverImageFileName = files.coverImage[0].filename;
    const coverImageFilePath = path.resolve(__dirname, "../../public/data/uploads", coverImageFileName);

    //for book pdf 
    const bookMimeType = files.file[0].mimetype.split("/").at(-1);
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname, "../../public/data/uploads", bookFileName);
    
    try {
        // upload cover image
        const coverImageUpload = await cloudinary.uploader.upload(coverImageFilePath, {
            filename_override: coverImageFileName,
            folder: "book-covers",
            format: coverImageMimeType
        });

        // upload book pdf
        const bookUpload = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: bookFileName,
            folder: "books-pdfs",
            format: bookMimeType
        });
        console.log("Cover Image upload result",coverImageUpload);
        console.log("Book upload result", bookUpload);
        
        const _req = req as IAuthRequest;
        try {
            const newBook = await Book.create({
                title,
                genre,
                authorName: _req.userId,
                coverImage: coverImageUpload.secure_url,
                file: bookUpload.secure_url
            });
            
            // delete temp files
            try {          
                await fs.promises.unlink(coverImageFilePath);
                await fs.promises.unlink(bookFilePath);
                
            } catch (err) {
                console.log("Error in unlinking the file from the server", err);
                return next(createHttpError(400, "Error while unlinking the book"));
                
            }

            res.status(200).json({
                _id: newBook._id
            });
        } catch (err) {
            console.log(err)
            return next(createHttpError(400, "Error while creating book"));
        }

        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return next(createHttpError(400, "Error while uploading files to cloudinary"));
    }

    res.json({message: "book is successfully created"});
}


export {
    createBook
};