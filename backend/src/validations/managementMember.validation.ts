import Joi from 'joi';
import { IManagementMember } from '../interfaces/ManagementMember.interface';
import { USER_STATUS } from '../constants/enum.status';

export const createManagementMemberSchema = Joi.object<IManagementMember>({
    name: Joi.string().trim().min(3).required().messages({
        'string.base': 'Tên phải là chuỗi',
        'string.min': 'Tên phải có ít nhất 3 ký tự',
        'string.empty': 'Tên không được để trống',
        'any.required': 'Vui lòng nhập tên thành viên',
    }),
    position: Joi.string().trim().min(2).required().messages({
        'string.base': 'Chức vụ phải là chuỗi',
        'string.min': 'Chức vụ phải có ít nhất 2 ký tự',
        'string.empty': 'Chức vụ không được để trống',
        'any.required': 'Vui lòng nhập chức vụ',
    }),
    avatarUrl: Joi.string().uri().allow('', null).messages({
        'string.base': 'Avatar phải là chuỗi',
        'string.uri': 'Avatar phải là một URL hợp lệ',
    }),
    description: Joi.string().allow('', null).messages({
        'string.base': 'Mô tả phải là chuỗi',
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

export const updateManagementMemberSchema = Joi.object<IManagementMember>({
    name: Joi.string().trim().min(3).messages({
        'string.base': 'Tên phải là chuỗi',
        'string.min': 'Tên phải có ít nhất 3 ký tự',
        'string.empty': 'Tên không được để trống',
    }),
    position: Joi.string().trim().min(2).messages({
        'string.base': 'Chức vụ phải là chuỗi',
        'string.min': 'Chức vụ phải có ít nhất 2 ký tự',
        'string.empty': 'Chức vụ không được để trống',
    }),
    avatarUrl: Joi.string().uri().allow('', null).messages({
        'string.base': 'Avatar phải là chuỗi',
        'string.uri': 'Avatar phải là một URL hợp lệ',
    }),
    description: Joi.string().allow('', null).messages({
        'string.base': 'Mô tả phải là chuỗi',
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

