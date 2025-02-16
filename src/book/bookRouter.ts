import express from "express";
import { createBook, listBook, updateBook, getBook, deleteBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import { authenticate } from "../middlewares/authenticate";

const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: {
        fileSize: 10 * 1024 * 1024 // max limit 10 mb
    }
});

bookRouter.post("/", authenticate, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 }
]), createBook);


bookRouter.patch("/:bookId", authenticate, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 }
]), updateBook);

bookRouter.get("/", listBook);

bookRouter.get("/:bookId", getBook);

bookRouter.delete("/:bookId", authenticate, deleteBook);


export { bookRouter };