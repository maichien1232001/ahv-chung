import dotenv from 'dotenv';
dotenv.config();

export const ENVIRONMENT = {
    PORT: Number(process.env.PORT),
    POST: Number(process.env.POST),
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    LINK_COR: process.env.COR_LINK,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

export default ENVIRONMENT;
