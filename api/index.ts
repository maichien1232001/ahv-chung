import type { VercelRequest, VercelResponse } from '@vercel/node';
import app, { initApp } from '../backend/src/app';

let isInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (!isInitialized) {
            await initApp();
            isInitialized = true;
        }
        return app(req, res);
    } catch (error: any) {
        console.error('Initialization error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
