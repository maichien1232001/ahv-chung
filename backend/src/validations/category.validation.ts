import Joi from 'joi';
import { ICategory } from '../interfaces/Category.interface';

export const createCategorySchema = Joi.object<ICategory>({
    name: Joi.string().required().messages({
        'any.required': 'Tên danh mục là bắt buộc',
        'string.empty': 'Tên danh mục không được để trống',
        'string.base': 'Tên danh mục phải là chuỗi',
    }),
    description: Joi.string().messages({
        'string.base': 'Mô tả phải là chuỗi',
    }),
});

export const updateCategorySchema = Joi.object<ICategory>({
    name: Joi.string().messages({
        'string.empty': 'Tên danh mục không được để trống',
        'string.base': 'Tên danh mục phải là chuỗi',
    }),
    description: Joi.string().allow('', null).messages({
        'string.base': 'Mô tả phải là chuỗi',
    }),
});
