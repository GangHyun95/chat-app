import { Types } from 'mongoose';

export type UserFields = {
    googleId?: string | null;
    email: string;
    username: string;
    password?: string | null;
    profilePic: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UserDoc = UserFields & { _id: Types.ObjectId };