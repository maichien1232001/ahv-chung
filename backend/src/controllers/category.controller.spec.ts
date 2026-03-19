import express from 'express';
import * as categoryController from './category.controller';
import categoryService from '../services/category.service';
import request from 'supertest';
import { Message } from '../constants/messages.contant';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';

const app = express();
app.use(express.json());
app.post('/categories', categoryController.createCategory);
app.get('/categories', categoryController.getCategories);
app.get('/categories/:id', categoryController.getCategory);
app.put('/categories/:id', categoryController.updateCategory);
app.delete('/categories/:id', categoryController.deleteCategory);

jest.mock('../services/category.service');

describe('Category Controller Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCategory()', () => {
        const payload = {
            name: 'name1',
            description: 'abc',
        };
        it('nên trả về 201 khi tạo category thành công', async () => {
            (categoryService.createCategory as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app).post('/categories').send(payload);

            expect(response.status).toBe(201);
            expect(response.body.message).toEqual('Danh mục ' + Message.Messages.CREATED);
            expect(categoryService.createCategory).toHaveBeenCalledWith(payload);
        });

        it('nên trả về 409 khi name category đã tồn tại (DupplicateException)', async () => {
            (categoryService.createCategory as jest.Mock).mockRejectedValue(new DupplicateException('Danh mục'));

            const response = await request(app).post('/categories').send(payload);

            expect(response.status).toBe(409);
            expect(response.body.message).toBe('Danh mục đã tồn tại');
        });

        it('nên trả về 500 khi service throw error thường', async () => {
            (categoryService.createCategory as jest.Mock).mockRejectedValue(new Error('DB error'));

            const response = await request(app).post('/categories').send({ title: 'test' });

            expect(response.status).toBe(500);
        });
    });

    describe('getCategory()', () => {
        it('nên trả về 200 và data khi tìm thấy category', async () => {
            const mockCategory = {
                id: '1',
                name: 'cateogry 1',
                description: 'category 1',
            };
            (categoryService.getCategoryById as jest.Mock).mockResolvedValue(mockCategory);

            const response = await request(app).get('/categories/1');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockCategory);
            expect(response.body.message).toBe('Danh mục ' + Message.Messages.FOUND);
        });

        it('nên trả về 404 khi không tìm thấy category (NotFoundException)', async () => {
            (categoryService.getCategoryById as jest.Mock).mockRejectedValue(new NotFoundException('Danh mục'));

            const response = await request(app).get('/categories/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Danh mục không tồn tại');
        });
    });

    describe('getCVs()', () => {
        it('nên trả về 200 và data khi tìm thấy category', async () => {
            const categoriesData = {
                data: [
                    { id: '1', name: 'cateogry 1', description: ' description 1' },
                    { id: '2', name: 'cateogry 2', description: ' description 2' },
                ],
            };
            (categoryService.getCategories as jest.Mock).mockResolvedValue(categoriesData);
            const response = await request(app).get('/categories').query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Danh sách danh mục ' + Message.Messages.FOUND);
            expect(response.body.data).toEqual(categoriesData);
        });
    });

    describe('updateCategory()', () => {
        const payload = { id: '1', name: 'cateogry 1', description: ' description 1' };
        it('nên trả về 200 khi cập nhật category thành công', async () => {
            const mockCategory = {
                data: [{ id: '1', name: 'cateogry 1', description: ' description 1' }],
            };
            (categoryService.updateCategory as jest.Mock).mockResolvedValueOnce(mockCategory);
            const response = await request(app).put(`/categories/1`).send(payload);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Danh mục ' + Message.Messages.UPDATED);
        });

        it('nên trả về 404 khi không tìm thấy category để cập nhật', async () => {
            (categoryService.updateCategory as jest.Mock).mockRejectedValueOnce(new NotFoundException('Danh mục'));
            const response = await request(app).put('/categories/999').send(payload);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Danh mục không tồn tại');
        });
    });

    describe('deleteCategory()', () => {
        it('nên trả về 200 khi xóa category thành công', async () => {
            (categoryService.deleteCategory as jest.Mock).mockResolvedValueOnce(undefined);
            const response = await request(app).delete(`/categories/1`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Danh mục ' + Message.Messages.DELETED);
        });

        it('nên trả về 404 khi không tìm thấy category để xóa', async () => {
            (categoryService.deleteCategory as jest.Mock).mockRejectedValueOnce(new NotFoundException('Danh mục'));
            const response = await request(app).delete('/categories/999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Danh mục không tồn tại');
        });
    });
});
