// server/models/GalleryModel.js — Model: Galería de imágenes
import { db } from '../config/database.js';
import { gallery } from '../db/schema.js';
import { eq, and, desc, asc, sql } from 'drizzle-orm';

export const GalleryModel = {
    async getAll(onlyEnabled = false) {
        let query = db.select().from(gallery);
        if (onlyEnabled) {
            query.where(eq(gallery.enabled, 1));
        }
        return await query.orderBy(asc(gallery.orden), desc(gallery.id));
    },

    async getById(id) {
        const result = await db.select().from(gallery).where(eq(gallery.id, id)).limit(1);
        return result[0] || null;
    },

    async getByCategory(categoria) {
        return await db.select()
            .from(gallery)
            .where(and(eq(gallery.enabled, 1), eq(gallery.categoria, categoria)))
            .orderBy(asc(gallery.orden));
    },

    // Obtener imágenes destacadas para la página de instalaciones
    async getFeatured(limit = 5) {
        return await db.select()
            .from(gallery)
            .where(and(eq(gallery.enabled, 1), eq(gallery.featured, 1)))
            .orderBy(asc(gallery.orden), desc(gallery.id))
            .limit(limit);
    },

    // Obtener imágenes por categoría "instalaciones"
    async getByInstalaciones() {
        return await db.select()
            .from(gallery)
            .where(and(eq(gallery.enabled, 1), eq(gallery.categoria, 'instalaciones')))
            .orderBy(asc(gallery.orden), desc(gallery.id));
    },

    async create(data) {
        const result = await db.insert(gallery).values({
            titulo: data.titulo,
            descripcion: data.descripcion || '',
            imageUrl: data.image_url,
            categoria: data.categoria || 'general',
            orden: data.orden || 0,
            featured: data.featured || 0
        }).returning();
        return result[0];
    },

    async update(id, data) {
        await db.update(gallery)
            .set({
                titulo: data.titulo,
                descripcion: data.descripcion || '',
                imageUrl: data.image_url,
                categoria: data.categoria || 'general',
                enabled: data.enabled !== undefined ? (data.enabled ? 1 : 0) : 1,
                orden: data.orden || 0,
                featured: data.featured ? 1 : 0
            })
            .where(eq(gallery.id, id));
        return await this.getById(id);
    },

    async toggleFeatured(id) {
        const item = await this.getById(id);
        if (item) {
            await db.update(gallery)
                .set({ featured: item.featured ? 0 : 1 })
                .where(eq(gallery.id, id));
            return await this.getById(id);
        }
        return null;
    },

    async delete(id) {
        const result = await db.delete(gallery).where(eq(gallery.id, id));
        return result.rowsAffected > 0;
    },

    async count() {
        const result = await db.select({ count: sql`count(*)` }).from(gallery).where(eq(gallery.enabled, 1));
        return result[0].count;
    },

    async countFeatured() {
        const result = await db.select({ count: sql`count(*)` }).from(gallery).where(and(eq(gallery.enabled, 1), eq(gallery.featured, 1)));
        return result[0].count;
    }
};

export default GalleryModel;
