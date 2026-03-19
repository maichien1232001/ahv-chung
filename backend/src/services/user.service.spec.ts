import UserService from './user.service';
import { User } from '../models/User.model';
import bcrypt from 'bcrypt';
import logger from '../utils/logger';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';

// Mock các dependencies
jest.mock('../models/User.model');
jest.mock('bcrypt');
jest.mock('../utils/logger');

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        const mockPayload = { name: 'Test User', username: 'testuser', password: 'password123' };

        it('nên tạo người dùng thành công', async () => {
            // Mock: Không tìm thấy user trùng tên
            (User.findOne as jest.Mock).mockResolvedValue(null);
            // Mock: Hash password
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
            // Mock: Save user
            const mockSavedUser = { ...mockPayload, _id: 'mock_id', password: 'hashed_password' };
            (User.prototype.save as jest.Mock).mockResolvedValue(mockSavedUser);

            const result = await UserService.createUser(mockPayload);

            expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(result).toEqual(mockSavedUser);
            expect(logger.info).toHaveBeenCalled();
        });

        it('nên ném lỗi DupplicateException nếu username đã tồn tại', async () => {
            (User.findOne as jest.Mock).mockResolvedValue({ _id: 'existing_id' });

            await expect(UserService.createUser(mockPayload)).rejects.toThrow(DupplicateException);

            expect(User.prototype.save).not.toHaveBeenCalled();
        });
    });

    describe('getUsers', () => {
        it('nên trả về danh sách người dùng phân trang', async () => {
            const mockUsers = [{ name: 'User 1' }, { name: 'User 2' }];
            const mockTotal = 2;

            // Mock chuỗi query của Mongoose (find().sort().skip()...)
            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockUsers),
            };

            (User.find as jest.Mock).mockReturnValue(mockQuery);
            (User.countDocuments as jest.Mock).mockResolvedValue(mockTotal);

            const result = await UserService.getUsers({ page: 1, limit: 10 });

            expect(result.data).toEqual(mockUsers);
            expect(result.pagination.total).toBe(mockTotal);
            expect(result.pagination.totalPages).toBe(1);
            expect(logger.info).toHaveBeenCalled();
        });
    });

    describe('getUser', () => {
        it('nên trả về user nếu tìm thấy ID', async () => {
            const mockUser = { _id: '123', name: 'Test' };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            const result = await UserService.getUser('123');

            expect(result).toEqual(mockUser);
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (User.findById as jest.Mock).mockResolvedValue(null);

            await expect(UserService.getUser('999')).rejects.toThrow(NotFoundException);

            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('getUserByUsername()', () => {
        it('nên trả về user nếu tìm thấy username', async () => {
            const mockUser = { _id: '123', name: 'Test', username: 'user1' };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            const result = await UserService.getUserByUsername('user1');

            expect(result).toEqual(mockUser);
            expect(logger.info).toHaveBeenCalled();
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy username', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(UserService.getUserByUsername('999')).rejects.toThrow(NotFoundException);

            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('updateUser', () => {
        const id = '123';

        it('nên cập nhật user thành công', async () => {
            const payload = { name: 'Updated Name' };
            const mockUpdatedUser = { _id: id, ...payload };

            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUser);

            const result = await UserService.updateUser(id, payload);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: payload }, { new: true });
            expect(result).toEqual(mockUpdatedUser);
        });

        it('nên ném lỗi DupplicateException nếu username đã tồn tại', async () => {
            const payload = {
                username: 'existing_username',
                name: 'Updated Name',
            };

            (User.findOne as jest.Mock).mockResolvedValue({ _id: 'other_id' });

            await expect(UserService.updateUser(id, payload)).rejects.toThrow(DupplicateException);
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(UserService.updateUser('999', { name: 'abc' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteUser', () => {
        it('nên xoá user thành công', async () => {
            (User.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '123' });

            const result = await UserService.deleteUser('123');

            expect(User.findByIdAndDelete).toHaveBeenCalledWith('123');
            expect(result).toBeDefined();
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            await expect(UserService.deleteUser('999')).rejects.toThrow(NotFoundException);
        });
    });
});
