import { IncorrectException, NotFoundException, UnauthorizedException } from '../utils/ErrorHandler';
import { ILogin } from '../interfaces/Auth.interface';
import { User } from '../models/User.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ENV from '../constants/enviroment.constant';
import logger from '../utils/logger';
import { mapUserResponse } from '../map/user.map';
import userService from './user.service';

class AuthService {
    // Đăng nhập
    async login(payload: ILogin) {
        const { username } = payload;
        logger.info('[AuthService.login] Attempt login', { username });

        try {
            const user = await User.findOne({ username } as { username: string }).select('+password');
            if (!user) {
                logger.warn('[AuthService.login] Invalid credentials', { username });
                throw new IncorrectException('Tên đăng nhập hoặc mật khẩu không đúng');
            }

            const isMatch = await bcrypt.compare(payload.password, user.password);
            if (!isMatch) {
                logger.warn('[AuthService.login] Invalid credentials', { username });
                throw new IncorrectException('Tên đăng nhập hoặc mật khẩu không đúng');
            }

            const token = jwt.sign({ userId: user._id, username: user.username }, ENV.JWT_SECRET as string, {
                expiresIn: '3h',
            });

            const refreshToken = jwt.sign({ userId: user._id, username: user.username }, ENV.JWT_SECRET as string, {
                expiresIn: '30d',
            });

            logger.info('[AuthService.login] Success', { userId: user._id, username: user.username });
            return {
                token,
                refreshToken,
                user: mapUserResponse(user),
            };
        } catch (error) {
            logger.error('[AuthService.login] Error', { err: error, username });
            throw error;
        }
    }

    // Làm mới token
    async refreshToken(refreshToken: string) {
        logger.info('[AuthService.refreshToken] Attempt', { hasToken: !!refreshToken });

        try {
            if (!refreshToken) {
                logger.warn('[AuthService.refreshToken] Refresh token missing');
                throw new NotFoundException('Không tìm thấy Refresh Token');
            }

            const decoded = jwt.verify(refreshToken, ENV.JWT_SECRET as string) as {
                userId: string;
                username: string;
                exp: number;
            };

            const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000);
            const remainingDays = Math.ceil(remainingSeconds / (60 * 60 * 24));

            if (remainingSeconds <= 0) {
                logger.warn('[AuthService.refreshToken] Refresh token expired', { userId: decoded.userId });
                throw new UnauthorizedException('Refresh token đã hết hạn');
            }

            const user = await User.findById(decoded.userId);
            if (!user) {
                logger.warn('[AuthService.refreshToken] User not found', { userId: decoded.userId });
                throw new NotFoundException('Không tìm thấy người dùng');
            }

            const newAccessToken = jwt.sign({ userId: user._id, username: user.username }, ENV.JWT_SECRET as string, {
                expiresIn: '3h',
            });

            const newRefreshToken = jwt.sign({ userId: user._id, username: user.username }, ENV.JWT_SECRET as string, {
                expiresIn: `${remainingDays}d`,
            });

            logger.info('[AuthService.refreshToken] Success', { userId: user._id });
            return { newAccessToken, newRefreshToken };
        } catch (error) {
            logger.error('[AuthService.refreshToken] Error', { err: error });
            throw error;
        }
    }

    // Lấy thông tin người dùng hiện tại
    async getMe(authHeader: string) {
        logger.info('[AuthService.getMe] Attempt');

        try {
            if (!authHeader) {
                logger.warn('[AuthService.getMe] Missing auth header');
                throw new UnauthorizedException('Thiếu token xác thực');
            }

            const token = authHeader.split(' ')[1];

            const decoded = jwt.verify(token as string, ENV.JWT_SECRET as string) as { userId: string };
            const user = await userService.getUser(decoded.userId);

            logger.info('[AuthService.getMe] Success', { userId: user._id });
            return mapUserResponse(user);
        } catch (error) {
            logger.error('[AuthService.getMe] Error', { err: error });
            throw error;
        }
    }
}

export default new AuthService();
