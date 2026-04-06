// src/services/contactService.js
import { apiRequest } from './api.js';

export const contactService = {
    // Enviar mensaje desde formulario público
    submit(data) {
        return apiRequest('/contact', { method: 'POST', body: JSON.stringify(data) });
    },

    // Obtener todos los mensajes (con filtros opcionales)
    getAll(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.from) params.append('from', filters.from);
        if (filters.to) params.append('to', filters.to);
        
        const query = params.toString() ? `?${params.toString()}` : '';
        return apiRequest(`/contact${query}`);
    },

    // Obtener resumen (total y no leídos)
    getSummary() {
        return apiRequest('/contact/summary');
    },

    // Obtener solo conteo de no leídos
    getUnreadCount() {
        return apiRequest('/contact/unread-count');
    },

    // Obtener mensaje específico con respuestas
    getById(id) {
        return apiRequest(`/contact/${id}`);
    },

    // Obtener respuestas de un mensaje
    getReplies(messageId) {
        return apiRequest(`/contact/${messageId}/replies`);
    },

    // Marcar como leído
    markRead(id) {
        return apiRequest(`/contact/${id}/read`, { method: 'PATCH' });
    },

    // Marcar todos como leídos
    markAllRead() {
        return apiRequest('/contact/mark-all-read', { method: 'PATCH' });
    },

    // Responder y enviar email
    reply(id, respuesta, sendEmail = true) {
        return apiRequest(`/contact/${id}/reply`, {
            method: 'POST',
            body: JSON.stringify({ respuesta, sendEmail })
        });
    },

    // Responder sin enviar email
    replyOnly(id, respuesta) {
        return apiRequest(`/contact/${id}/reply-only`, {
            method: 'POST',
            body: JSON.stringify({ respuesta })
        });
    },

    // Eliminar mensaje
    delete(id) {
        return apiRequest(`/contact/${id}`, { method: 'DELETE' });
    },

    // Exportar a CSV
    exportCsv() {
        return apiRequest('/contact/export/csv');
    },

    // Verificar estado del email
    getEmailStatus() {
        return apiRequest('/contact/email-status');
    }
};

export default contactService;
