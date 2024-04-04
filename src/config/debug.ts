import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new DailyRotateFile({
            filename: 'log-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: path.join(__dirname, '../logs'),
            maxFiles: '7d',
            createSymlink: true
        })
    ]
});

export const LogError = (log: any) => logger.error(log.schema);
export const LogDebug = (log: any) => logger.info(log.schema);