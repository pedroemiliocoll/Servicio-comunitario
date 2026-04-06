// src/services/usersService.js
import { apiRequest } from './api.js';

export const usersService = {
    getAll()             { return apiRequest('/users'); },
    create(username, email, password, role) {
        return apiRequest('/users', { method: 'POST', body: JSON.stringify({ username, email, password, role }) });
    },
    update(id, data) {
        return apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    delete(id)           { return apiRequest(`/users/${id}`, { method: 'DELETE' }); },
};
