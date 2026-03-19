import { Types } from 'mongoose';
import { IPaging } from './Page.interface';

export interface IUserCreate {
    name: string;
    username: string;
    password: string;
}

export interface IUserUpdate {
    name?: string;
    username?: string;
    status?: string;
}

export interface IUserResponse {
    id: string;
    username: string;
    name?: string;
    createdAt?: Date;
}

export interface IUserDocument {
    _id: Types.ObjectId;
    username: string;
    name: string;
    createdAt: Date;
}

export interface IUserFilter extends IPaging {
    status?: string;
}
