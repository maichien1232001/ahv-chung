import { Request, Response } from 'express';
import { Message } from '../constants/messages.contant';
import managementMemberService from '../services/managementMember.service';
import { errorHandler } from '../middlewares/error.middleware';

// Create Management Member
export const createManagementMember = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await managementMemberService.createManagementMember(payload);
        return res.status(201).json({
            message: 'Thành viên ban quản lý ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Management Member by id
export const getManagementMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const member = await managementMemberService.getManagementMemberById(id as string);
        return res.status(200).json({
            message: 'Thành viên ban quản lý ' + Message.Messages.FOUND,
            data: member,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Management Member list
export const getManagementMembers = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            name: req.query.name as string,
            status: req.query.status as string,
        };
        const members = await managementMemberService.getManagementMembers(payload);
        return res.status(200).json({
            message: 'Danh sách thành viên ban quản lý ' + Message.Messages.FOUND,
            data: members,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Update Management Member
export const updateManagementMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await managementMemberService.updateManagementMember(id as string, payload);
        return res.status(200).json({
            message: 'Thành viên ban quản lý ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Delete Management Member
export const deleteManagementMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await managementMemberService.deleteManagementMember(id as string);
        return res.status(200).json({
            message: 'Thành viên ban quản lý ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

