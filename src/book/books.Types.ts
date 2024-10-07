import { IUser } from "../user/userTypes";

export interface IBook {
    _id: string;
    title: string;
    authorName: IUser;
    genre: string;
    coverImage: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
}