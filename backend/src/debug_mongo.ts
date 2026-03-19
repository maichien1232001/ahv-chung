import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI_ENV = process.env.MONGO_URI;
const DB_NAME_ENV = process.env.DB_NAME;

console.log('MONGO_URI_ENV:', JSON.stringify(MONGO_URI_ENV));
console.log('DB_NAME_ENV:', JSON.stringify(DB_NAME_ENV));

const CONSTRUCTED_URI = (MONGO_URI_ENV || '').endsWith('/') 
    ? ((MONGO_URI_ENV || '') + (DB_NAME_ENV || '')) 
    : ((MONGO_URI_ENV || '') + '/' + (DB_NAME_ENV || ''));
console.log('CONSTRUCTED_URI:', JSON.stringify(CONSTRUCTED_URI));
