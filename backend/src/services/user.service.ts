import bcrypt from 'bcrypt';
import { User } from '../models/User.model';
import { IUserCreate, IUserFilter, IUserUpdate } from '../interfaces/User.interface';
import logger from '../utils/logger';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';

class UserService {
    // Tạo người dùng mới
    async createUser(payload: IUserCreate) {
        const { name, username } = payload;
        logger.info('[UserService.createUser] Attempt', { name, username });

        try {
            const existed = await User.findOne({ username });
            if (existed) {
                logger.warn('[UserService.createUser] Duplicate username', { username });
                throw new DupplicateException('Người dùng');
            }

            const hash = await bcrypt.hash(payload.password, 10);

            const newUser = new User({
                name,
                username,
                password: hash,
            });

            const savedUser = await newUser.save();
            logger.info('[UserService.createUser] Success', { userId: savedUser._id, username });

            return savedUser;
        } catch (error) {
            logger.error('[UserService.createUser] Error', { err: error, username });
            throw error;
        }
    }

    // Lấy danh sách người dùng (phân trang)
    async getUsers(payload: IUserFilter) {
        logger.info('[UserService.getUsers] Payload', { payload });

        try {
            const { page = 1, limit = 10, status } = payload;
            const skip = (page - 1) * limit;

            const query: Record<string, unknown> = {};

            if (typeof status === 'string' && status.trim()) {
                query.status = status.trim();
            }

            const [users, total] = await Promise.all([
                User.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).select('-password').lean(),
                User.countDocuments(query),
            ]);

            logger.info('[UserService.getUsers] Fetched users', { count: users.length });

            return {
                data: users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[UserService.getUsers] Error', { err: error });
            throw error;
        }
    }

    // Lấy người dùng theo ID
    async getUser(id: string) {
        logger.info('[UserService.getUser] User ID', { userId: id });

        try {
            const user = await User.findById(id);
            if (!user) {
                logger.warn('[UserService.getUser] Not found', { userId: id });
                throw new NotFoundException('Người dùng');
            }

            return user;
        } catch (error) {
            logger.error('[UserService.getUser] Error', { err: error, userId: id });
            throw error;
        }
    }

    // Lấy người dùng theo username
    async getUserByUsername(username: string) {
        logger.info('[UserService.getUserByUsername] Username', { username });

        try {
            const user = await User.findOne({ username });
            if (!user) {
                logger.warn('[UserService.getUserByUsername] Not found', { username });
                throw new NotFoundException('Người dùng');
            }

            return user;
        } catch (error) {
            logger.error('[UserService.getUserByUsername] Error', { err: error, username });
            throw error;
        }
    }

    // Cập nhật người dùng
    async updateUser(id: string, payload: IUserUpdate) {
        logger.info('[UserService.updateUser] Attempt', { userId: id, payload });

        try {
            if (payload.username) {
                const existed = await User.findOne({ username: payload.username });
                if (existed && existed._id.toString() !== id) {
                    logger.warn('[UserService.updateUser] Duplicate username', { username: payload.username });
                    throw new DupplicateException('Người dùng');
                }
            }

            const user = await User.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!user) {
                logger.warn('[UserService.updateUser] User not found', { userId: id });
                throw new NotFoundException('Người dùng');
            }

            logger.info('[UserService.updateUser] Success', { userId: id });
            return user;
        } catch (error) {
            logger.error('[UserService.updateUser] Error', { err: error, userId: id });
            throw error;
        }
    }

    // Xoá người dùng
    async deleteUser(id: string) {
        logger.info('[UserService.deleteUser] Attempt', { userId: id });

        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                logger.warn('[UserService.deleteUser] User not found', { userId: id });
                throw new NotFoundException('Người dùng');
            }

            logger.info('[UserService.deleteUser] Success', { userId: id });
            return user;
        } catch (error) {
            logger.error('[UserService.deleteUser] Error', { err: error, userId: id });
            throw error;
        }
    }
}

export default new UserService();
