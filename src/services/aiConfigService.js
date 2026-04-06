// src/services/aiConfigService.js — Service: Configuración de IA vía API
import { apiRequest } from './api.js';

export const aiConfigService = {
    getConfig()    { return apiRequest('/ai-config'); },

    updateConfig(data) {
        return apiRequest('/ai-config', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    resetConfig() {
        return apiRequest('/ai-config/reset', { method: 'POST' });
    },

    getChatbotConfig() {
        return apiRequest('/chatbot/config');
    },

    // ── Respuestas personalizadas ────────────────────────────────────────────
    getResponses() { return apiRequest('/ai-config/responses'); },

    addResponse(trigger, response, priority = 0) {
        return apiRequest('/ai-config/responses', {
            method: 'POST',
            body: JSON.stringify({ trigger, response, priority }),
        });
    },

    updateResponse(id, data) {
        return apiRequest(`/ai-config/responses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteResponse(id) {
        return apiRequest(`/ai-config/responses/${id}`, { method: 'DELETE' });
    },

    getActivityLog(limit = 50) {
        return apiRequest(`/ai-config/activity-log?limit=${limit}`);
    }
};
