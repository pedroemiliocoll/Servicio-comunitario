// server/services/activityService.js
import { db } from '../config/database.js';
import { activityLog } from '../db/schema.js';

export const logActivity = async (action, details = null) => {
    try {
        await db.insert(activityLog).values({
            action,
            details
        });
    } catch (error) {
        console.error('❌ Error logging activity:', error);
    }
};
