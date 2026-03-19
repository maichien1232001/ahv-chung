import { IPaging } from './Page.interface';

export interface IJDCreate {
    title: string;
    position: string;
    salary: string;
    experience: string;
    level: string;
    jobType: string;
    gender: string;
    location: string;
    description: string;
    requirements: string;
    benefits: string;
    quantity: number;
    expiredAt: Date;
}

export interface IJDUpdate {
    title?: string;
    position?: string;
    salary?: string;
    experience?: string;
    level?: string;
    jobType?: string;
    gender?: string;
    location?: string;
    description?: string;
    requirements?: string;
    benefits?: string;
    quantity?: number;
    expiredAt?: Date;
}

export interface IJDFilter extends IPaging {
    title?: string;
    location?: string;
}
