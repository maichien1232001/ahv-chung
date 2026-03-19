import { IPaging } from './Page.interface';

export interface IMilestone {
    title: string;
    description: string;
    date: number;
    order?: number;
    status?: string;
}

export interface IMilestoneFilter extends IPaging {
    title?: string;
    status?: string;
}

