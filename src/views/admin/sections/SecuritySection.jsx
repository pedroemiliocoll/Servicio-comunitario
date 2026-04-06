import React from 'react';
import { useChangePassword } from '../../../controllers/useAdminController';

export default function SecuritySection({ showToast }) {
    const s = useChangePassword(showToast);

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-full max-w-lg bg-surface-container-lowest p-12 rounded-[3rem] shadow-2xl border border-outline-variant/10 relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-error/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

                <div className="text-center mb-10 relative">
                    <div className="w-20 h-20 bg-error-container/20 text-error rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-error-container/5">
                        <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>security</span>
                    </div>
                    <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">Acceso Privado</h3>
                    <p className="text-on-surface-variant font-medium text-sm">Cambiar contraseña de administrador</p>
                </div>

                <div className="space-y-6 relative">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-4 opacity-60">Contraseña Actual</label>
                        <input className="w-full bg-surface-container-low border-none rounded-2xl px-8 py-5 focus:ring-2 focus:ring-error/20 text-sm font-bold shadow-inner" type="password" value={s.currentPass} onChange={e => s.setCurrentPass(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-4 opacity-60">Nueva Contraseña</label>
                        <input className="w-full bg-surface-container-low border-none rounded-2xl px-8 py-5 focus:ring-2 focus:ring-primary/20 text-sm font-bold shadow-inner" type="password" value={s.newPass} onChange={e => s.setNewPass(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-4 opacity-60">Confirmar Nueva Contraseña</label>
                        <input className="w-full bg-surface-container-low border-none rounded-2xl px-8 py-5 focus:ring-2 focus:ring-primary/20 text-sm font-bold shadow-inner" type="password" value={s.confirmPass} onChange={e => s.setConfirmPass(e.target.value)} />
                    </div>
                    
                    <button 
                        className="w-full bg-error text-on-error py-5 rounded-2xl font-headline font-black text-sm shadow-xl shadow-error/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 disabled:opacity-50" 
                        onClick={s.save} 
                        disabled={s.loading}
                    >
                        {s.loading ? 'Validando Seguridad...' : 'Confirmar Cambio de Llave'}
                    </button>
                    
                    <div className="bg-surface-container-low p-4 rounded-xl flex items-start gap-3 mt-8 border border-outline-variant/20">
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">info</span>
                        <p className="text-[10px] text-on-surface-variant font-medium leading-tight">
                            Se recomienda el uso de caracteres especiales, mayúsculas y números para una protección institucional óptima.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
