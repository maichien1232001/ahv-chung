import { IPaging } from './Page.interface';

export interface ICustomerFeedback {
    customerName: string;
    content: string;
    position?: string;
    company?: string;
    avatarUrl?: string;
    order?: number;
    status?: string;
}

export interface ICustomerFeedbackFilter extends IPaging {
    customerName?: string;
    status?: string;
}

