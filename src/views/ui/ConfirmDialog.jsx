import React, { useEffect, useRef } from 'react';

export default function ConfirmDialog({ open, onConfirm, onCancel, title, message, confirmText = 'Eliminar', danger = true }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onCancel]);

    useEffect(() => {
        if (open) dialogRef.current?.focus();
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div 
                ref={dialogRef}
                tabIndex={-1}
                className="relative bg-surface-container-lowest w-full max-w-md rounded-[2rem] shadow-2xl border border-outline-variant/10 animate-in zoom-in-95 fade-in duration-300 outline-none"
            >
                <div className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${danger ? 'bg-error-container/20 text-error' : 'bg-[#005bbf] text-white'}`}>
                        <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>
                            {danger ? 'warning' : 'help'}
                        </span>
                    </div>
                    <h3 className="text-xl font-black font-headline text-on-surface mb-2">{title}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{message}</p>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-4 rounded-2xl font-headline font-bold text-sm text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-all active:scale-95"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-4 rounded-2xl font-headline font-black text-sm text-white shadow-xl transition-all active:scale-95 hover:scale-[1.02] ${
                            danger 
                                ? 'bg-error shadow-error/20' 
                                : 'bg-[#005bbf] shadow-primary/20'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
