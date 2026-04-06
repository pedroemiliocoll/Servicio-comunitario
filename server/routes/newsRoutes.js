// server/routes/newsRoutes.js
import { Router } from 'express';
import { newsController } from '../controllers/newsController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Obtener todas las noticias
 *     tags: [Noticias]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset para paginación
 *     responses:
 *       200:
 *         description: Lista de noticias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer }
 *                   titulo: { type: string }
 *                   extracto: { type: string }
 *                   categoria: { type: string }
 *                   fecha: { type: string }
 *                   image_url: { type: string }
 */
router.get('/', optionalAuth, newsController.getAll);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Obtener una noticia por ID
 *     tags: [Noticias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Noticia encontrada
 *       404:
 *         description: Noticia no encontrada
 */
router.get('/:id', newsController.getById);

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Crear una nueva noticia
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - contenido
 *             properties:
 *               titulo:
 *                 type: string
 *               extracto:
 *                 type: string
 *               contenido:
 *                 type: string
 *               categoria:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Noticia creada
 *       401:
 *         description: No autorizado
 */
router.post('/', requireAuth, newsController.create);

/**
 * @swagger
 * /api/news/reorder:
 *   put:
 *     summary: Reordenar noticias
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Noticias reordenadas
 */
router.put('/reorder', requireAuth, newsController.reorder);

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Actualizar una noticia
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           properties:
 *             titulo: { type: string }
 *             extracto: { type: string }
 *             contenido: { type: string }
 *             categoria: { type: string }
 *             image: { type: string }
 *     responses:
 *       200:
 *         description: Noticia actualizada
 *       404:
 *         description: Noticia no encontrada
 */
router.put('/:id', requireAuth, newsController.update);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Eliminar una noticia
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Noticia eliminada
 *       404:
 *         description: Noticia no encontrada
 */
router.delete('/:id', requireAuth, newsController.delete);

export default router;
