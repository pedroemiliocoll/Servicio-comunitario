import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [validating, setValidating] = useState(true);

    useEffect(() => {
        if (!token) {
            setError('Token de recuperación inválido');
            setValidating(false);
        } else {
            setValidating(false);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const result = await authService.resetPassword(token, newPassword);
            setMessage(result.message);
            setTimeout(() => {
                navigate('/admin');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Error al restablecer la contraseña');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-6">
                <div className="w-full max-w-md text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-on-surface-variant">Validando token...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-surface-container-low rounded-3xl p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>
                                password
                            </span>
                        </div>
                        <h1 className="text-2xl font-black font-headline text-on-surface">
                            Nueva Contraseña
                        </h1>
                        <p className="text-on-surface-variant mt-2 text-sm">
                            Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta.
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-600">check_circle</span>
                                <p className="text-green-800 text-sm">{message}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-red-600">error</span>
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-on-surface mb-2">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-surface-container-high border border-outline/20 rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                placeholder="Mínimo 6 caracteres"
                                required
                                disabled={loading || !!message}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-on-surface mb-2">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-surface-container-high border border-outline/20 rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                placeholder="Repite tu contraseña"
                                required
                                disabled={loading || !!message}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !!message}
                            className="w-full py-3 bg-[#005bbf] text-white font-headline font-bold rounded-xl hover:bg-[#004a9e] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">check</span>
                                    Restablecer Contraseña
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/admin"
                            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}