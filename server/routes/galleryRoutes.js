// server/routes/galleryRoutes.js
import { Router } from 'express';
import { galleryController } from '../controllers/galleryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/gallery/all:
 *   get:
 *     summary: Obtener todas las imágenes públicas de la galería
 *     tags: [Galería]
 *     responses:
 *       200:
 *         description: Lista de imágenes
 */
router.get('/all', galleryController.getAllPublic);

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Obtener todas las imágenes (admin)
 *     tags: [Galería]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de imágenes
 */
router.get('/', requireAuth, galleryController.getAll);

/**
 * @swagger
 * /api/gallery:
 *   post:
 *     summary: Subir una nueva imagen
 *     tags: [Galería]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               titulo:
 *                 type: string
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Imagen creada
 */
router.post('/', requireAuth, galleryController.create);

router.get('/public', galleryController.getPublic);
router.get('/featured', galleryController.getFeatured);
router.get('/category/:categoria', galleryControllerByCategory);
router.put('/:id', requireAuth, galleryController.update);
router.patch('/:id/featured', requireAuth, galleryController.toggleFeatured);
router.delete('/:id', requireAuth, galleryController.delete);

function galleryControllerByCategory(req, res) {
    galleryController.getByCategory(req, res);
}

export default router;
