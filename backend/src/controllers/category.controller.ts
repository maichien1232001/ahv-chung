import { Response, Request } from 'express';
import { Message } from '../constants/messages.contant';
import categoryService from '../services/category.service';
import { errorHandler } from '../middlewares/error.middleware';

// Create Category
export const createCategory = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await categoryService.createCategory(payload);
        return res.status(201).json({
            message: 'Danh mục ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Category by id
export const getCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id as string);
        return res.status(200).json({
            message: 'Danh mục ' + Message.Messages.FOUND,
            data: category,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Category list
export const getCategories = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            name: req.query.name as string,
        };
        const categories = await categoryService.getCategories(payload);
        return res.status(200).json({
            message: 'Danh sách danh mục ' + Message.Messages.FOUND,
            data: categories,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Update Category
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await categoryService.updateCategory(id as string, payload);
        return res.status(200).json({
            message: 'Danh mục ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Delete Category
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(id as string);
        return res.status(200).json({
            message: 'Danh mục ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};
