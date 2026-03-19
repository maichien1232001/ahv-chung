import { IPaging } from './Page.interface';

export interface IManagementMember {
    name: string;
    position: string;
    avatarUrl?: string;
    description?: string;
    order?: number;
    status?: string;
}

export interface IManagementMemberFilter extends IPaging {
    name?: string;
    status?: string;
}

