// server/middleware/errorHandler.js — Middleware: Manejo centralizado de errores
import { logError, logSecurity } from '../services/logger.js';

export function errorHandler(err, req, res, next) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    const errorLog = {
        status,
        message,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent')
    };

    if (status >= 500) {
        logError(err, req);
        // Deeper logging for Vercel troubleshooting
        console.error('--- INTERNAL SERVER ERROR DETAILS ---');
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        console.error('Stack:', err.stack);
        console.error('-------------------------------------');
    } else if (status >= 400) {
        logSecurity('client_error', errorLog);
    }

    console.error(`[Error ${status}]`, message);

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

export function notFound(req, res) {
    const message = `Ruta no encontrada: ${req.method} ${req.url}`;
    logSecurity('not_found', { method: req.method, url: req.url, ip: req.ip });
    res.status(404).json({ error: message });
}

export function createError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}
