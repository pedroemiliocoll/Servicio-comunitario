// server/routes/activityRoutes.js - Registro de actividad del sistema
import { Router } from 'express';
import { db } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { activityLog } from '../db/schema.js';
import { desc } from 'drizzle-orm';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const activities = await db.select().from(activityLog).orderBy(desc(activityLog.timestamp)).limit(limit);
        res.json(activities || []);
    } catch (error) {
        console.error('Error getting activity log:', error);
        res.status(500).json({ error: 'Error al obtener el registro de actividad' });
    }
});

export default router;
