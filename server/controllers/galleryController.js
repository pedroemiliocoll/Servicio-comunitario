// server/controllers/galleryController.js — Controller: Galería de imágenes
import { GalleryModel } from '../models/GalleryModel.js';
import { logActivity } from '../services/activityService.js';

export const galleryController = {
    async getPublic(req, res) {
        // Para página de instalaciones - solo destacadas (hasta 5)
        const featured = await GalleryModel.getFeatured(5);
        if (featured.length > 0) {
            return res.json(featured);
        }
        res.json(await GalleryModel.getAll(true));
    },

    // Obtener todas las imágenes públicas (para página de galería)
    async getAllPublic(req, res) {
        res.json(await GalleryModel.getAll(true));
    },

    async getAll(req, res) {
        res.json(await GalleryModel.getAll(false));
    },

    async getFeatured(req, res) {
        res.json(await GalleryModel.getFeatured(5));
    },

    async getByCategory(req, res) {
        const { categoria } = req.params;
        res.json(await GalleryModel.getByCategory(categoria));
    },

    async create(req, res) {
        const { titulo, descripcion, image_url, categoria, orden, featured } = req.body;
        if (!titulo?.trim() || !image_url?.trim()) {
            return res.status(400).json({ error: 'Título e imagen URL son requeridos' });
        }
        const item = await GalleryModel.create({ titulo, descripcion, image_url, categoria, orden, featured });
        await logActivity('GALLERY_ADD', `Imagen agregada: "${titulo}"`);
        res.status(201).json(item);
    },

    async update(req, res) {
        const existing = await GalleryModel.getById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Imagen no encontrada' });
        const item = await GalleryModel.update(req.params.id, req.body);
        res.json(item);
    },

    async toggleFeatured(req, res) {
        const item = await GalleryModel.toggleFeatured(req.params.id);
        if (!item) return res.status(404).json({ error: 'Imagen no encontrada' });
        
        const action = item.featured ? 'GALLERY_FEATURED' : 'GALLERY_UNFEATURED';
        await logActivity(action, `Imagen "${item.titulo}" ${item.featured ? 'marcada' : 'desmarcada'} como destacada`);
        
        res.json(item);
    },

    async delete(req, res) {
        const deleted = await GalleryModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Imagen no encontrada' });
        await logActivity('GALLERY_DELETE', `Imagen eliminada ID: ${req.params.id}`);
        res.json({ message: 'Imagen eliminada' });
    }
};

export default galleryController;
