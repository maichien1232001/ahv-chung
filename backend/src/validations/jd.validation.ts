import Joi from 'joi';
import { IJDCreate, IJDUpdate } from '../interfaces/JD.interface';

export const createJDSchema = Joi.object<IJDCreate>({
    title: Joi.string().trim().required().messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'any.required': 'Vui lòng nhập tiêu đề công việc',
        'string.empty': 'Tiêu đề không được để trống',
    }),

    position: Joi.string().trim().required().messages({
        'string.base': 'Vị trí phải là chuỗi',
        'any.required': 'Vui lòng nhập vị trí tuyển dụng',
        'string.empty': 'Vị trí không được để trống',
    }),

    salary: Joi.string().trim().required().messages({
        'string.base': 'Mức lương phải là chuỗi',
        'any.required': 'Vui lòng nhập mức lương',
        'string.empty': 'Mức lương không được để trống',
    }),

    experience: Joi.string().trim().required().messages({
        'string.base': 'Kinh nghiệm phải là chuỗi',
        'any.required': 'Vui lòng nhập kinh nghiệm yêu cầu',
        'string.empty': 'Kinh nghiệm không được để trống',
    }),

    level: Joi.string().trim().required().messages({
        'string.base': 'Cấp bậc phải là chuỗi',
        'any.required': 'Vui lòng nhập cấp bậc',
        'string.empty': 'Cấp bậc không được để trống',
    }),

    jobType: Joi.string().trim().required().messages({
        'string.base': 'Hình thức làm việc phải là chuỗi',
        'any.required': 'Vui lòng nhập hình thức làm việc',
        'string.empty': 'Hình thức làm việc không được để trống',
    }),

    gender: Joi.string().trim().required().messages({
        'string.base': 'Giới tính phải là chuỗi',
        'any.required': 'Vui lòng nhập yêu cầu giới tính',
        'string.empty': 'Giới tính không được để trống',
    }),

    location: Joi.string().trim().required().messages({
        'string.base': 'Địa điểm làm việc phải là chuỗi',
        'any.required': 'Vui lòng nhập địa điểm làm việc',
        'string.empty': 'Địa điểm làm việc không được để trống',
    }),

    description: Joi.string().trim().required().messages({
        'string.base': 'Mô tả công việc phải là chuỗi',
        'any.required': 'Vui lòng nhập mô tả công việc',
        'string.empty': 'Mô tả công việc không được để trống',
    }),

    requirements: Joi.string().trim().required().messages({
        'string.base': 'Yêu cầu công việc phải là chuỗi',
        'any.required': 'Vui lòng nhập yêu cầu công việc',
        'string.empty': 'Yêu cầu công việc không được để trống',
    }),

    benefits: Joi.string().trim().required().messages({
        'string.base': 'Quyền lợi phải là chuỗi',
        'any.required': 'Vui lòng nhập quyền lợi',
        'string.empty': 'Quyền lợi không được để trống',
    }),

    quantity: Joi.number().integer().required().messages({
        'number.base': 'Số lượng phải là số',
        'number.integer': 'Số lượng phải là số nguyên',
        'any.required': 'Vui lòng nhập số lượng tuyển dụng',
    }),

    expiredAt: Joi.date().required().messages({
        'date.base': 'Ngày hết hạn không hợp lệ',
        'any.required': 'Vui lòng nhập ngày hết hạn',
    }),
});

export const updateJDSchema = Joi.object<IJDUpdate>({
    title: Joi.string().trim().messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'string.empty': 'Tiêu đề không được để trống',
    }),

    position: Joi.string().trim().messages({
        'string.base': 'Vị trí phải là chuỗi',
        'string.empty': 'Vị trí không được để trống',
    }),

    salary: Joi.string().trim().messages({
        'string.base': 'Mức lương phải là chuỗi',
        'string.empty': 'Mức lương không được để trống',
    }),

    experience: Joi.string().trim().messages({
        'string.base': 'Kinh nghiệm phải là chuỗi',
        'string.empty': 'Kinh nghiệm không được để trống',
    }),

    level: Joi.string().trim().messages({
        'string.base': 'Cấp bậc phải là chuỗi',
        'string.empty': 'Cấp bậc không được để trống',
    }),

    jobType: Joi.string().trim().messages({
        'string.base': 'Hình thức làm việc phải là chuỗi',
        'string.empty': 'Hình thức làm việc không được để trống',
    }),

    gender: Joi.string().trim().messages({
        'string.base': 'Giới tính phải là chuỗi',
        'string.empty': 'Giới tính không được để trống',
    }),

    location: Joi.string().trim().messages({
        'string.base': 'Địa điểm làm việc phải là chuỗi',
        'string.empty': 'Địa điểm làm việc không được để trống',
    }),

    description: Joi.string().trim().messages({
        'string.base': 'Mô tả công việc phải là chuỗi',
        'string.empty': 'Mô tả công việc không được để trống',
    }),

    requirements: Joi.string().trim().messages({
        'string.base': 'Yêu cầu công việc phải là chuỗi',
        'string.empty': 'Yêu cầu công việc không được để trống',
    }),

    benefits: Joi.string().trim().messages({
        'string.base': 'Quyền lợi phải là chuỗi',
        'string.empty': 'Quyền lợi không được để trống',
    }),

    quantity: Joi.number().integer().messages({
        'number.base': 'Số lượng phải là số',
        'number.integer': 'Số lượng phải là số nguyên',
    }),

    expiredAt: Joi.date().messages({
        'date.base': 'Ngày hết hạn không hợp lệ',
    }),
})
    .min(1)
    .messages({
        'object.min': 'Vui lòng cập nhật ít nhất một trường',
    });
