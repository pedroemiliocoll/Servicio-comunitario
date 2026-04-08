// api/index.js — New Vercel Entry Point
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { initializeDatabase, client, db } from '../server/config/database.js';
import { seedDatabase } from '../server/services/seedService.js';
import { errorHandler, notFound } from '../server/middleware/errorHandler.js';
import logger, { logRequest } from '../server/services/logger.js';
import { createRateLimitMiddleware } from '../server/middleware/rateLimit.js';
import { swaggerSpec } from '../server/config/swagger.js';
import { NewsModel } from '../server/models/NewsModel.js';
import { UserModel } from '../server/models/UserModel.js';
import { contactMessages } from '../server/db/schema.js';
import { sql } from 'drizzle-orm';

// Routes
import authRoutes          from '../server/routes/authRoutes.js';
import newsRoutes          from '../server/routes/newsRoutes.js';
import chatbotRoutes       from '../server/routes/chatbotRoutes.js';
import settingsRoutes      from '../server/routes/settingsRoutes.js';
import aiConfigRoutes      from '../server/routes/aiConfigRoutes.js';
import contactRoutes       from '../server/routes/contactRoutes.js';
import galleryRoutes       from '../server/routes/galleryRoutes.js';
import usersRoutes         from '../server/routes/usersRoutes.js';
import conversationsRoutes from '../server/routes/conversationsRoutes.js';
import eventsRoutes        from '../server/routes/eventsRoutes.js';
import uploadRoutes        from '../server/routes/uploadRoutes.js';
import sitemapRoutes       from '../server/routes/sitemapRoutes.js';
import backupRoutes        from '../server/routes/backupRoutes.js';
import analyticsRoutes     from '../server/routes/analyticsRoutes.js';
import activityRoutes      from '../server/routes/activityRoutes.js';

const app = express();

const startServices = async () => {
    try {
        await initializeDatabase();
        
        // Check if tables exist before attempting to seed
        const rawResult = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table'");
        const allTablesInDb = rawResult.rows.map(r => r.name);
        
        if (allTablesInDb.includes('users')) {
            await seedDatabase();
            console.log('✅ Services started successfully');
        } else {
            console.log('⚠️ Database is empty. Skipping seed. Please push your Drizzle schema.');
        }
    } catch (err) {
        console.error('❌ ERROR starting services:', err.message);
    }
};

startServices();

app.use(cors({ origin: '*', credentials: true }));
app.use(compression());

app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function(data) {
        function formatSQLiteDate(value) {
            // Match YYYY-MM-DD HH:MM:SS (with optional .SSS and optional timezone)
            if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/.test(value)) {
                let iso = value.replace(' ', 'T');
                if (!iso.includes('Z') && !/[+-]\d{2}:?\d{2}$/.test(iso)) {
                    iso += 'Z';
                }
                return iso;
            }
            return value;
        }
        function convertObj(obj) {
            if (Array.isArray(obj)) return obj.map(convertObj);
            if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
                const n = {};
                for (const k of Object.keys(obj)) {
                    // Solo convertir si es camelCase (letra pequeña seguida de letra grande)
                    const snakeKey = k.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
                    n[snakeKey] = convertObj(obj[k]);
                }
                return n;
            }
            if (typeof obj === 'bigint') return Number(obj);
            return formatSQLiteDate(obj);
        }
        
        // Use JSON.stringify replacer for safe BigInt serialization before sending
        const processed = convertObj(data);
        return originalJson.call(this, processed);
    };
    next();
});

// Disable cache for API
app.use('/api', (req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logRequest(req, res, duration);
    });
    next();
});

const rateLimiter = createRateLimitMiddleware();
app.use('/api/chatbot', rateLimiter);
app.use('/api/contact', rateLimiter);
app.use('/api/auth', rateLimiter);

// Route mapping
app.use('/api/contact',       contactRoutes);
app.use('/api/auth',          authRoutes);
app.use('/api/news',          newsRoutes);
app.use('/api/chatbot',       chatbotRoutes);
app.use('/api/settings',      settingsRoutes);
app.use('/api/ai-config',     aiConfigRoutes);
app.use('/api/gallery',        galleryRoutes);
app.use('/api/users',          usersRoutes);
app.use('/api/conversations',   conversationsRoutes);
app.use('/api/events',          eventsRoutes);
app.use('/api/upload',          uploadRoutes);
app.use('/api/sitemap',         sitemapRoutes);
app.use('/api/backup',          backupRoutes);
app.use('/api/analytics',       analyticsRoutes);
app.use('/api/activity',       activityRoutes);

// Cron Job
app.get('/api/cron/publish-news', async (req, res) => {
    try {
        const published = await NewsModel.publishScheduled();
        res.json({ success: true, published });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health Check (Properly registered this time!)
app.get('/api/health', async (_req, res) => {
    let dbStatus = 'connecting';
    let dbError = null;
    let allTablesInDb = [];

    try {
        const rawResult = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table'");
        allTablesInDb = rawResult.rows.map(r => r.name);
        
        // Basic check for users
        if (allTablesInDb.includes('users')) {
            dbStatus = 'ok';
        } else {
            dbStatus = 'degraded';
            dbError = 'Database exists but is empty (no tables found)';
        }
    } catch (err) {
        dbStatus = 'error';
        dbError = err.message;
    }

    res.json({
        status: dbStatus === 'ok' ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        version: '3.0.0-pivot',
        database: {
            status: dbStatus,
            error: dbError,
            tables: allTablesInDb,
            url: process.env.TURSO_DATABASE_URL ? `${process.env.TURSO_DATABASE_URL.substring(0, 15)}...` : 'MISSING'
        }
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

export default app;
