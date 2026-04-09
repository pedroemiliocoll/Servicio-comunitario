// server/models/EventModel.js — Model: Eventos del calendario institucional
import { db } from '../config/database.js';
import { events } from '../db/schema.js';
import { eq, and, gte, asc, sql } from 'drizzle-orm';

export const EventModel = {
    async getAll(onlyEnabled = false) {
        let query = db.select().from(events);
        if (onlyEnabled) {
            query.where(eq(events.enabled, 1));
        }
        return await query.orderBy(asc(events.fecha), asc(events.hora));
    },

    async getById(id) {
        const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
        return result[0] || null;
    },

    async getUpcoming(limit = 50) {
        return await db.select()
            .from(events)
            .where(eq(events.enabled, 1))
            .orderBy(asc(events.fecha), asc(events.hora))
            .limit(limit);
    },

    async create(data) {
        const result = await db.insert(events).values({
            titulo: data.titulo,
            descripcion: data.descripcion || '',
            fecha: data.fecha,
            hora: data.hora || null,
            tipo: data.tipo || 'general',
            lugar: data.lugar || null,
            enabled: 1
        }).returning();
        return result[0];
    },

    async update(id, data) {
        await db.update(events)
            .set({
                titulo: data.titulo,
                descripcion: data.descripcion || '',
                fecha: data.fecha,
                hora: data.hora || null,
                tipo: data.tipo || 'general',
                lugar: data.lugar || null,
                enabled: data.enabled !== undefined ? (data.enabled ? 1 : 0) : 1
            })
            .where(eq(events.id, id));
        return await this.getById(id);
    },

    async delete(id) {
        const result = await db.delete(events).where(eq(events.id, id));
        return result.rowsAffected > 0;
    },
};
