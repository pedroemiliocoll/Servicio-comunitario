// src/services/uploadService.js — File upload helper
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getToken() {
    return sessionStorage.getItem('liceo_admin_token');
}

/**
 * Upload a single File object, return { url, filename, size }
 */
export async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        credentials: 'include',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
    }
    return res.json();
}

/**
 * Upload multiple files, return { results, errors }
 */
export async function uploadMultipleFiles(files) {
    const results = [];
    const errors = [];

    for (const file of files) {
        try {
            const result = await uploadFile(file);
            results.push(result);
        } catch (error) {
            errors.push({ file: file.name, error: error.message });
        }
    }

    return { results, errors };
}

export default { uploadFile, uploadMultipleFiles };
