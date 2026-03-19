export const error = Error;

class LocalError extends Error {
    constructor(error: string | Error | undefined) {
        if (error instanceof Error) {
            super(error.message);
        } else {
            super(error);
        }
    }
}

export class NotFoundException extends LocalError {
    constructor(error: string | Error) {
        if (error instanceof Error) {
            super(error);
        } else {
            super(error + ' không tồn tại');
        }
    }
}

export class UnauthorizedException extends LocalError {
    constructor(error: string | Error) {
        if (error instanceof Error) {
            super(error);
        } else {
            super(error + ' đã hết hạn hoặc không hợp lệ');
        }
    }
}

export class IncorrectException extends LocalError {
    constructor(error: string | Error) {
        if (error instanceof Error) {
            super(error);
        } else {
            super(error + ' không chính xác');
        }
    }
}

export class DupplicateException extends LocalError {
    constructor(error: string | Error) {
        if (error instanceof Error) {
            super(error);
        } else {
            super(error + ' đã tồn tại');
        }
    }
}

export class InvalidException extends LocalError {
    constructor(error: string | Error) {
        if (error instanceof Error) {
            super(error);
        } else {
            super(error + ' không hợp lệ');
        }
    }
}

export class HttpError extends Error {
    status: number;

    constructor(error: Error | number) {
        if (error instanceof Error) {
            super(error.message);
            this.status = 500;
        } else {
            switch (error) {
                case 500:
                    super('Lỗi máy chủ nội bộ');
                    break;
                case 501:
                    super('Chưa được triển khai');
                    break;
                case 502:
                    super('Cổng trung gian không hợp lệ');
                    break;
                case 503:
                    super('Dịch vụ không khả dụng');
                    break;
                case 504:
                    super('Cổng kết nối bị quá thời gian');
                    break;
                case 505:
                    super('Phiên bản HTTP không được hỗ trợ');
                    break;
                case 506:
                    super('Biến thể cũng đang được thương lượng');
                    break;
                case 507:
                    super('Không đủ dung lượng lưu trữ');
                    break;
                case 508:
                    super('Phát hiện vòng lặp');
                    break;
                case 510:
                    super('Chưa được mở rộng');
                    break;
                case 511:
                    super('Yêu cầu xác thực mạng');
                    break;
                case 400:
                    super('Yêu cầu không hợp lệ');
                    break;
                case 401:
                    super('Chưa được xác thực');
                    break;
                case 402:
                    super('Yêu cầu thanh toán');
                    break;
                case 403:
                    super('Không có quyền truy cập');
                    break;
                case 404:
                    super('Không tìm thấy');
                    break;
                case 405:
                    super('Phương thức không được phép');
                    break;
                case 406:
                    super('Không chấp nhận được');
                    break;
                case 407:
                    super('Yêu cầu xác thực proxy');
                    break;
                case 408:
                    super('Yêu cầu bị quá thời gian');
                    break;
                case 409:
                    super('Xung đột dữ liệu');
                    break;
                case 410:
                    super('Tài nguyên đã bị xóa');
                    break;
                case 411:
                    super('Thiếu độ dài nội dung');
                    break;
                case 412:
                    super('Điều kiện tiên quyết không đạt');
                    break;
                case 413:
                    super('Dữ liệu gửi lên quá lớn');
                    break;
                case 414:
                    super('URI quá dài');
                    break;
                case 415:
                    super('Kiểu dữ liệu không được hỗ trợ');
                    break;
                case 416:
                    super('Phạm vi không thỏa mãn');
                    break;
                case 417:
                    super('Kỳ vọng thất bại');
                    break;
                case 418:
                    super('Tôi là ấm trà ☕');
                    break;
                case 421:
                    super('Yêu cầu sai hướng');
                    break;
                case 422:
                    super('Dữ liệu không thể xử lý');
                    break;
                case 423:
                    super('Tài nguyên đang bị khóa');
                    break;
                case 424:
                    super('Phụ thuộc thất bại');
                    break;
                case 425:
                    super('Yêu cầu quá sớm');
                    break;
                case 426:
                    super('Yêu cầu nâng cấp');
                    break;
                case 428:
                    super('Thiếu điều kiện tiên quyết');
                    break;
                case 429:
                    super('Quá nhiều yêu cầu');
                    break;
                case 431:
                    super('Header yêu cầu quá lớn');
                    break;
                case 451:
                    super('Không khả dụng vì lý do pháp lý');
                    break;
                default:
                    super('Lỗi không xác định');
            }

            this.status = error;
        }
    }
}
