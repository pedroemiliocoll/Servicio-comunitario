// src/services/activityService.js
import { apiRequest } from './api.js';

export const activityService = {
    getLog(limit = 50) {
        return apiRequest(`/activity?limit=${limit}`);
    }
};
