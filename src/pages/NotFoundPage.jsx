import React from 'react';
import { Link } from 'react-router-dom';

const quickLinks = [
    { to: '/', label: 'Inicio', icon: 'home' },
    { to: '/noticias', label: 'Noticias', icon: 'newspaper' },
    { to: '/academico', label: 'Académico', icon: 'school' },
    { to: '/contacto', label: 'Contacto', icon: 'mail' },
];

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
            <div className="text-center max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Big 404 */}
                <div className="relative mb-8">
                    <p className="text-[10rem] font-black font-headline text-primary/5 leading-none select-none">404</p>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary-fixed rounded-[2rem] flex items-center justify-center shadow-xl shadow-primary/10">
                            <span className="material-symbols-outlined text-on-primary-fixed text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>
                                explore_off
                            </span>
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-black font-headline text-on-surface mb-3 tracking-tight">
                    Página no encontrada
                </h1>
                <p className="text-on-surface-variant mb-8 leading-relaxed">
                    La página que buscas no existe o fue movida. Aquí tienes enlaces útiles:
                </p>

                {/* Quick Links */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                    {quickLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="flex flex-col items-center gap-2 p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors"
                        >
                            <span className="material-symbols-outlined text-primary text-2xl">{link.icon}</span>
                            <span className="text-sm font-semibold text-on-surface">{link.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#005bbf] text-white rounded-2xl font-headline font-black text-sm hover:bg-[#004a9e] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">home</span>
                        Ir al Inicio
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-container-high text-on-surface rounded-2xl font-headline font-bold text-sm hover:bg-surface-container-highest active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Volver Atrás
                    </button>
                </div>
            </div>
        </div>
    );
}
