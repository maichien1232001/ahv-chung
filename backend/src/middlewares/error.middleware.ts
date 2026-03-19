import {
    InvalidException,
    NotFoundException,
    DupplicateException,
    HttpError,
    IncorrectException,
    UnauthorizedException,
} from '../utils/ErrorHandler';

export const errorHandler = (err: unknown) => {
    // MongoDB ObjectId không hợp lệ
    const errorName = (err as { name?: string })?.name;
    if (errorName === 'CastError') {
        return {
            status: 400,
            message: 'Định dạng ID không hợp lệ',
        };
    }

    // JWT sai định dạng
    if (errorName === 'JsonWebTokenError') {
        return {
            status: 400,
            message: 'Token không đúng định dạng',
        };
    }

    if (err instanceof InvalidException) {
        return {
            status: 400,
            message: err.message,
        };
    }

    if (err instanceof IncorrectException) {
        return {
            status: 401,
            message: err.message,
        };
    }

    if (err instanceof UnauthorizedException) {
        return {
            status: 401,
            message: err.message,
        };
    }

    if (err instanceof NotFoundException) {
        return {
            status: 404,
            message: err.message,
        };
    }

    if (err instanceof DupplicateException) {
        return {
            status: 409,
            message: err.message,
        };
    }

    if (err instanceof HttpError) {
        return {
            status: err.status,
            message: err.message,
        };
    }

    // fallback
    return {
        status: 500,
        message: 'Lỗi máy chủ nội bộ',
    };
};
