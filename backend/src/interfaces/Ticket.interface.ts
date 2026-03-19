import { IPaging } from './Page.interface';
export interface ITicketCreate {
    fullname: string;
    phone: string;
    email: string;
    description: string;
}

export interface ITicketUpdateStatus {
    status: string;
}
export interface ITicketFilter extends IPaging {
    status?: string;
}
