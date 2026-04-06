// src/services/newsService.js — Service: Gestión de noticias vía API REST
import { apiRequest } from './api.js';

export const newsService = {
    getAll(category = null, includeAll = false) {
        let params = '';
        if (includeAll) {
            params = '?status=all';
        } else if (category && category !== 'todos') {
            params = `?category=${category}`;
        }
        return apiRequest(`/news${params}`);
    },

    getById(id) {
        return apiRequest(`/news/${id}`);
    },

    create(data) {
        return apiRequest('/news', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update(id, data) {
        return apiRequest(`/news/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    remove(id) {
        return apiRequest(`/news/${id}`, { method: 'DELETE' });
    },

    reorder(items) {
        return apiRequest('/news/reorder', {
            method: 'PUT',
            body: JSON.stringify({ items }),
        });
    }
};
