// server/routes/chatbotRoutes.js
import { Router } from 'express';
import { chatbotController } from '../controllers/chatbotController.js';
import { AiConfigModel } from '../models/AiConfigModel.js';
import { requireAuth } from '../middleware/auth.js';
import { createRateLimitMiddleware } from '../middleware/rateLimit.js';
import { validateMessage, validateSessionId } from '../middleware/inputValidator.js';

const router = Router();

/**
 * @swagger
 * /api/chatbot/config:
 *   get:
 *     summary: Obtener configuración del chatbot
 *     tags: [Chatbot]
 *     responses:
 *       200:
 *         description: Configuración del chatbot
 */
router.get('/config', chatbotController.getChatbotConfig);

/**
 * @swagger
 * /api/chatbot/message:
 *   post:
 *     summary: Enviar mensaje al chatbot
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - sessionId
 *             properties:
 *               message:
 *                 type: string
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta del chatbot
 *       429:
 *         description: Rate limit excedido
 */
router.post('/message', 
    createRateLimitMiddleware(),
    validateMessage,
    validateSessionId,
    chatbotController.sendMessage
);

/**
 * @swagger
 * /api/chatbot/history:
 *   get:
 *     summary: Obtener historial de conversaciones
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial de mensajes
 */
router.get('/history', chatbotController.getHistory);

/**
 * @swagger
 * /api/chatbot/feedback:
 *   post:
 *     summary: Enviar feedback de mensaje
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageId: { type: integer }
 *               rating: { type: integer }
 *     responses:
 *       200:
 *         description: Feedback registrado
 */
router.post('/feedback', chatbotController.submitFeedback);

/**
 * @swagger
 * /api/chatbot/analytics:
 *   get:
 *     summary: Obtener analíticas del chatbot
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del chatbot
 */
router.get('/analytics', requireAuth, chatbotController.getAnalytics);
router.get('/analytics/daily', requireAuth, chatbotController.getDailyStats);
router.get('/analytics/categories', requireAuth, chatbotController.getCategoryStats);
router.get('/analytics/frequent', requireAuth, chatbotController.getFrequentQuestions);
router.get('/analytics/summary', requireAuth, chatbotController.getSummary);
router.get('/analytics/export-csv', requireAuth, chatbotController.exportCsv);
router.get('/analytics/hourly', requireAuth, chatbotController.getHourlyStats);
router.get('/feedback-stats', requireAuth, chatbotController.getFeedbackStats);

export default router;
