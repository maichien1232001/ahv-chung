import mongoose from 'mongoose';
import ENV from '../constants/enviroment.constant';

if (!process.env.MONGO_URI) {
    throw new Error(' MONGO_URI environment variable is not defined');
}
const MONGO_URI_BASE = ENV.MONGO_URI || '';
const DB_NAME = ENV.DB_NAME || '';

const MONGO_URI = MONGO_URI_BASE.endsWith('/')
    ? (MONGO_URI_BASE + DB_NAME)
    : (MONGO_URI_BASE + '/' + DB_NAME);

export const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        await mongoose
            .connect(MONGO_URI, {
                authSource: 'admin',
                ...(ENV.DB_USER && { user: ENV.DB_USER }),
                ...(ENV.DB_PASSWORD && { pass: ENV.DB_PASSWORD }),
            })
            .then(() => {
                console.log('MongoDB connected successfully');
            })
            .catch((err) => console.error(err));
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
