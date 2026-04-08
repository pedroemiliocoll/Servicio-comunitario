// server/models/NewsModel.js — Model: Noticias (acceso a datos)
import { db } from '../config/database.js';
import { news } from '../db/schema.js';
import { eq, and, lte, isNotNull, sql, desc, asc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const NewsModel = {
    async getAll(onlyPublished = true) {
        if (onlyPublished) {
            return await db.select()
                .from(news)
                .where(eq(news.status, 'published'))
                .orderBy(asc(news.orden), desc(news.fecha));
        }
        return await db.select()
            .from(news)
            .orderBy(asc(news.orden), desc(news.fecha));
    },

    async getById(id) {
        const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
        return result[0] || null;
    },

    async create(data) {
        const id = nanoid();
        const status = data.scheduled_at ? 'scheduled' : (data.status || 'published');
        
        const maxResult = await db.select({ max: sql`max(${news.orden})` }).from(news);
        const maxOrden = Number(maxResult[0]?.max ?? 0);
        const orden = data.orden ?? (maxOrden + 1);

        await db.insert(news).values({
            id,
            titulo: data.titulo,
            fecha: data.fecha,
            categoria: data.categoria,
            extracto: data.extracto,
            contenido: data.contenido,
            status,
            imageUrl: data.image_url || null,
            scheduledAt: data.scheduled_at || null,
            orden
        });

        return await this.getById(id);
    },

    async update(id, data) {
        const status = data.scheduled_at ? 'scheduled' : (data.status || 'published');
        
        await db.update(news).set({
            titulo: data.titulo,
            fecha: data.fecha,
            categoria: data.categoria,
            extracto: data.extracto,
            contenido: data.contenido,
            status,
            imageUrl: data.image_url || null,
            scheduledAt: data.scheduled_at || null,
            updatedAt: sql`datetime('now')`
        }).where(eq(news.id, id));

        return await this.getById(id);
    },

    async delete(id) {
        const result = await db.delete(news).where(eq(news.id, id));
        return result.rowsAffected > 0;
    },

    async publishScheduled() {
        const now = new Date().toISOString();
        const result = await db.update(news).set({
            status: 'published',
            scheduledAt: null
        }).where(
            and(
                eq(news.status, 'scheduled'),
                isNotNull(news.scheduledAt),
                lte(news.scheduledAt, now)
            )
        );
        return result.rowsAffected;
    },

    async count() {
        const result = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(news);
        return result[0]?.count || 0;
    }
};
