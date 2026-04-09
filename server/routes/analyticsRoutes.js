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

        // Run all main counts in parallel
        const [newsCount, galleryCount, eventsCount, usersCount] = await Promise.all([
            getCount(news),
            getCount(gallery),
            getCount(events),
            getCount(users),
        ]);

        // Mensajes de contacto
        const [unreadResult, lastMsgResult, contactCount] = await Promise.all([
            db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(contactMessages).where(eq(contactMessages.leido, 0)),
            db.select({ timestamp: contactMessages.timestamp }).from(contactMessages).orderBy(desc(contactMessages.timestamp)).limit(1),
            getCount(contactMessages),
        ]);

        // Noticias
        const [publishedResult, lastNewsResult] = await Promise.all([
            db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(news).where(eq(news.status, 'published')),
            db.select({ fecha: news.fecha }).from(news).orderBy(desc(news.fecha)).limit(1),
        ]);
        const publishedNews = publishedResult[0]?.count || 0;

        // Eventos: próximos y pasados
        const [upcomingResult, pastResult] = await Promise.all([
            db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(events).where(sql`${events.fecha} >= DATE('now')`),
            db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(events).where(sql`${events.fecha} < DATE('now')`),
        ]);

        // Galería
        const [galleryByCategoryResult, activeImagesResult] = await Promise.all([
            db.select({ categoria: gallery.categoria, count: sql`COUNT(*)`.mapWith(Number) }).from(gallery).groupBy(gallery.categoria),
            db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(gallery).where(eq(gallery.enabled, 1)),
        ]);

        // Usuarios por rol y nuevos este mes
        const [usersByRoleResult, newUsersResult] = await Promise.all([
            db.select({ role: users.role, count: sql`COUNT(*)`.mapWith(Number) }).from(users).groupBy(users.role),
            db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(users).where(sql`${users.createdAt} >= datetime('now', '-30 days')`),
        ]);

        // Chatbot
        const chatbotStats = await db.select({
            totalConversations: sql`COUNT(DISTINCT ${chatConversations.sessionId})`.mapWith(Number),
            todayConversations: sql`SUM(CASE WHEN DATE(${chatConversations.timestamp}) = DATE('now') THEN 1 ELSE 0 END)`.mapWith(Number)
        }).from(chatConversations);

        // Actividad reciente (últimas 24 horas)
        const recentAct = await db.all(sql`
            SELECT 
                CAST((SELECT COUNT(*) FROM news WHERE fecha >= datetime('now', '-24 hours')) AS INTEGER) +
                CAST((SELECT COUNT(*) FROM events WHERE fecha >= datetime('now', '-24 hours')) AS INTEGER) +
                CAST((SELECT COUNT(*) FROM gallery WHERE created_at >= datetime('now', '-24 hours')) AS INTEGER) as total
        `);

        res.json({
            news: newsCount,
            gallery: galleryCount,
            events: eventsCount,
            users: usersCount,
            contactMessages: contactCount,
            unreadMessages: unreadResult[0]?.count || 0,
            lastMessageDate: lastMsgResult[0]?.timestamp || null,
            publishedNews,
            draftNews: newsCount - publishedNews,
            lastNewsDate: lastNewsResult[0]?.fecha || null,
            upcomingEvents: upcomingResult[0]?.count || 0,
            pastEvents: pastResult[0]?.count || 0,
            galleryByCategory: galleryByCategoryResult || [],
            activeImages: activeImagesResult[0]?.count || 0,
            usersByRole: usersByRoleResult || [],
            newUsersThisMonth: newUsersResult[0]?.count || 0,
            chatbot: {
                totalConversations: chatbotStats[0]?.totalConversations || 0,
                todayConversations: chatbotStats[0]?.todayConversations || 0
            },
            recentActivity: recentAct[0]?.total || 0,
        });
    } catch (error) {
        console.error('Error getting portal stats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

export default router;
