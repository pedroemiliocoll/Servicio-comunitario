// server/routes/aiConfigRoutes.js
import { Router } from 'express';
import { aiConfigController } from '../controllers/aiConfigController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/',               requireAuth, aiConfigController.getConfig);
router.put('/',               requireAuth, aiConfigController.updateConfig);
router.post('/reset',        requireAuth, aiConfigController.resetConfig);

router.get('/responses',      requireAuth, aiConfigController.getResponses);
router.post('/responses',     requireAuth, aiConfigController.addResponse);
router.put('/responses/:id',  requireAuth, aiConfigController.updateResponse);
router.delete('/responses/:id', requireAuth, aiConfigController.deleteResponse);

router.get('/activity-log',   requireAuth, aiConfigController.getActivityLog);

export default router;
