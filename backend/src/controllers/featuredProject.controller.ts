import { Request, Response } from 'express';
import { Message } from '../constants/messages.contant';
import featuredProjectService from '../services/featuredProject.service';
import { errorHandler } from '../middlewares/error.middleware';

// Create Featured Project
export const createFeaturedProject = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await featuredProjectService.createFeaturedProject(payload);
        return res.status(201).json({
            message: 'Dự án tiêu biểu ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Featured Project by id
export const getFeaturedProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await featuredProjectService.getFeaturedProjectById(id as string);
        return res.status(200).json({
            message: 'Dự án tiêu biểu ' + Message.Messages.FOUND,
            data: project,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Featured Project list
export const getFeaturedProjects = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            name: req.query.name as string,
            status: req.query.status as string,
        };
        const projects = await featuredProjectService.getFeaturedProjects(payload);
        return res.status(200).json({
            message: 'Danh sách dự án tiêu biểu ' + Message.Messages.FOUND,
            data: projects,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Update Featured Project
export const updateFeaturedProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await featuredProjectService.updateFeaturedProject(id as string, payload);
        return res.status(200).json({
            message: 'Dự án tiêu biểu ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Delete Featured Project
export const deleteFeaturedProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await featuredProjectService.deleteFeaturedProject(id as string);
        return res.status(200).json({
            message: 'Dự án tiêu biểu ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

