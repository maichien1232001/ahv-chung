import express from 'express';
import * as jdController from './jd.controller';
import jdService from '../services/jd.service';
import request from 'supertest';
import { Message } from '../constants/messages.contant';
import { NotFoundException } from '../utils/ErrorHandler';

const app = express();
app.use(express.json());
app.post('/jds', jdController.createJD);
app.get('/jds', jdController.getJDs);
app.get('/jds/:id', jdController.getJD);
app.put('/jds/:id', jdController.updateJD);
app.delete('/jds/:id', jdController.deleteJD);

jest.mock('../services/jd.service');

describe('Job Description Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createJd()', () => {
        const newJD = {
            _id: '1',
            title: 'jd 1',
            position: 'position 1',
            salary: 'salary 1',
            experience: 'experience 1',
            level: 'level 1',
            jobType: 'jobType1',
            gender: 'gender 1',
            location: 'location 1',
            description: 'description 1',
            requirements: 'requirements 1',
            benefits: 'benefits 1',
            quantity: 'quantity',
            expiredAt: 'expiredAt 1',
        };
        it('nên trả về 201 khi tạo jd thành công', async () => {
            (jdService.createJD as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app).post('/jds').send(newJD);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Mô tả công việc ' + Message.Messages.CREATED);
            expect(jdService.createJD).toHaveBeenCalledWith(newJD);
        });

        it('nên trả về 500 khi service throw error thường', async () => {
            (jdService.createJD as jest.Mock).mockRejectedValue(new Error('DB error'));

            const response = await request(app).post('/jds').send({ title: 'test' });

            expect(response.status).toBe(500);
        });
    });

    describe('getJd', () => {
        it('nên trả về 200 và data khi tìm thấy jd', async () => {
            const mockJd = {
                _id: '1',
                title: 'jd 1',
                position: 'position 1',
                salary: 'salary 1',
                experience: 'experience 1',
                level: 'level 1',
                jobType: 'jobType1',
                gender: 'gender 1',
                location: 'location 1',
                description: 'description 1',
                requirements: 'requirements 1',
                benefits: 'benefits 1',
                quantity: 'quantity',
                expiredAt: 'expiredAt 1',
            };
            (jdService.getJD as jest.Mock).mockResolvedValue(mockJd);
            const response = await request(app).get('/jds/1');
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockJd);
            expect(response.body.message).toBe('Mô tả công việc ' + Message.Messages.FOUND);
        });
        it('nên trả về 404 khi không tìm thấy jd (NotFoundException)', async () => {
            (jdService.getJD as jest.Mock).mockRejectedValue(new NotFoundException('Mô tả công việc'));
            const response = await request(app).get('/jds/999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Mô tả công việc không tồn tại');
        });
    });

    describe('getJds()', () => {
        it('nên trả về 200 và data khi tìm thấy jd', async () => {
            const jdsData = {
                data: [
                    {
                        _id: '1',
                        title: 'jd 1',
                        position: 'position 1',
                        salary: 'salary 1',
                        experience: 'experience 1',
                        level: 'level 1',
                        jobType: 'jobType1',
                        gender: 'gender 1',
                        location: 'location 1',
                        description: 'description 1',
                        requirements: 'requirements 1',
                        benefits: 'benefits 1',
                        quantity: 'quantity 1',
                        expiredAt: 'expiredAt 1',
                    },
                    {
                        _id: '2',
                        title: 'jd 2',
                        position: 'position 2',
                        salary: 'salary 2',
                        experience: 'experience 2',
                        level: 'level 2',
                        jobType: 'jobType 2',
                        gender: 'gender 2',
                        location: 'location 2',
                        description: 'description 2',
                        requirements: 'requirements 2',
                        benefits: 'benefits 2',
                        quantity: 'quantity 2',
                        expiredAt: 'expiredAt 2',
                    },
                ],
            };
            (jdService.getJDs as jest.Mock).mockResolvedValue(jdsData);
            const response = await request(app).get('/jds').query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Danh sách mô tả công việc ' + Message.Messages.FOUND);
            expect(response.body.data).toEqual(jdsData);
        });
    });

    describe('updateJds()', () => {
        const payload = {
            _id: '1',
            title: 'jd 1',
            position: 'position 1',
            salary: 'salary 1',
            experience: 'experience 1',
            level: 'level 1',
            jobType: 'jobType1',
            gender: 'gender 1',
            location: 'location 1',
            description: 'description 1',
            requirements: 'requirements 1',
            benefits: 'benefits 1',
            quantity: 'quantity',
            expiredAt: 'expiredAt 1',
        };
        it('nên trả về 200 khi cập nhật jd thành công', async () => {
            const mockJd = {
                data: [
                    {
                        _id: '1',
                        title: 'jd 1',
                        position: 'position 1',
                        salary: 'salary 1',
                        experience: 'experience 1',
                        level: 'level 1',
                        jobType: 'jobType1',
                        gender: 'gender 1',
                        location: 'location 1',
                        description: 'description 1',
                        requirements: 'requirements 1',
                        benefits: 'benefits 1',
                        quantity: 'quantity',
                        expiredAt: 'expiredAt 1',
                    },
                ],
            };
            (jdService.updateJD as jest.Mock).mockResolvedValueOnce(mockJd);
            const response = await request(app).put('/jds/1').send(payload);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Mô tả công việc ' + Message.Messages.UPDATED);
        });
        it('nên trả về 404 khi không tìm thấy người dùng để cập nhật', async () => {
            (jdService.updateJD as jest.Mock).mockRejectedValueOnce(new NotFoundException('Mô tả công việc'));
            const response = await request(app).put('/jds/999').send(payload);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Mô tả công việc không tồn tại');
        });
    });

    describe('deleteJd()', () => {
        it('nên trả về 200 khi xóa jd thành công', async () => {
            const mockJd = {
                data: [
                    {
                        _id: '1',
                        title: 'jd 1',
                        position: 'position 1',
                        salary: 'salary 1',
                        experience: 'experience 1',
                        level: 'level 1',
                        jobType: 'jobType1',
                        gender: 'gender 1',
                        location: 'location 1',
                        description: 'description 1',
                        requirements: 'requirements 1',
                        benefits: 'benefits 1',
                        quantity: 'quantity',
                        expiredAt: 'expiredAt 1',
                    },
                ],
            };
            (jdService.deleteJD as jest.Mock).mockResolvedValueOnce(mockJd);
            const response = await request(app).delete('/jds/1');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Mô tả công việc ' + Message.Messages.DELETED);
        });

        it('nên trả về 404 khi không tìm jd dùng để xóa', async () => {
            (jdService.deleteJD as jest.Mock).mockRejectedValueOnce(new NotFoundException('Mô tả công việc'));
            const response = await request(app).delete('/jds/999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Mô tả công việc không tồn tại');
        });
    });
});
