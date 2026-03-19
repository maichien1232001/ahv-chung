import express, { Request, Response } from 'express';
import ENV from './constants/enviroment.constant';
import { connectDB } from './config/mongodb';
import { allRoutes } from './routes/all.routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { seedAdmin } from './utils/admin.seed';

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

connectDB();

app.use(cookieParser());

app.use(express.json());

seedAdmin();

const allowedOrigins = (ENV.LINK_COR ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

app.use('/api/v1', allRoutes);

app.get('/health', (req: Request, res: Response) => res.status(200).send('OK'));

export default app;
