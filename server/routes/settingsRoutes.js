// server/routes/settingsRoutes.js
import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Obtener configuración pública del liceo
 *     tags: [Configuración]
 *     responses:
 *       200:
 *         description: Configuración pública
 */
router.get('/', settingsController.getPublic);

/**
 * @swagger
 * /api/settings/admin:
 *   get:
 *     summary: Obtener configuración del admin
 *     tags: [Configuración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración del admin
 */
router.get('/admin', requireAuth, settingsController.getAdmin);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Actualizar información del liceo
 *     tags: [Configuración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           properties:
 *             nombre: { type: string }
 *             telefono: { type: string }
 *             email: { type: string }
 *             direccion: { type: string }
 *     responses:
 *       200:
 *         description: Configuración actualizada
 */
router.put('/', requireAuth, settingsController.updateLiceoInfo);

router.get('/comunicado', settingsController.getComunicado);
router.put('/api-key', requireAuth, settingsController.updateApiKey);
router.put('/comunicado', requireAuth, settingsController.updateComunicado);

export default router;
