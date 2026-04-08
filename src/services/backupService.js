// src/services/backupService.js - Servicio de backup
import { apiRequest } from './api';

export const backupService = {
    async export() {
        const response = await fetch('/api/backup/export', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('liceo_admin_token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al exportar backup');
        }
        
        const data = await response.blob();
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `liceo-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    },

    async getStats() {
        return apiRequest('/backup/stats');
    }
};
