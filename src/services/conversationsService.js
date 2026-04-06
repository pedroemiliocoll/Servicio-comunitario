// src/services/conversationsService.js
import { apiRequest } from './api.js';

export const conversationsService = {
    getRecent(limit = 50)      { return apiRequest(`/conversations?limit=${limit}`); },
    getSession(sessionId)      { return apiRequest(`/conversations/${sessionId}`); },
    deleteSession(sessionId)   { return apiRequest(`/conversations/${sessionId}`, { method: 'DELETE' }); },
    getStats()                 { return apiRequest('/conversations/stats'); },
};
