// server/middleware/inputValidator.js
// Middleware para sanitizar y validar input del usuario

const MAX_MESSAGE_LENGTH = 500;
const MIN_MESSAGE_LENGTH = 1;

const DANGEROUS_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi,
    /\$_/gi,
    /\$\{/gi,
    /\{\{/gi,
];

export function sanitizeInput(text) {
    if (typeof text !== 'string') return '';
    
    let sanitized = text
        .trim()
        .substring(0, MAX_MESSAGE_LENGTH)
        .replace(/[\x00-\x1F\x7F]/g, '')
        .replace(/\s+/g, ' ');
    
    for (const pattern of DANGEROUS_PATTERNS) {
        sanitized = sanitized.replace(pattern, '');
    }
    
    return sanitized;
}

export function validateMessage(req, res, next) {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'El mensaje es requerido' });
    }
    
    if (typeof message !== 'string') {
        return res.status(400).json({ error: 'El mensaje debe ser texto' });
    }
    
    const trimmed = message.trim();
    
    if (trimmed.length < MIN_MESSAGE_LENGTH) {
        return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }
    
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
        return res.status(400).json({ 
            error: `El mensaje es demasiado largo. Máximo ${MAX_MESSAGE_LENGTH} caracteres.` 
        });
    }
    
    req.body.message = sanitizeInput(message);
    next();
}

export function validateSessionId(req, res, next) {
    const { sessionId } = req.body;
    
    if (sessionId) {
        if (typeof sessionId !== 'string' || sessionId.length > 100) {
            req.body.sessionId = null;
        } else {
            req.body.sessionId = sessionId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 100);
        }
    }
    
    next();
}
