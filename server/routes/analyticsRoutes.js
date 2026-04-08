// server/routes/analyticsRoutes.js - Estadísticas del portal
import { Router } from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { analyticsEvents, news, gallery, events, users, contactMessages, chatConversations } from '../db/schema.js';
import { eq, and, sql, desc, gte } from 'drizzle-orm';

const router = Router();

router.post('/track', async (req, res) => {
    try {
        const { type, data } = req.body;
        if (!type || !data) return res.status(400).json({ error: 'Datos inválidos' });
        
        if (type === 'pageview') {
            await db.insert(analyticsEvents).values({
                eventType: 'pageview',
                sessionId: data.sessionId,
                url: data.url,
                referrer: data.referrer,
                timestamp: data.timestamp
            });
        } else if (type === 'event') {
            await db.insert(analyticsEvents).values({
                eventType: 'event',
                sessionId: data.sessionId,
                category: data.category,
                action: data.action,
                label: data.label,
                value: data.value,
                url: data.url,
                timestamp: data.timestamp
            });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking event:', error);
        res.status(500).json({ error: 'Error al registrar evento' });
    }
});

router.get('/stats', requireAuth, async (_req, res) => {
    try {
        // Query builder para estadísticas temporales
        const getCount = async (type, period) => {
            let filter = eq(analyticsEvents.eventType, type);
            if (period === 'today') {
                filter = and(filter, sql`DATE(${analyticsEvents.timestamp}) = DATE('now')`);
            } else if (period === 'week') {
                filter = and(filter, sql`${analyticsEvents.timestamp} >= datetime('now', '-7 days')`);
            } else if (period === 'month') {
                filter = and(filter, sql`${analyticsEvents.timestamp} >= datetime('now', '-30 days')`);
            }
            const result = await db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(analyticsEvents).where(filter);
            return result[0]?.count || 0;
        };

        const topPages = await db.select({ 
            url: analyticsEvents.url, 
            views: sql`COUNT(*)`.mapWith(Number) 
        }).from(analyticsEvents)
          .where(eq(analyticsEvents.eventType, 'pageview'))
          .groupBy(analyticsEvents.url)
          .orderBy(sql`views DESC`)
          .limit(10);

        const topEvents = await db.select({ 
            category: analyticsEvents.category, 
            action: analyticsEvents.action, 
            count: sql`COUNT(*)`.mapWith(Number) 
        }).from(analyticsEvents)
          .where(eq(analyticsEvents.eventType, 'event'))
          .groupBy(analyticsEvents.category, analyticsEvents.action)
          .orderBy(sql`count DESC`)
          .limit(10);

        res.json({
            pageviews: {
                today: await getCount('pageview', 'today'),
                week: await getCount('pageview', 'week'),
                month: await getCount('pageview', 'month'),
            },
            events: {
                today: await getCount('event', 'today'),
                week: await getCount('event', 'week'),
                month: await getCount('event', 'month'),
            },
            topPages,
            topEvents
        });
    } catch (error) {
        console.error('Error getting analytics stats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

router.get('/portal', requireAuth, async (_req, res) => {
    try {
        const getCount = async (table) => {
            const res = await db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(table);
            return res[0]?.count || 0;
        };

        const stats = {
            news: await getCount(news),
            gallery: await getCount(gallery),
            events: await getCount(events),
            users: await getCount(users)
        };

        // Mensajes de contacto
        const unreadMessages = await db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(contactMessages).where(eq(contactMessages.leido, false));
        const lastMsg = await db.select({ timestamp: contactMessages.timestamp }).from(contactMessages).orderBy(desc(contactMessages.timestamp)).limit(1);
        
        stats.contactMessages = await getCount(contactMessages);
        stats.unreadMessages = unreadMessages[0]?.count || 0;
        stats.lastMessageDate = lastMsg[0]?.timestamp || null;

        // Noticias
        const publishedNews = await db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(news).where(eq(news.status, 'published'));
        const lastNews = await db.select({ fecha: news.fecha }).from(news).orderBy(desc(news.fecha)).limit(1);
        
        stats.publishedNews = publishedNews[0]?.count || 0;
        stats.draftNews = stats.news - stats.publishedNews;
        stats.lastNewsDate = lastNews[0]?.fecha || null;

        // Galería
        const galleryByCategory = await db.select({ 
            categoria: gallery.categoria, 
            count: sql`COUNT(*)`.mapWith(Number) 
        }).from(gallery).groupBy(gallery.categoria);
        
        const activeImages = await db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(gallery).where(eq(gallery.enabled, true));
        
        stats.galleryByCategory = galleryByCategory || [];
        stats.activeImages = activeImages[0]?.count || 0;

        // Chatbot
        const chatbotStats = await db.select({
            totalConversations: sql`COUNT(DISTINCT ${chatConversations.sessionId})`.mapWith(Number),
            todayConversations: sql`SUM(CASE WHEN DATE(${chatConversations.timestamp}) = DATE('now') THEN 1 ELSE 0 END)`.mapWith(Number)
        }).from(chatConversations);

        stats.chatbot = {
            totalConversations: chatbotStats[0]?.totalConversations || 0,
            todayConversations: chatbotStats[0]?.todayConversations || 0
        };

        // Actividad reciente
        const recentAct = await db.execute(sql`
            SELECT 
                CAST((SELECT COUNT(*) FROM news WHERE fecha >= datetime('now', '-24 hours')) AS INTEGER) +
                CAST((SELECT COUNT(*) FROM events WHERE fecha >= datetime('now', '-24 hours')) AS INTEGER) +
                CAST((SELECT COUNT(*) FROM gallery WHERE created_at >= datetime('now', '-24 hours')) AS INTEGER) as total
        `);
        stats.recentActivity = recentAct.rows[0]?.total || 0;

        res.json(stats);
    } catch (error) {
        console.error('Error getting portal stats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

export default router;
