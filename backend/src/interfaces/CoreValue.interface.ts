import { IPaging } from './Page.interface';

export interface ICoreValue {
    title: string;
    description: string;
    icon?: string;
    order?: number;
    status?: string;
}

export interface ICoreValueFilter extends IPaging {
    title?: string;
    status?: string;
}

