// server/routes/eventsRoutes.js
import { Router } from 'express';
import { eventsController } from '../controllers/eventsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/events/public:
 *   get:
 *     summary: Obtener eventos públicos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/public', eventsController.getPublic);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Obtener todos los eventos (admin)
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/', requireAuth, eventsController.getAll);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Crear un nuevo evento
 *     tags: [Eventos]
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
 *               - fecha
 *             properties:
 *               titulo: { type: string }
 *               descripcion: { type: string }
 *               fecha: { type: string }
 *               hora: { type: string }
 *               lugar: { type: string }
 *               categoria: { type: string }
 *     responses:
 *       201:
 *         description: Evento creado
 */
router.post('/', requireAuth, eventsController.create);

router.put('/:id', requireAuth, eventsController.update);
router.delete('/:id', requireAuth, eventsController.delete);

export default router;
