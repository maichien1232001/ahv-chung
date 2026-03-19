import { IPaging } from './Page.interface';

export interface IFeaturedProject {
    name: string;
    description: string;
    customer?: string;
    industry?: string;
    thumbnailUrl?: string;
    link?: string;
    order?: number;
    status?: string;
}

export interface IFeaturedProjectFilter extends IPaging {
    name?: string;
    status?: string;
}

