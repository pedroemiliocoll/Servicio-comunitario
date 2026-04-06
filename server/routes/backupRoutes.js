// server/routes/backupRoutes.js - Backup y exportación de datos
import { Router } from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { news, events, gallery, contactMessages, contactReplies, chatConversations, analytics, settings, aiResponses, users } from '../db/schema.js';

const router = Router();

router.get('/export', requireAuth, async (_req, res) => {
    try {
        const backup = {
            version: '2.0',
            timestamp: new Date().toISOString(),
            data: {}
        };

        // Exportamos las tablas principales usando Drizzle
        backup.data.users = await db.select().from(users);
        backup.data.news = await db.select().from(news);
        backup.data.events = await db.select().from(events);
        backup.data.gallery = await db.select().from(gallery);
        backup.data.contactMessages = await db.select().from(contactMessages);
        backup.data.contactReplies = await db.select().from(contactReplies);
        backup.data.chatConversations = await db.select().from(chatConversations);
        backup.data.analytics = await db.select().from(analytics);
        backup.data.settings = await db.select().from(settings);
        backup.data.aiResponses = await db.select().from(aiResponses);

        // En Vercel no guardamos a disco, enviamos directamente al cliente
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="liceo-backup-${new Date().toISOString().split('T')[0]}.json"`);
        res.send(JSON.stringify(backup, null, 2));
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ error: 'Error al generar backup' });
    }
});

router.get('/stats', requireAuth, async (_req, res) => {
    try {
        // En 2026, Drizzle tiene helpers directos para count()
        const stats = {
            users: (await db.select({ count: users.id }).from(users)).length,
            news: (await db.select({ count: news.id }).from(news)).length,
            events: (await db.select({ count: events.id }).from(events)).length,
            gallery: (await db.select({ count: gallery.id }).from(gallery)).length,
            contactMessages: (await db.select({ count: contactMessages.id }).from(contactMessages)).length
        };
        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

export default router;
