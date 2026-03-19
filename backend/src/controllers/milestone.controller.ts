import { Request, Response } from 'express';
import { Message } from '../constants/messages.contant';
import milestoneService from '../services/milestone.service';
import { errorHandler } from '../middlewares/error.middleware';

// Create Milestone
export const createMilestone = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await milestoneService.createMilestone(payload);
        return res.status(201).json({
            message: 'Cột mốc ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Milestone by id
export const getMilestone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const milestone = await milestoneService.getMilestoneById(id as string);
        return res.status(200).json({
            message: 'Cột mốc ' + Message.Messages.FOUND,
            data: milestone,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Milestone list
export const getMilestones = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            title: req.query.title as string,
            status: req.query.status as string,
        };
        const milestones = await milestoneService.getMilestones(payload);
        return res.status(200).json({
            message: 'Danh sách cột mốc ' + Message.Messages.FOUND,
            data: milestones,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Update Milestone
export const updateMilestone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await milestoneService.updateMilestone(id as string, payload);
        return res.status(200).json({
            message: 'Cột mốc ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Delete Milestone
export const deleteMilestone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await milestoneService.deleteMilestone(id as string);
        return res.status(200).json({
            message: 'Cột mốc ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

