// server/controllers/newsController.js — Controller: CRUD de noticias + búsqueda + status (v2-orden)
import { NewsModel } from '../models/NewsModel.js';
import { db } from '../config/database.js';
import { news } from '../db/schema.js';
import { logActivity } from '../services/activityService.js';
import { eq, and, or, like, desc, asc } from 'drizzle-orm';

export const newsController = {
    async getAll(req, res) {
        const { category, search, status } = req.query;
        let conditions = [];

        // Filtro de status: público solo ve published, admin puede ver todos
        const isAdmin = !!req.user;
        if (!isAdmin) {
            conditions.push(eq(news.status, 'published'));
        } else if (status && status !== 'all') {
            conditions.push(eq(news.status, status));
        }

        if (category && category !== 'todos') {
            conditions.push(eq(news.categoria, category));
        }

        if (search && search.trim()) {
            const term = `%${search.trim()}%`;
            conditions.push(or(
                like(news.titulo, term),
                like(news.extracto, term),
                like(news.contenido, term)
            ));
        }

        const query = db.select().from(news);
        if (conditions.length > 0) {
            query.where(and(...conditions));
        }
        
        const result = await query.orderBy(asc(news.orden), desc(news.fecha));
        res.json(result);
    },

    async getById(req, res) {
        const item = await NewsModel.getById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Noticia no encontrada' });
        res.json(item);
    },

    async create(req, res) {
        const { titulo, fecha, categoria, extracto, contenido, status = 'published', image_url = null } = req.body;
        if (!titulo || !fecha || !categoria || !extracto || !contenido) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const item = await NewsModel.create({ titulo, fecha, categoria, extracto, contenido, status, image_url });
        await logActivity('NEWS_CREATE', `Noticia creada: "${titulo}" (${status})`);
        res.status(201).json(item);
    },

    async update(req, res) {
        const existing = await NewsModel.getById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Noticia no encontrada' });
        const { titulo, fecha, categoria, extracto, contenido, status, image_url } = req.body;
        if (!titulo || !fecha || !categoria || !extracto || !contenido) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const item = await NewsModel.update(req.params.id, { titulo, fecha, categoria, extracto, contenido, status, image_url });
        await logActivity('NEWS_UPDATE', `Noticia actualizada: "${titulo}"`);
        res.json(item);
    },

    async delete(req, res) {
        const existing = await NewsModel.getById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Noticia no encontrada' });
        await NewsModel.delete(req.params.id);
        await logActivity('NEWS_DELETE', `Noticia eliminada: "${existing.titulo}"`);
        res.json({ message: 'Noticia eliminada correctamente' });
    },

    async reorder(req, res) {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Se requiere un array de items' });
        }
        try {
            for (const item of items) {
                await db.update(news).set({ orden: item.orden }).where(eq(news.id, item.id));
            }
            res.json({ message: 'Orden actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al reordenar' });
        }
    }
};
