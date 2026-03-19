import { Post } from '../models/Post.model';
import { IPost, IPostFilter, IUpdatePost } from '../interfaces/Post.interface';
import logger from '../utils/logger';
import { NotFoundException } from '../utils/ErrorHandler';
import { Category } from '../models/Category.model';

class PostService {
    // Lấy danh sách bài viết
    async getPosts(payload: IPostFilter) {
        logger.info('[PostService.getPosts] Payload', { payload });

        try {
            const { page = 1, limit = 10, title, categoryId, tags, status } = payload;

            const skip = (page - 1) * limit;

            const query: Record<string, unknown> = {};

            if (typeof title === 'string' && title.trim()) {
                query.title = { $regex: title, $options: 'i' };
            }

            if (typeof categoryId === 'string' && categoryId.trim()) {
                query.categoryId = categoryId.trim();
            }

            if (typeof status === 'string' && status.trim()) {
                query.status = status.trim();
            }

            if (typeof tags === 'string' && tags.trim()) {
                const tagArr = tags.split(',').map((t) => t.trim());
                query.tags = { $in: tagArr };
            }

            const [posts, total] = await Promise.all([
                Post.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
                Post.countDocuments(query),
            ]);

            logger.info('[PostService.getPosts] Fetched posts', { count: posts.length });

            return {
                data: posts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[PostService.getPosts] Error', { err: error });
            throw error;
        }
    }

    // Lấy bài viết theo id
    async getPost(id: string) {
        logger.info('[PostService.getPost] Post ID', { postId: id });

        try {
            const post = await Post.findById(id);

            if (!post) {
                logger.warn('[PostService.getPost] Not found', { postId: id });
                throw new NotFoundException('Bài viết');
            }

            return post;
        } catch (error) {
            logger.error('[PostService.getPost] Error', { err: error, postId: id });
            throw error;
        }
    }

    // Tạo bài viết mới
    async createPost(payload: IPost) {
        logger.info('[PostService.createPost] Attempt', { payload });

        try {
            const { title, content, categoryId, tags, imageUrl } = payload;

            const existedCategory = await Category.findById(categoryId);
            if (!existedCategory) {
                logger.warn('[PostService.createPost] Category not found', { categoryId });
                throw new NotFoundException('Danh mục');
            }

            const newPost = new Post({
                title,
                content,
                categoryId,
                tags,
                imageUrl,
            });

            const savedPost = await newPost.save();
            logger.info('[PostService.createPost] Success', { postId: savedPost._id, title });

            return savedPost;
        } catch (error) {
            logger.error('[PostService.createPost] Error', { err: error });
            throw error;
        }
    }

    // Cập nhật bài viết
    async updatePost(payload: IUpdatePost, id: string) {
        logger.info('[PostService.updatePost] Attempt', { postId: id, payload });

        try {
            const post = await Post.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!post) {
                logger.warn('[PostService.updatePost] Post not found', { postId: id });
                throw new NotFoundException('Bài viết');
            }

            logger.info('[PostService.updatePost] Success', { postId: post._id });
            return post;
        } catch (error) {
            logger.error('[PostService.updatePost] Error', { err: error, postId: id });
            throw error;
        }
    }

    // Xoá bài viết
    async deletePost(id: string) {
        logger.info('[PostService.deletePost] Attempt', { postId: id });

        try {
            const post = await Post.findByIdAndDelete(id);

            if (!post) {
                logger.warn('[PostService.deletePost] Post not found', { postId: id });
                throw new NotFoundException('Bài viết');
            }

            logger.info('[PostService.deletePost] Success', { postId: post._id });
            return post;
        } catch (error) {
            logger.error('[PostService.deletePost] Error', { err: error, postId: id });
            throw error;
        }
    }
}

export default new PostService();
