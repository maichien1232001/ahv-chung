import express from 'express';
import * as postController from './post.controller';
import postService from '../services/post.service';
import request from 'supertest';
import { Message } from '../constants/messages.contant';
import { NotFoundException } from '../utils/ErrorHandler';

const app = express();
app.use(express.json());
app.post('/posts', postController.createPost);
app.get('/posts', postController.getPosts);
app.get('/posts/:id', postController.getPost);
app.put('/posts/:id', postController.updatePost);
app.delete('/posts/:id', postController.deletePost);

jest.mock('../services/post.service');

describe('Post Controller Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPost()', () => {
        const newPost = {
            _id: '1',
            title: 'title 1',
            content: 'content 2',
            categoryId: '1',
            imageUrl: 'url 1',
            tags: 'tag1',
            status: 'status 1',
        };

        it('nên trả về 201 khi tạo post thành công', async () => {
            (postService.createPost as jest.Mock).mockResolvedValue(undefined);
            const response = await request(app).post('/posts').send(newPost);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Bài viết ' + Message.Messages.CREATED);
            expect(postService.createPost).toHaveBeenCalledWith(newPost);
        });

        it('nên trả về 500 khi service throw error thường', async () => {
            (postService.createPost as jest.Mock).mockRejectedValue(new Error('DB error'));

            const response = await request(app).post('/posts').send({ title: 'test' });

            expect(response.status).toBe(500);
        });

        it('nên trả về 404 khi không tìm thấy category (NotFoundException)', async () => {
            (postService.createPost as jest.Mock).mockRejectedValue(new NotFoundException('Danh mục'));

            const response = await request(app).post('/posts').send({ categoryId: '99' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Danh mục không tồn tại');
        });
    });

    describe('getPost', () => {
        it('nên trả về 200 và data khi tìm thấy post', async () => {
            const mockPost = {
                _id: '1',
                title: 'title 1',
                content: 'content 2',
                categoryId: '1',
                imageUrl: 'url 1',
                tags: 'tag1',
                status: 'status1',
            };
            (postService.getPost as jest.Mock).mockResolvedValue(mockPost);
            const response = await request(app).get('/posts/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Bài viết ' + Message.Messages.FOUND);
            expect(response.body.data).toEqual(mockPost);
        });

        it('nên trả về 404 khi không tìm thấy post (NotFoundException)', async () => {
            (postService.getPost as jest.Mock).mockRejectedValue(new NotFoundException('Bài viết'));
            const response = await request(app).get('/posts/99');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Bài viết không tồn tại');
        });
    });

    describe('getPosts', () => {
        it('nên trả về 200 và data khi tìm thấy post', async () => {
            const postsData = {
                data: [
                    {
                        _id: '1',
                        title: 'title 1',
                        content: 'content 1',
                        categoryId: '1',
                        imageUrl: 'url 1',
                        tags: 'tag1',
                        status: 'status 1',
                    },
                    {
                        _id: '2',
                        title: 'title 2',
                        content: 'content 2',
                        categoryId: '2',
                        imageUrl: 'url 2',
                        tags: 'tag2',
                        status: 'status 1',
                    },
                ],
            };
            (postService.getPosts as jest.Mock).mockResolvedValue(postsData);
            const response = await request(app).get('/posts').query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Danh sách bài viết ' + Message.Messages.FOUND);
            expect(response.body.data).toEqual(postsData);
        });
    });

    describe('updatePost', () => {
        const payload = {
            _id: '1',
            title: 'title 1',
            content: 'content 2',
            categoryId: '1',
            imageUrl: 'url 1',
            tags: 'tag1',
            status: 'status 1',
        };
        it('nên trả về 200 khi cập nhật post thành công', async () => {
            const mockPost = {
                _id: '1',
                title: 'title 1',
                content: 'content 2',
                categoryId: '1',
                imageUrl: 'url 1',
                tags: 'tag1',
                status: 'status 1',
            };
            (postService.updatePost as jest.Mock).mockResolvedValue(mockPost);

            const response = await request(app).put('/posts/1').send(payload);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Bài viết ' + Message.Messages.UPDATED);
        });

        it('nên trả về 404 khi không tìm thấy post để cập nhật', async () => {
            (postService.updatePost as jest.Mock).mockRejectedValue(new NotFoundException('Bài viết'));
            const response = await request(app).put('/posts/9').send(payload);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Bài viết không tồn tại');
        });
    });

    describe('deletePost', () => {
        it('nên trả về 200 khi xóa post thành công', async () => {
            (postService.deletePost as jest.Mock).mockResolvedValueOnce(undefined);
            const response = await request(app).delete(`/posts/1`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Bài viết ' + Message.Messages.DELETED);
        });

        it('nên trả về 404 khi không tìm thấy post để xóa', async () => {
            (postService.deletePost as jest.Mock).mockRejectedValueOnce(new NotFoundException('Bài viết'));
            const response = await request(app).delete('/posts/999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Bài viết không tồn tại');
        });
    });
});
