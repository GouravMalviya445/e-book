import mongoose from "mongoose";
import { IBook } from "./books.Types";

const bookSchema = new mongoose.Schema<IBook>({
    title: {
        type: String,
        required: true
    },
    authorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const Book = mongoose.model<IBook>("Book", bookSchema);