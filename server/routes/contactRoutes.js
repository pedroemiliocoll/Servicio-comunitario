// server/routes/contactRoutes.js
import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Enviar mensaje de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string }
 *               asunto: { type: string }
 *               mensaje: { type: string }
 *     responses:
 *       200:
 *         description: Mensaje enviado
 *       400:
 *         description: Error en los datos
 */
router.post('/', contactController.submit);

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Obtener todos los mensajes de contacto
 *     tags: [Contacto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mensajes
 */
router.get('/', requireAuth, contactController.getAll);

/**
 * @swagger
 * /api/contact/{id}:
 *   get:
 *     summary: Obtener un mensaje por ID
 *     tags: [Contacto]
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
 *         description: Mensaje encontrado
 */
router.get('/:id', requireAuth, contactController.getById);

/**
 * @swagger
 * /api/contact/{id}:
 *   patch:
 *     summary: Marcar mensaje como leído
 *     tags: [Contacto]
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
 *         description: Mensaje marcado como leído
 */
router.patch('/:id/read', requireAuth, contactController.markRead);

/**
 * @swagger
 * /api/contact/{id}:
 *   delete:
 *     summary: Eliminar un mensaje
 *     tags: [Contacto]
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
 *         description: Mensaje eliminado
 */
router.delete('/:id', requireAuth, contactController.delete);

router.get('/email-status', requireAuth, contactController.getEmailStatus);
router.get('/summary', requireAuth, contactController.getSummary);
router.get('/unread-count', requireAuth, contactController.getUnreadCount);
router.get('/export/csv', requireAuth, contactController.exportCsv);
router.get('/:id/replies', requireAuth, contactController.getReplies);
router.patch('/mark-all-read', requireAuth, contactController.markAllRead);
router.post('/:id/reply', requireAuth, contactController.reply);
router.post('/:id/reply-only', requireAuth, contactController.replyOnly);

export default router;
