// src/services/api.js — Capa base de comunicación con el API REST
// Todos los servicios del frontend pasan por aquí.
// La URL base se toma de la variable de entorno o usa la ruta relativa
// (funciona con el proxy de Vite en desarrollo).

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
    return localStorage.getItem('liceo_admin_token');
}

function getAuthHeader() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Función central para hacer peticiones al API.
 * Incluye automáticamente el JWT si está disponible.
 */
export async function apiRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            ...options.headers,
        },
        cache: 'no-cache',
        ...options,
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
        // Token expirado o inválido — limpiar sesión
        localStorage.removeItem('liceo_admin_token');
        localStorage.removeItem('liceo_admin_user');
        window.dispatchEvent(new Event('auth:expired'));
    }

    if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
            const errData = await response.json();
            errorMessage = errData.error || errorMessage;
        } catch { /* ignore */ }
        throw new Error(errorMessage);
    }

    // 204 No Content o DELETE exitoso sin body
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    return response.json();
}

/**
 * Para endpoints SSE (streaming) — devuelve el Response directamente
 */
export async function apiStream(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    return fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            ...options.headers,
        },
        ...options,
    });
}

export { getToken, getAuthHeader };
