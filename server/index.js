// server/index.js — Entry point del servidor Express (Vercel Compatible)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { initializeDatabase } from './config/database.js';
import { seedDatabase } from './services/seedService.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import logger, { logRequest, logSecurity } from './services/logger.js';
import { createRateLimitMiddleware } from './middleware/rateLimit.js';
import { swaggerSpec } from './config/swagger.js';

import authRoutes          from './routes/authRoutes.js';
import newsRoutes          from './routes/newsRoutes.js';
import chatbotRoutes       from './routes/chatbotRoutes.js';
import settingsRoutes      from './routes/settingsRoutes.js';
import aiConfigRoutes      from './routes/aiConfigRoutes.js';
import contactRoutes       from './routes/contactRoutes.js';
import galleryRoutes       from './routes/galleryRoutes.js';
import usersRoutes         from './routes/usersRoutes.js';
import conversationsRoutes from './routes/conversationsRoutes.js';
import eventsRoutes        from './routes/eventsRoutes.js';
import uploadRoutes        from './routes/uploadRoutes.js';
import sitemapRoutes       from './routes/sitemapRoutes.js';
import backupRoutes        from './routes/backupRoutes.js';
import analyticsRoutes     from './routes/analyticsRoutes.js';
import activityRoutes      from './routes/activityRoutes.js';
import { NewsModel }       from './models/NewsModel.js';
import { UserModel }       from './models/UserModel.js';
import { db, client }      from './config/database.js';
import { contactMessages } from './db/schema.js';
import { sql }             from 'drizzle-orm';

// No usamos mkdirSync en Vercel (Filesystem efímero/read-only)
if (process.env.NODE_ENV !== 'production') {
    // Solo localmente para evitar errores si no existen las carpetas
    // Pero en Vercel esto fallará o será inútil.
}

// Background initialization (Don't block the startup of the serverless function)
const startServices = async () => {
    try {
        await initializeDatabase();
        // Only seed if we're not explicitly in production or if it's the first run
        await seedDatabase();
        console.log('✅ Services started successfully');
    } catch (err) {
        console.error('❌ ERROR starting services:', err);
    }
};

startServices();

const app = express();

app.use(cors({
    origin: '*', // En producción podrías restringirlo
    credentials: true
}));

app.use(compression());

// Middleware para deshabilitar cache en todas las respuestas de la API
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

app.use('/api/auth',          authRoutes);
app.use('/api/news',          newsRoutes);
app.use('/api/chatbot',       chatbotRoutes);
app.use('/api/settings',      settingsRoutes);
app.use('/api/ai-config',     aiConfigRoutes);
app.use('/api/contact',       contactRoutes);
app.use('/api/gallery',        galleryRoutes);
app.use('/api/users',          usersRoutes);
app.use('/api/conversations',   conversationsRoutes);
app.use('/api/events',          eventsRoutes);
app.use('/api/upload',          uploadRoutes);
app.use('/api/sitemap',         sitemapRoutes);
app.use('/api/backup',          backupRoutes);
app.use('/api/analytics',       analyticsRoutes);
app.use('/api/activity',       activityRoutes);

// Endpoint para el scheduler de Vercel (Cron Job)
app.get('/api/cron/publish-news', async (req, res) => {
    // Verificar token secreto para evitar ejecuciones externas si es necesario
    try {
        const published = await NewsModel.publishScheduled();
        res.json({ success: true, published });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

    let tablesFound = [];
    let allTablesInDb = [];

    try {
        // Safe way to list tables using the raw client to avoid Drizzle parsing errors during boot
        const rawResult = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table'");
        allTablesInDb = rawResult.rows.map(r => r.name);

        // Test specific queries
        await UserModel.count();
        tablesFound.push('users');
        
        await db.select({ count: sql`count(*)` }).from(contactMessages);
        tablesFound.push('contact_messages');
        
        dbStatus = 'ok';
    } catch (err) {
        dbStatus = 'error';
        dbError = err.message;
        console.error('DATABASE_HEALTH_CHECK_FAILED:', err);
    }

    res.json({
        status: dbStatus === 'ok' ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        version: '2.4.3-deep-diag',
        database: {
            status: dbStatus,
            error: dbError,
            tablesMapped: tablesFound,
            allTablesInDatabase: allTablesInDb,
            url: process.env.TURSO_DATABASE_URL ? `${process.env.TURSO_DATABASE_URL.substring(0, 20)}...` : 'MISSING'
        },
        environment: {
            nodeEnv: process.env.NODE_ENV,
            isVercel: !!process.env.VERCEL,
            hasTursoConfig: !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN)
        }
    });

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

// Manejo de errores globales
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
});

// En Vercel no usamos app.listen(), exportamos la app.
// Pero dejamos esto para compatibilidad local.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor dev en http://localhost:${PORT}`);
    });
}

export default app;
