import Joi from 'joi';
import { ICVCreate, ICVUpdateStatus } from '../interfaces/CV.interface';
import { CV_STATUS } from '../constants/enum.status';

export const createCVSchema = Joi.object<ICVCreate>({
    filePath: Joi.string().uri().required().messages({
        'string.base': 'Đường dẫn file phải là chuỗi',
        'string.uri': 'Đường dẫn file không hợp lệ',
        'any.required': 'Vui lòng cung cấp đường dẫn file CV',
    }),

    jobDescriptionId: Joi.string().hex().length(24).required().messages({
        'string.base': 'Job Description ID phải là chuỗi',
        'string.hex': 'Job Description ID không đúng định dạng',
        'string.length': 'Job Description ID phải có đúng 24 ký tự',
        'any.required': 'Vui lòng cung cấp Job Description ID',
    }),
});

export const updateCVSchema = Joi.object<ICVUpdateStatus>({
    status: Joi.string()
        .valid(...Object.values(CV_STATUS))
        .required()
        .messages({
            'string.base': 'Trạng thái phải là chuỗi',
            'any.only': 'Trạng thái CV không hợp lệ',
            'any.required': 'Vui lòng cung cấp trạng thái CV',
        }),
});
