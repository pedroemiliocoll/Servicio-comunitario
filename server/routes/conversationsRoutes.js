// server/routes/conversationsRoutes.js
import { Router } from 'express';
import { conversationsController } from '../controllers/conversationsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/',                          requireAuth, conversationsController.getRecent);
router.get('/stats',                     requireAuth, conversationsController.getStats);
router.get('/:sessionId',                requireAuth, conversationsController.getSession);
router.delete('/:sessionId',             requireAuth, conversationsController.deleteSession);

export default router;
