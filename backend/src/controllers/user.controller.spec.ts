import request from 'supertest';
import express from 'express';
import * as userController from './user.controller';
import userService from '../services/user.service';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';
import { Message } from '../constants/messages.contant';

// 1. Khởi tạo App giả lập
const app = express();
app.use(express.json());
app.post('/users', userController.createUser);
app.get('/users/:id', userController.getUser);
app.get('/users', userController.getUsers);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

// 2. Mock UserService
jest.mock('../services/user.service');

describe('User Controller Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Xóa lịch sử gọi hàm sau mỗi test case
    });

    describe('createUser()', () => {
        const newUser = { _id: '1', name: 'User Test', username: 'test_user', password: '123456' };

        it('nên trả về 201 khi tạo user thành công', async () => {
            // Giả lập service chạy thành công
            (userService.createUser as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app).post('/users').send(newUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Người Dùng ' + Message.Messages.CREATED);
            expect(userService.createUser).toHaveBeenCalledWith(newUser);
        });

        it('nên trả về 409 khi username đã tồn tại (DupplicateException)', async () => {
            // Giả lập service ném lỗi trùng lặp
            (userService.createUser as jest.Mock).mockRejectedValue(new DupplicateException('Người Dùng'));

            const response = await request(app).post('/users').send(newUser);

            // Kiểm tra status (Giả sử errorHandler map Dupplicate thành 409 hoặc 400)
            expect(response.status).toBe(409);
            expect(response.body.message).toBe('Người Dùng đã tồn tại');
        });

        it('nên trả về 500 khi service throw error thường', async () => {
            (userService.createUser as jest.Mock).mockRejectedValue(new Error('DB error'));

            const response = await request(app).post('/users').send({ title: 'test' });

            expect(response.status).toBe(500);
        });
    });

    describe('getUser()', () => {
        it('nên trả về 200 và data khi tìm thấy user', async () => {
            const mockUser = { id: '1', name: 'User Test' };
            (userService.getUser as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app).get('/users/1');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockUser);
            expect(response.body.message).toContain(Message.Messages.FOUND);
        });

        it('nên trả về 404 khi không tìm thấy user (NotFoundException)', async () => {
            (userService.getUser as jest.Mock).mockRejectedValue(new NotFoundException('Người Dùng'));

            const response = await request(app).get('/users/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Người Dùng không tồn tại');
        });
    });

    describe('getUsers()', () => {
        it('nên trả về 200 và data khi tìm thấy user', async () => {
            const usersData = {
                data: [
                    { _id: '1', user: 'user1', username: 'user1' },
                    { _id: '2', user: 'user2', username: 'user2' },
                ],
            };
            (userService.getUsers as jest.Mock).mockResolvedValue(usersData);
            const response = await request(app).get('/users').query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Danh sách Người Dùng ' + Message.Messages.FOUND);
            expect(response.body.data).toEqual(usersData);
        });
    });

    describe('updateUser()', () => {
        const userId = '1';
        const payload = {
            name: 'chung',
            username: 'chungdo',
            status: 'active',
        };
        it('nên trả về 200 khi cập nhật người dùng thành công', async () => {
            const mockUser = {
                data: [{ _id: '1', name: 'User Test', username: 'user1', status: 'active' }],
            };
            (userService.updateUser as jest.Mock).mockResolvedValueOnce(mockUser);
            const response = await request(app).put(`/users/${userId}`).send(payload);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Người Dùng ' + Message.Messages.UPDATED);
        });

        it('nên trả về 404 khi không tìm thấy người dùng để cập nhật', async () => {
            (userService.updateUser as jest.Mock).mockRejectedValueOnce(new NotFoundException('Người Dùng'));
            const response = await request(app).put('/users/999').send(payload);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Người Dùng không tồn tại');
        });
    });
    describe('deleteUser()', () => {
        const userId = '1';
        it('nên trả về 200 khi xóa người dùng thành công', async () => {
            (userService.deleteUser as jest.Mock).mockResolvedValueOnce(undefined);
            const response = await request(app).delete(`/users/${userId}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Người Dùng ' + Message.Messages.DELETED);
        });

        it('nên trả về 404 khi không tìm thấy người dùng để xóa', async () => {
            (userService.deleteUser as jest.Mock).mockRejectedValueOnce(new NotFoundException('Người Dùng'));
            const response = await request(app).delete('/users/999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Người Dùng không tồn tại');
        });
    });
});
