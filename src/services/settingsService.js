// src/services/settingsService.js — Service: Configuración del liceo vía API
import { apiRequest } from './api.js';

export const settingsService = {
    getPublic()         { return apiRequest('/settings'); },
    getAdmin()          { return apiRequest('/settings/admin'); },

    updateInfo(data) {
        return apiRequest('/settings', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    updateApiKey(apiKey) {
        return apiRequest('/settings/api-key', {
            method: 'PUT',
            body: JSON.stringify({ apiKey }),
        });
    },

    getComunicado() {
        return apiRequest('/settings/comunicado');
    },

    updateComunicado(data) {
        return apiRequest('/settings/comunicado', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
};
