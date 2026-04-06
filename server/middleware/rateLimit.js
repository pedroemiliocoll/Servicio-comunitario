// server/middleware/rateLimit.js
// Advanced Rate Limiting with multiple strategies

class RateLimitStore {
    constructor() {
        this.store = new Map();
        this.blockedIPs = new Map();
        this.requestLog = [];
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }

    cleanup() {
        const now = Date.now();
        for (const [key, data] of this.store.entries()) {
            if (now - data.windowStart > data.windowMs) {
                this.store.delete(key);
            }
        }
        for (const [ip, data] of this.blockedIPs.entries()) {
            if (now > data.unblockAt) {
                this.blockedIPs.delete(ip);
            }
        }
        this.requestLog = this.requestLog.filter(r => now - r.timestamp < 60000);
    }

    getClientId(req) {
        if (req.user?.id) return `user:${req.user.id}`;
        return req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    }

    isBlocked(ip) {
        const block = this.blockedIPs.get(ip);
        return block && block.unblockAt > Date.now();
    }

    blockIP(ip, durationMs = 300000) {
        this.blockedIPs.set(ip, { unblockAt: Date.now() + durationMs });
    }

    recordRequest(ip, endpoint) {
        this.requestLog.push({ ip, endpoint, timestamp: Date.now() });
    }

    detectSuspiciousPattern(ip) {
        const recentRequests = this.requestLog.filter(r => r.ip === ip && Date.now() - r.timestamp < 10000);
        const uniqueEndpoints = new Set(recentRequests.map(r => r.endpoint)).size;
        return recentRequests.length > 50 || uniqueEndpoints > 20;
    }

    get(key) {
        return this.store.get(key);
    }

    set(key, value) {
        this.store.set(key, value);
    }

    delete(key) {
        this.store.delete(key);
    }
}

const store = new RateLimitStore();

const ENDPOINT_LIMITS = {
    '/api/chatbot': { max: 15, windowMs: 60000 },
    '/api/contact': { max: 5, windowMs: 60000 },
    '/api/upload': { max: 20, windowMs: 60000 },
    '/api/auth/login': { max: 5, windowMs: 300000 },
    'default': { max: 100, windowMs: 60000 }
};

function getEndpointLimit(path) {
    for (const [endpoint, limit] of Object.entries(ENDPOINT_LIMITS)) {
        if (endpoint !== 'default' && path.startsWith(endpoint)) {
            return limit;
        }
    }
    return ENDPOINT_LIMITS.default;
}

export function rateLimit(options = {}) {
    return (req, res, next) => {
        const clientId = store.getClientId(req);
        const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
        const endpoint = req.path;
        const { max, windowMs } = options.getLimit ? options.getLimit(req) : getEndpointLimit(endpoint);

        if (store.isBlocked(ip)) {
            return res.status(429).json({
                error: 'Tu IP ha sido temporalmente bloqueada debido a muchas solicitudes repetidas.',
                retryAfter: 300
            });
        }

        if (store.detectSuspiciousPattern(ip)) {
            store.blockIP(ip, 60000);
            return res.status(429).json({
                error: 'Actividad sospechosa detectada. Intenta de nuevo más tarde.',
                retryAfter: 60
            });
        }

        let record = store.get(clientId);

        if (!record || Date.now() - record.windowStart > windowMs) {
            record = { windowStart: Date.now(), count: 0, firstRequest: Date.now() };
            store.set(clientId, record);
        }

        record.count++;
        store.recordRequest(ip, endpoint);

        const remaining = Math.max(0, max - record.count);
        const resetTime = new Date(record.windowStart + windowMs);

        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', resetTime.toISOString());

        if (record.count > max) {
            return res.status(429).json({
                error: 'Has excedido el límite de solicitudes. Espera un momento.',
                retryAfter: Math.ceil((record.windowStart + windowMs - Date.now()) / 1000),
                limit: max,
                window: Math.ceil(windowMs / 1000)
            });
        }

        if (record.count === max) {
            console.warn(`[RateLimit] Cliente ${clientId} alcanzó el límite en ${endpoint}`);
        }

        next();
    };
}

export function createRateLimitMiddleware() {
    return rateLimit({
        getLimit: (req) => getEndpointLimit(req.path)
    });
}

export function createStrictRateLimit(max = 5, windowMs = 60000) {
    return rateLimit({ max, windowMs });
}

export function createUploadRateLimit() {
    return rateLimit({
        getLimit: () => ({ max: 10, windowMs: 60000 })
    });
}

export function createAuthRateLimit() {
    return rateLimit({
        getLimit: () => ({ max: 3, windowMs: 300000 })
    });
}
