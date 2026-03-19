import { IPaging } from './Page.interface';

export interface IPost {
    title: string;
    content: string;
    categoryId: string;
    tags: string[];
    imageUrl: string;
    status: string;
}

export interface IUpdatePost {
    title?: string;
    content?: string;
    categoryId?: string;
    tags?: string[];
    imageUrl?: string;
    status?: string;
}

export interface IPostFilter extends IPaging {
    title?: string;
    categoryId?: string;
    tags?: string;
    status?: string;
}
