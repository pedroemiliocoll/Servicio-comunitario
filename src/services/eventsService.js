// src/services/eventsService.js
import { apiRequest } from './api.js';

export const eventsService = {
    getPublic()        { return apiRequest('/events/public'); },
    getAll()           { return apiRequest('/events'); },
    create(data)       { return apiRequest('/events', { method: 'POST', body: JSON.stringify(data) }); },
    update(id, data)   { return apiRequest(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    delete(id)         { return apiRequest(`/events/${id}`, { method: 'DELETE' }); },
};
