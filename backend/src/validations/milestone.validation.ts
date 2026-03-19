import Joi from 'joi';
import { IMilestone } from '../interfaces/Milestone.interface';
import { USER_STATUS } from '../constants/enum.status';

export const createMilestoneSchema = Joi.object<IMilestone>({
    title: Joi.string().trim().min(3).required().messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'string.min': 'Tiêu đề phải có ít nhất 3 ký tự',
        'string.empty': 'Tiêu đề không được để trống',
        'any.required': 'Vui lòng nhập tiêu đề cột mốc',
    }),
    description: Joi.string().trim().min(5).required().messages({
        'string.base': 'Mô tả phải là chuỗi',
        'string.min': 'Mô tả phải có ít nhất 5 ký tự',
        'string.empty': 'Mô tả không được để trống',
        'any.required': 'Vui lòng nhập mô tả cột mốc',
    }),
    date: Joi.number()
        .integer()
        .min(1900)
        .max(2100)
        .required()
        .messages({
            'number.base': 'Năm phải là số',
            'number.integer': 'Năm phải là số nguyên',
            'number.min': 'Năm phải lớn hơn hoặc bằng 1900',
            'number.max': 'Năm phải nhỏ hơn hoặc bằng 2100',
            'any.required': 'Vui lòng nhập năm cột mốc',
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

export const updateMilestoneSchema = Joi.object<IMilestone>({
    title: Joi.string().trim().min(3).messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'string.min': 'Tiêu đề phải có ít nhất 3 ký tự',
        'string.empty': 'Tiêu đề không được để trống',
    }),
    description: Joi.string().trim().min(5).messages({
        'string.base': 'Mô tả phải là chuỗi',
        'string.min': 'Mô tả phải có ít nhất 5 ký tự',
        'string.empty': 'Mô tả không được để trống',
    }),
    date: Joi.number()
        .integer()
        .min(1900)
        .max(2100)
        .messages({
            'number.base': 'Năm phải là số',
            'number.integer': 'Năm phải là số nguyên',
            'number.min': 'Năm phải lớn hơn hoặc bằng 1900',
            'number.max': 'Năm phải nhỏ hơn hoặc bằng 2100',
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

