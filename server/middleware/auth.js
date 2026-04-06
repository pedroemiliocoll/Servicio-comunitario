// server/middleware/auth.js — Middleware: Verificación de JWT
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('❌ CRITICAL ERROR: JWT_SECRET is not defined in environment variables.');
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is mandatory for production environments.');
    }
}

/**
 * Genera un token JWT para un usuario
 */
export function generateToken(user) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET mismatch: check environment variables.');
    }
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '8h' }
    );
}

/**
 * Middleware que protege rutas que requieren autenticación.
 */
export function requireAuth(req, res, next) {
    if (!JWT_SECRET) {
        return res.status(500).json({ error: 'Server configuration error: missing secrets' });
    }
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Session expired. Please log in again.' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
}

/**
 * Middleware opcional para rutas que pueden mostrar datos públicos o privados
 */
export function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ') && JWT_SECRET) {
        const token = authHeader.slice(7);
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (e) {
            // Ignorar errores en auth opcional
        }
    }
    next();
}
