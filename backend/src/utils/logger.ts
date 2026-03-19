import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, json, colorize } = winston.format;

const isDev = process.env.NODE_ENV !== 'production';
const isVercel = process.env.VERCEL === '1';

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    return JSON.stringify({
        timestamp,
        level,
        message,
        stack,
        ...meta,
    });
});

const transports: winston.transport[] = [new winston.transports.Console()];

if (!isVercel) {
    transports.push(
        new (winston.transports as any).DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
        new (winston.transports as any).DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    );
}

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), errors({ stack: true }), logFormat, isDev ? colorize() : json()),
    transports: transports,
});

export default logger;
