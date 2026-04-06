// AuthModel.js — Model (LEGACY - mantiene compatibilidad, lógica en authService)
// Las funciones de autenticación ahora están en src/services/authService.js
// Este archivo se puede eliminar en una futura limpieza.
export const isAuthenticated = () => !!sessionStorage.getItem('liceo_admin_token');
export const logout = () => sessionStorage.removeItem('liceo_admin_token');
