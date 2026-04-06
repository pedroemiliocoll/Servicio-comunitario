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

// No usamos mkdirSync en Vercel (Filesystem efímero/read-only)
if (process.env.NODE_ENV !== 'production') {
    // Solo localmente para evitar errores si no existen las carpetas
    // Pero en Vercel esto fallará o será inútil.
}

// Inicialización asíncrona (Vercel cargará el módulo una vez por instancia)
initializeDatabase().then(() => {
    seedDatabase().catch(err => console.error('Seed error:', err));
});

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

app.get('/api/health', (_req, res) => res.json({
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    version: '2.4.0-vercel'
}));

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
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor dev en http://localhost:${PORT}`);
    });
}

export default app;
