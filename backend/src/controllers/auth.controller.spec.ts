import cookieParser from 'cookie-parser';
import express from 'express';
import * as authController from './auth.controller';
import request from 'supertest';
import authService from '../services/auth.service';
import { Message } from '../constants/messages.contant';
import { IncorrectException } from '../utils/ErrorHandler';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/auths', authController.login);
app.get('/auths', authController.getMe);
app.post('/auths/refresh', authController.refreshToken);

jest.mock('../services/auth.service');

describe('Auth Controller Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login()', () => {
        const loginData = {
            username: 'chungdo',
            password: '123456',
        };

        it('nên trả về 200, set refreshToken cookie và không trả refreshToken trong body', async () => {
            const mockResult = {
                token: 'access_token',
                refreshToken: 'refresh_token',
                user: {
                    id: '1',
                    username: 'chungdo',
                },
            };

            (authService.login as jest.Mock).mockResolvedValueOnce(mockResult);

            const res = await request(app).post('/auths').send(loginData);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe(Message.Messages.LOGINED);

            expect(res.body.data).toEqual({
                token: 'access_token',
                user: {
                    id: '1',
                    username: 'chungdo',
                },
            });

            expect(res.body.data.refreshToken).toBeUndefined();

            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies![0]).toContain('refreshToken=refresh_token');

            expect(authService.login).toHaveBeenCalledWith(loginData);
            expect(authService.login).toHaveBeenCalledTimes(1);
        });

        it('nên trả về 401 khi tên tài khoản hoặc mật khẩu không chính xác', async () => {
            (authService.login as jest.Mock).mockRejectedValue(
                new IncorrectException('Tên đăng nhập hoặc mật khẩu không đúng'),
            );
            const response = await request(app).post('/auths').send(loginData);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Tên đăng nhập hoặc mật khẩu không đúng không chính xác');
        });
    });

    describe('getMe()', () => {
        it('nên trả về 200 và data khi lấy thông tin người dùng bằng token', async () => {
            const mockUser = {
                id: '1',
                username: 'user1',
            };
            (authService.getMe as jest.Mock).mockResolvedValueOnce(mockUser);
            const response = await request(app).get('/auths').set('Authorization', 'Bearer valid_token');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe(Message.Messages.FOUND);
            expect(response.body.data).toEqual(mockUser);
        });
    });

    describe('refreshToken()', () => {
        const mockResult = {
            token: 'new_access_token',
            newRefreshToken: 'new_refresh_token',
        };

        it('nên trả về 200, token mới và set refreshToken cookie', async () => {
            (authService.refreshToken as jest.Mock).mockResolvedValueOnce(mockResult);

            const response = await request(app).post('/auths/refresh');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe(Message.Messages.REFRESHED_TOKEN);
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.status).toBe(200);
        });
    });
});
