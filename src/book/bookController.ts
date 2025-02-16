import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/clooudinary";
import path from "node:path";
import createHttpError from "http-errors";
import { Book } from "./bookModel";
import fs from "node:fs";
import { IAuthRequest } from "../middlewares/authenticate";

// create Book endpoint
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
}

// update book endpoint
const updateBook = async (req: Request, res: Response, next: NextFunction) => { 

    const { title, genre } = req.body;
    
    if (!title || !genre) {
        return next(createHttpError(400, "all fields are required"));
    }

    
    const files = req.files as { [filename: string]: Express.Multer.File[] }
    
    let completeCoverImage = ""
    let coverImgFilePath;
    if (files.coverImage) {
        // for cover image
        const coverImgFileName = files["coverImage"][0].filename;
        const coverImgMimeType = files["coverImage"][0].mimetype;
        coverImgFilePath = path.resolve(__dirname, "../../public/data/uploads", coverImgFileName);

        // new coverImage upload
        const uploadNewCoverImage = await cloudinary.uploader.upload(coverImgFilePath, {
            filename_override: coverImgFileName + "." + coverImgMimeType,
            folder: "book-covers",
            formate: coverImgMimeType
        });
        completeCoverImage = uploadNewCoverImage.secure_url;
    } else {
        return next(createHttpError(400, "All fields are required"));
    }
    
    let completeBookFile = "";
    let bookFilePath;
    if (files.coverImage) { 
        // for book
        const bookFileName = files["file"][0].filename;
        const bookMimeType = files["file"][0].mimetype;
        bookFilePath = path.resolve(__dirname, "../../public/data/uploads", bookFileName);

        // new book upload
        const uploadNewBook = await cloudinary.uploader.upload(bookFilePath, {
            filename_override: bookFileName + "." + bookMimeType,
            folder: "book-pdfs",
            formate: bookMimeType
        });

        completeBookFile = uploadNewBook.secure_url;
    } else {
        return next(createHttpError(400, "All fields are required"));
    }
    
    try {

        // update the book
        const { bookId } = req.params;
        try {
            if (!bookId) next(createHttpError(400, "userId is required"));
        
            let updatedBook;
            if (completeCoverImage && completeBookFile) {
                updatedBook = await Book.findOneAndUpdate({ _id: bookId }, {
                    title,
                    genre,
                    coverImage: completeCoverImage,
                    file: completeBookFile
                });
            } else if (completeCoverImage) {
                updatedBook = await Book.findOneAndUpdate({ _id: bookId }, {
                    title,
                    genre,
                    coverImage: completeCoverImage,
                });
            } else if (completeBookFile) {
                updatedBook = await Book.findOneAndUpdate({ _id: bookId }, {
                    title,
                    genre,
                    file: completeBookFile
                });
            }

            if (!updatedBook) next(createHttpError(404, "404 not found"));

            if (coverImgFilePath) await fs.promises.unlink(coverImgFilePath);
            if (bookFilePath) await fs.promises.unlink(bookFilePath);
                        

            res.status(201).json(updatedBook);
        } catch (error) {
            console.log("Error while getting the book from DB: ", error);
            return next(createHttpError(400, "Error in getting the book"));
        }
        
    } catch (err) {
        console.log("Error while uploading the file: ", err);
        return next(createHttpError(400, "Error while uploading the file"));
    }

}

// list all book endpoint
const listBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find();
        res.json({ books });
    } catch (error) {
        console.log("Error in getting the books: ", error);
        return next(createHttpError(500, "Error while getting the books"));
    }
}

// get single book endpoint
const getBook = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const { bookId } = req.params;
        if (!bookId) return next(createHttpError(500, "bookId is required"));

        const book = await Book.findById(bookId);
        
        if (!book) return next(createHttpError(404, "404 not found!"));

        res.status(200).json(book);

    } catch (error) {
        console.log("Error in getting a book: ", error);
        return next(createHttpError(500, "Error while getting the book"));
    }
}

// delete single book
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId } = req.params;
        if (!bookId)
            return next(createHttpError(500, "bookId is required"));

        const book = await Book.findById(bookId);
        if (!book) 
            return next(createHttpError(404, "404 not found!"));

        // check access
        const _req = req as IAuthRequest;
        if (book.authorName.toString() !== _req.userId) 
            return next(createHttpError(401, "you do not have any access to remove others book!"));

        try {
            // publicId of cloudinary: book-covers/jibg83uvyauwojvjabir
            const coverFileSplits = book.coverImage.split("/");
            const coverImagePublicId = `${coverFileSplits.at(-2)}/${coverFileSplits.at(-1)?.split(".").at(0)}`

            const fileSplits = book.file.split("/");
            const filePublicId = `${fileSplits.at(-2)}/${fileSplits.at(-1)}`;

            await cloudinary.uploader.destroy(coverImagePublicId);
            await cloudinary.uploader.destroy(filePublicId, {
                resource_type: "raw"
            });

        } catch (err) {
            console.log("Error while destroying the files of cloudinary: ", err);
            return next(createHttpError(400, "Error while destroying the files"));
        }

        await Book.deleteOne({ _id: bookId });
    
        res.sendStatus(204);
        
    } catch (error) {
        console.log('Error in deleting the book: ', error);
        return next(createHttpError(500, "Error while deleting the book"));
    }
}

export {
    createBook,
    updateBook,
    listBook,
    getBook,
    deleteBook
};