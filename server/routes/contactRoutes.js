// server/routes/contactRoutes.js
import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public route (Contact Form Submission)
router.post('/', contactController.submit);

// Protect all following routes with requireAuth
router.use(requireAuth);

router.get('/summary', contactController.getSummary);
router.get('/unread-count', contactController.getUnreadCount);
router.get('/email-status', contactController.getEmailStatus);
router.get('/export/csv', contactController.exportCsv);
router.patch('/mark-all-read', contactController.markAllRead);

router.get('/', contactController.getAll);
router.get('/:id', contactController.getById);
router.patch('/:id/read', contactController.markRead);
router.delete('/:id', contactController.delete);

router.get('/:id/replies', contactController.getReplies);
router.post('/:id/reply', contactController.reply);
router.post('/:id/reply-only', contactController.replyOnly);

export default router;
