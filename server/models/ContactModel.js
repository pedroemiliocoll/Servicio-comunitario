// server/models/ContactModel.js — Model: Mensajes de contacto
import { db } from '../config/database.js';
import { contactMessages, contactReplies } from '../db/schema.js';
import { eq, and, or, like, gte, lte, desc, asc, sql } from 'drizzle-orm';

export const ContactModel = {
    async create(data) {
        const result = await db.insert(contactMessages).values({
            nombre: data.nombre.trim(),
            email: data.email.trim(),
            asunto: data.asunto || 'general',
            mensaje: data.mensaje.trim()
        }).returning();
        return result[0];
    },

    async getAll() {
        return await db.select().from(contactMessages).orderBy(desc(contactMessages.timestamp));
    },

    async getById(id) {
        const result = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
        return result[0] || null;
    },

    async getUnread() {
        return await db.select().from(contactMessages).where(eq(contactMessages.leido, 0)).orderBy(desc(contactMessages.timestamp));
    },

    async markRead(id) {
        await db.update(contactMessages).set({ leido: 1 }).where(eq(contactMessages.id, id));
    },

    async markAllRead() {
        await db.update(contactMessages).set({ leido: 1 });
    },

    async delete(id) {
        const result = await db.delete(contactMessages).where(eq(contactMessages.id, id));
        return result.rowsAffected > 0;
    },

    async countUnread() {
        const result = await db.select({ count: sql`count(*)` }).from(contactMessages).where(eq(contactMessages.leido, 0));
        return Number(result[0]?.count ?? 0);
    },

    // Búsqueda con filtros
    async search(filters = {}) {
        let conditions = [];

        if (filters.search) {
            const term = `%${filters.search.trim()}%`;
            conditions.push(or(
                like(contactMessages.nombre, term),
                like(contactMessages.email, term),
                like(contactMessages.mensaje, term),
                like(contactMessages.asunto, term)
            ));
        }

        if (filters.status === 'read') {
            conditions.push(eq(contactMessages.leido, 1));
        } else if (filters.status === 'unread') {
            conditions.push(eq(contactMessages.leido, 0));
        }

        if (filters.from) {
            conditions.push(gte(sql`date(${contactMessages.timestamp})`, sql`date(${filters.from})`));
        }

        if (filters.to) {
            conditions.push(lte(sql`date(${contactMessages.timestamp})`, sql`date(${filters.to})`));
        }

        const query = db.select().from(contactMessages);
        if (conditions.length > 0) {
            query.where(and(...conditions));
        }
        
        return await query.orderBy(desc(contactMessages.timestamp));
    },

    // Respuestas
    async addReply(messageId, respuesta) {
        const result = await db.insert(contactReplies).values({
            messageId,
            respuesta: respuesta.trim()
        }).returning();
        await this.markRead(messageId);
        return result[0];
    },

    async getReplies(messageId) {
        return await db.select().from(contactReplies)
            .where(eq(contactReplies.messageId, messageId))
            .orderBy(asc(contactReplies.createdAt));
    },

    async getReplyCount(messageId) {
        const result = await db.select({ count: sql`count(*)` })
            .from(contactReplies)
            .where(eq(contactReplies.messageId, messageId));
        return Number(result[0]?.count ?? 0);
    },

    // Exportar
    async getAllForExport() {
        // En Drizzle, podemos usar subconsultas o un join con agregación.
        // Aquí usaremos una subconsulta manual en el select para mantener la lógica original.
        return await db.select({
            id: contactMessages.id,
            nombre: contactMessages.nombre,
            email: contactMessages.email,
            asunto: contactMessages.asunto,
            mensaje: contactMessages.mensaje,
            leido: contactMessages.leido,
            timestamp: contactMessages.timestamp,
            reply_count: sql`(SELECT count(*) FROM contact_replies WHERE message_id = ${contactMessages.id})`
        })
        .from(contactMessages)
        .orderBy(desc(contactMessages.timestamp));
    }
};

export default ContactModel;
