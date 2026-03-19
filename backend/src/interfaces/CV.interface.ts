import { IPaging } from './Page.interface';

export interface ICVCreate {
    filePath: string;
    jobDescriptionId: string;
}

export interface ICVUpdateStatus {
    status: string;
}

export interface ICVFilter extends IPaging {
    jobDescriptionId?: string;
}
