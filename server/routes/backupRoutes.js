// server/routes/backupRoutes.js - Backup y exportación de datos
import { Router } from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { news, events, gallery, contactMessages, contactReplies, chatConversations, aiConfig, aiCustomResponses, settings, activityLog, users, chatbotAnalytics } from '../db/schema.js';
import { sql } from 'drizzle-orm';

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
        backup.data.analytics = await db.select().from(chatbotAnalytics);
        backup.data.settings = await db.select().from(settings);
        backup.data.aiResponses = await db.select().from(aiCustomResponses);
        backup.data.aiConfig = await db.select().from(aiConfig);
        backup.data.activityLog = await db.select().from(activityLog);

        // En Vercel no guardamos a disco, enviamos directamente al cliente
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="liceo-backup-${new Date().toISOString().split('T')[0]}.json"`);
        res.send(JSON.stringify(backup, (key, value) => typeof value === 'bigint' ? Number(value) : value, 2));
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ error: 'Error al generar backup' });
    }
});

router.get('/stats', requireAuth, async (_req, res) => {
    try {
        const getCount = async (table) => {
            const res = await db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(table);
            return res[0]?.count || 0;
        };

        const stats = {
            users: await getCount(users),
            news: await getCount(news),
            events: await getCount(events),
            gallery: await getCount(gallery),
            contactMessages: await getCount(contactMessages)
        };
        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

export default router;
