import Joi from 'joi';
import { IFeaturedProject } from '../interfaces/FeaturedProject.interface';
import { USER_STATUS } from '../constants/enum.status';

export const createFeaturedProjectSchema = Joi.object<IFeaturedProject>({
    name: Joi.string().trim().min(3).required().messages({
        'string.base': 'Tên dự án phải là chuỗi',
        'string.min': 'Tên dự án phải có ít nhất 3 ký tự',
        'string.empty': 'Tên dự án không được để trống',
        'any.required': 'Vui lòng nhập tên dự án tiêu biểu',
    }),
    description: Joi.string().trim().min(5).required().messages({
        'string.base': 'Mô tả phải là chuỗi',
        'string.min': 'Mô tả phải có ít nhất 5 ký tự',
        'string.empty': 'Mô tả không được để trống',
        'any.required': 'Vui lòng nhập mô tả dự án tiêu biểu',
    }),
    customer: Joi.string().trim().allow('', null).messages({
        'string.base': 'Tên khách hàng phải là chuỗi',
    }),
    industry: Joi.string().trim().allow('', null).messages({
        'string.base': 'Lĩnh vực phải là chuỗi',
    }),
    thumbnailUrl: Joi.string().allow('', null).messages({
        'string.base': 'Thumbnail phải là chuỗi',
        'string.uri': 'Thumbnail phải là một URL hợp lệ',
    }),
    link: Joi.string().allow('', null).messages({
        'string.base': 'Link phải là chuỗi',
        'string.uri': 'Link phải là một URL hợp lệ',
    }),
    order: Joi.number().integer().min(0).messages({
        'number.base': 'Thứ tự phải là số',
        'number.integer': 'Thứ tự phải là số nguyên',
        'number.min': 'Thứ tự phải lớn hơn hoặc bằng 0',
    }),
    status: Joi.string()
        .valid(...Object.values(USER_STATUS))
        .messages({
            'string.base': 'Trạng thái phải là chuỗi',
            'any.only': `Trạng thái phải là một trong các giá trị: ${Object.values(USER_STATUS).join(', ')}`,
        }),
});

export const updateFeaturedProjectSchema = Joi.object<IFeaturedProject>({
    name: Joi.string().trim().min(3).messages({
        'string.base': 'Tên dự án phải là chuỗi',
        'string.min': 'Tên dự án phải có ít nhất 3 ký tự',
        'string.empty': 'Tên dự án không được để trống',
    }),
    description: Joi.string().trim().min(5).messages({
        'string.base': 'Mô tả phải là chuỗi',
        'string.min': 'Mô tả phải có ít nhất 5 ký tự',
        'string.empty': 'Mô tả không được để trống',
    }),
    customer: Joi.string().trim().allow('', null).messages({
        'string.base': 'Tên khách hàng phải là chuỗi',
    }),
    industry: Joi.string().trim().allow('', null).messages({
        'string.base': 'Lĩnh vực phải là chuỗi',
    }),
    thumbnailUrl: Joi.string().uri().allow('', null).messages({
        'string.base': 'Thumbnail phải là chuỗi',
        'string.uri': 'Thumbnail phải là một URL hợp lệ',
    }),
    link: Joi.string().uri().allow('', null).messages({
        'string.base': 'Link phải là chuỗi',
        'string.uri': 'Link phải là một URL hợp lệ',
    }),
    order: Joi.number().integer().min(0).messages({
        'number.base': 'Thứ tự phải là số',
        'number.integer': 'Thứ tự phải là số nguyên',
        'number.min': 'Thứ tự phải lớn hơn hoặc bằng 0',
    }),
    status: Joi.string()
        .valid(...Object.values(USER_STATUS))
        .messages({
            'string.base': 'Trạng thái phải là chuỗi',
            'any.only': `Trạng thái phải là một trong các giá trị: ${Object.values(USER_STATUS).join(', ')}`,
        }),
})
    .min(1)
    .messages({
        'object.min': 'Vui lòng cập nhật ít nhất một trường',
    });

