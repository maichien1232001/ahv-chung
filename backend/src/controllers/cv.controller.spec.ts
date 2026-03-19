import express from 'express';
import * as cvControllerr from './cv.controller';
import cvService from '../services/cv.service';
import request from 'supertest';
import { Message } from '../constants/messages.contant';
import { NotFoundException } from '../utils/ErrorHandler';

const app = express();
app.use(express.json());
app.post('/cvs', cvControllerr.createCV);
app.get('/cvs', cvControllerr.getCVs);
app.get('/cvs/:id', cvControllerr.getCV);
app.put('/cvs/:id', cvControllerr.updateStatusCV);
app.get('/cvs/stats/status', cvControllerr.countStatusCV);

jest.mock('../services/cv.service');

describe('CV controller Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCV()', () => {
        it('nên trả về 201 khi tạo cv thành công', async () => {
            const payload = {
                filePath: 'path1',
                jobDescriptionId: '1',
            };

            (cvService.createCV as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app).post('/cvs').send(payload);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('CV ' + Message.Messages.CREATED);
            expect(cvService.createCV).toHaveBeenCalledWith(payload);
        });

        it('nên trả về 500 khi service throw error thường', async () => {
            (cvService.createCV as jest.Mock).mockRejectedValue(new Error('DB error'));

            const response = await request(app).post('/cvs').send({ title: 'test' });

            expect(response.status).toBe(500);
        });
    });

    describe('getCV()', () => {
        it('nên trả về 200 và data khi tìm thấy cv', async () => {
            const mockCV = {
                id: '1',
                filePath: 'path1',
                jobDescriptionId: '1',
            };

            (cvService.getCV as jest.Mock).mockResolvedValue(mockCV);

            const response = await request(app).get('/cvs/1');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockCV);
            expect(response.body.message).toBe('CV ' + Message.Messages.FOUND);
        });

        it('nên trả về 404 khi không tìm thấy cv (NotFoundException)', async () => {
            (cvService.getCV as jest.Mock).mockRejectedValue(new NotFoundException('CV'));

            const response = await request(app).get('/cvs/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('CV không tồn tại');
        });
    });

    describe('getCVs()', () => {
        it('nên trả về 200 và data khi tìm thấy cv', async () => {
            const cvsData = {
                data: [
                    { id: '1', filePath: 'path1', jobDescriptionId: '1' },
                    { id: '2', filePath: 'path2', jobDescriptionId: '2' },
                ],
            };
            (cvService.getCVs as jest.Mock).mockResolvedValue(cvsData);
            const response = await request(app).get('/cvs').query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Danh sách CV ' + Message.Messages.FOUND);
            expect(response.body.data).toEqual(cvsData);
        });
    });

    describe('updateStatusCv()', () => {
        const payload = {
            status: 'open',
        };
        it('nên trả về 200 khi cập nhật status cv thành công', async () => {
            const mockCV = {
                data: [{ id: '1', filePath: 'path1', jobDescriptionId: '1' }],
            };
            (cvService.updateStatusCV as jest.Mock).mockResolvedValueOnce(mockCV);
            const response = await request(app).put('/cvs/1').send(payload);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trạng thái CV ' + Message.Messages.UPDATED);
        });

        it('nên trả về 404 khi không tìm thấy cv (NotFoundException)', async () => {
            (cvService.updateStatusCV as jest.Mock).mockRejectedValue(new NotFoundException('CV'));

            const response = await request(app).get('/cvs/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('CV không tồn tại');
        });
    });

    describe('countStatusCV()', () => {
        it('nên trả về 200 khi Thống kê trạng thái CV thành công', async () => {
            const mockResult = {
                new: 1,
                reject: 1,
                approve: 1,
            };

            (cvService.countStatusCV as jest.Mock).mockResolvedValue(mockResult);

            const response = await request(app).get('/cvs/stats/status');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Thống kê trạng thái CV ' + Message.Messages.FOUND);
            expect(response.body.data).toEqual(mockResult);
        });
    });
});
