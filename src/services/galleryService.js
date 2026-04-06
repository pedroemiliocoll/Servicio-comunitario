// src/services/galleryService.js
import { apiRequest } from './api.js';

export const galleryService = {
    getPublic()    { return apiRequest('/gallery/public'); },       // destacadas (para instalaciones)
    getAllPublic() { return apiRequest('/gallery/all'); },         // todas visibles (para galería)
    getFeatured()  { return apiRequest('/gallery/featured'); },
    getAll()       { return apiRequest('/gallery'); },
    getByCategory(categoria) { return apiRequest(`/gallery/category/${categoria}`); },
    create(data)   { return apiRequest('/gallery', { method: 'POST', body: JSON.stringify(data) }); },
    update(id, data)  { return apiRequest(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    toggleFeatured(id) { return apiRequest(`/gallery/${id}/featured`, { method: 'PATCH' }); },
    delete(id)     { return apiRequest(`/gallery/${id}`, { method: 'DELETE' }); },
};

export default galleryService;
