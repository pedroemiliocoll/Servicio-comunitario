// server/services/logger.js — Structured Logging with Winston
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(__dirname, '..', 'logs');

const isVercel = !!process.env.VERCEL;

if (!existsSync(LOG_DIR) && !isVercel) {
    mkdirSync(LOG_DIR, { recursive: true });
}

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (Object.keys(metadata).length > 0) {
            log += ` ${JSON.stringify(metadata)}`;
        }
        return log;
    })
);

const jsonFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const transports = [
    new winston.transports.Console({
        format: logFormat,
        level: 'debug'
    })
];

// Solo añadir transporte de archivos si NO estamos en Vercel
if (!isVercel) {
    transports.push(
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'error.log'),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5
        })
    );
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: isVercel ? jsonFormat : logFormat,
    defaultMeta: { service: 'liceo-api', version: '2.4.1' },
    transports
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: logFormat,
        level: 'debug'
    }));
}

export const auditLogger = winston.createLogger({
    level: 'info',
    format: jsonFormat,
    defaultMeta: { service: 'liceo-audit' },
    transports: isVercel ? [new winston.transports.Console()] : [
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'audit.log'),
            maxsize: 10485760,
            maxFiles: 10
        })
    ]
});

export function logRequest(req, res, duration) {
    logger.info({
        type: 'request',
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
}

export function logError(err, req = null) {
    logger.error({
        type: 'error',
        message: err.message,
        stack: err.stack,
        method: req?.method,
        url: req?.url,
        ip: req?.ip
    });
}

export function logSecurity(event, data) {
    logger.warn({
        type: 'security',
        event,
        ...data,
        timestamp: new Date().toISOString()
    });
}

export function logUserAction(userId, action, details) {
    auditLogger.info({
        type: 'user_action',
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
    });
}

export default logger;
