import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, json, colorize } = winston.format;

const isDev = process.env.NODE_ENV !== 'production';

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    return JSON.stringify({
        timestamp,
        level,
        message,
        stack,
        ...meta,
    });
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), errors({ stack: true }), logFormat, isDev ? colorize() : json()),
    transports: [
        new winston.transports.Console(),

        new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),

        new winston.transports.DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ],
});

export default logger;
