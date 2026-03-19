import { IPaging } from './Page.interface';

export interface IOperatingField {
    name: string;
    description: string;
    icon?: string;
    order?: number;
    status?: string;
}

export interface IOperatingFieldFilter extends IPaging {
    name?: string;
    status?: string;
}

