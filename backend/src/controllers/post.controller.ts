import { Response, Request } from 'express';
import { Message } from '../constants/messages.contant';
import postService from '../services/post.service';
import { errorHandler } from '../middlewares/error.middleware';

// Tạo bài viết
export const createPost = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await postService.createPost(payload);
        return res.status(201).json({
            message: 'Bài viết ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Lấy danh sách bài viết
export const getPosts = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            title: req.query.title as string,
            categoryId: req.query.categoryId as string,
            tags: req.query.tags as string,
            status: req.query.status as string,
        };
        const posts = await postService.getPosts(payload);
        return res.status(200).json({
            message: 'Danh sách bài viết ' + Message.Messages.FOUND,
            data: posts,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Lấy bài viết theo ID
export const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await postService.getPost(id as string);
        return res.status(200).json({
            message: 'Bài viết ' + Message.Messages.FOUND,
            data: post,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Cập nhật bài viết
export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await postService.updatePost(payload, id as string);
        return res.status(200).json({
            message: 'Bài viết ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Xoá bài viết
export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await postService.deletePost(id as string);
        return res.status(200).json({
            message: 'Bài viết ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};
