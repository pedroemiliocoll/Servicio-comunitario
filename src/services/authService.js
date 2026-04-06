// src/services/authService.js — Service: Autenticación con el backend
import { apiRequest } from './api.js';

const TOKEN_KEY = 'liceo_admin_token';
const USER_KEY  = 'liceo_admin_user';

// Use localStorage for persistent sessions (survives browser close)
export const authService = {
    async login(username, password) {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data;
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    isAuthenticated() {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    getCurrentUser() {
        const u = localStorage.getItem(USER_KEY);
        return u ? JSON.parse(u) : null;
    },

    async verify() {
        try {
            const data = await apiRequest('/auth/verify');
            return data.valid;
        } catch {
            // Token expired or invalid - clear storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            return false;
        }
    },

    async checkAndRefreshAuth() {
        const token = localStorage.getItem(TOKEN_KEY);
        const user = localStorage.getItem(USER_KEY);
        
        if (!token || !user) {
            return { isValid: false, user: null };
        }

        try {
            const data = await apiRequest('/auth/verify');
            if (data.valid) {
                return { isValid: true, user: data.user };
            }
        } catch {
            // Token invalid - clear
        }

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return { isValid: false, user: null };
    },

    async changePassword(currentPassword, newPassword) {
        return apiRequest('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    },

    async requestPasswordReset(email) {
        return apiRequest('/auth/request-password-reset', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async resetPassword(token, newPassword) {
        return apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
        });
    }
};
