import { ICategory, ICategoryFilter } from '../interfaces/Category.interface';
import { Category } from '../models/Category.model';
import logger from '../utils/logger';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';
import mongoose from 'mongoose';

class CategoryService {
    // Lấy Category theo ID hoặc name
    async getCategoryById(id: string) {
        logger.info('[CategoryService.getCategoryById] Attempt', { categoryId: id });

        try {
            let category;

            if (mongoose.Types.ObjectId.isValid(id)) {
                category = await Category.findById(id);
            }

            if (!category) {
                category = await Category.findOne({ name: id });
            }

            if (!category) {
                logger.warn('[CategoryService.getCategoryById] Not found', { categoryId: id });
                throw new NotFoundException('Danh mục');
            }

            return category;
        } catch (error) {
            logger.error('[CategoryService.getCategoryById] Error', { err: error, categoryId: id });
            throw error;
        }
    }

    // Lấy danh sách Category
    async getCategories(payload: ICategoryFilter) {
        logger.info('[CategoryService.getCategories] Payload', { payload });

        try {
            const { page = 1, limit = 10, name } = payload;
            const skip = (page - 1) * limit;

            const query: Record<string, unknown> = {};
            if (typeof name === 'string' && name.trim()) {
                query.name = { $regex: name, $options: 'i' };
            }

            const [categories, total] = await Promise.all([
                Category.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
                Category.countDocuments(query),
            ]);

            logger.info('[CategoryService.getCategories] Fetched categories', { count: categories.length });
            return {
                data: categories,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[CategoryService.getCategories] Error', { err: error, payload });
            throw error;
        }
    }

    // Tạo Category mới
    async createCategory(payload: ICategory) {
        logger.info('[CategoryService.createCategory] Attempt', { payload });

        try {
            const { name, description } = payload;
            const existed = await Category.findOne({ name });

            if (existed) {
                logger.warn('[CategoryService.createCategory] Duplicate category', { name });
                throw new DupplicateException('Tên danh mục');
            }

            const newCategory = new Category({ name, description });
            const savedCategory = await newCategory.save();

            logger.info('[CategoryService.createCategory] Success', { categoryId: savedCategory._id, name });
            return savedCategory;
        } catch (error) {
            logger.error('[CategoryService.createCategory] Error', { err: error, payload });
            throw error;
        }
    }

    // Cập nhật Category
    async updateCategory(id: string, payload: ICategory) {
        logger.info('[CategoryService.updateCategory] Attempt', { categoryId: id, payload });

        try {
            const { name } = payload;
            const existed = await Category.findOne({ name } as { name: string });
            if (existed) {
                logger.warn('[CategoryService.updateCategory] Duplicate category', { name });
                throw new DupplicateException('Tên Danh mục');
            }

            const category = await Category.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!category) {
                logger.warn('[CategoryService.updateCategory] Not found', { categoryId: id });
                throw new NotFoundException('Danh mục');
            }

            logger.info('[CategoryService.updateCategory] Success', { categoryId: category._id });
            return category;
        } catch (error) {
            logger.error('[CategoryService.updateCategory] Error', { err: error, categoryId: id, payload });
            throw error;
        }
    }

    // Xoá Category
    async deleteCategory(id: string) {
        logger.info('[CategoryService.deleteCategory] Attempt', { categoryId: id });

        try {
            const category = await Category.findByIdAndDelete(id);

            if (!category) {
                logger.warn('[CategoryService.deleteCategory] Not found', { categoryId: id });
                throw new NotFoundException('Danh mục');
            }

            logger.info('[CategoryService.deleteCategory] Success', { categoryId: category._id });
            return category;
        } catch (error) {
            logger.error('[CategoryService.deleteCategory] Error', { err: error, categoryId: id });
            throw error;
        }
    }
}

export default new CategoryService();
