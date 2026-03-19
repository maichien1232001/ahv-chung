import { IPaging } from './Page.interface';

export interface ICategory {
    name: string;
    description: string;
}

export interface ICategoryFilter extends IPaging {
    name?: string;
}
