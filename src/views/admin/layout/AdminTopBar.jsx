import React, { useState, useEffect } from 'react';
import { contactService } from '../../../services/contactService';

export default function AdminTopBar({ sectionName, userName, toggleSidebar, onContactClick, theme, toggleTheme }) {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const data = await contactService.getUnreadCount();
                setUnreadCount(data.unread || 0);
            } catch (err) {
                console.error('Error fetching unread:', err);
            }
        };

        fetchUnread();
        
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-[50] bg-surface/80 backdrop-blur-md px-8 h-20 flex items-center justify-between border-b border-outline-variant/5">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                
                <div>
                    <nav className="flex text-[10px] font-bold text-on-surface-variant/60 gap-1 uppercase tracking-[0.2em] mb-0.5">
                        <span>Admin</span>
                        <span>/</span>
                        <span className="text-primary">{sectionName}</span>
                    </nav>
                    <h2 className="text-2xl font-black tracking-tight text-on-surface font-headline">{sectionName}</h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                {toggleTheme && (
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-container-high transition-all duration-300 cursor-pointer group"
                        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    >
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" style={{fontVariationSettings: "'FILL' 1"}}>
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>
                )}

                {/* Notifications Badge */}
                {onContactClick && (
                    <button 
                        onClick={onContactClick}
                        className="relative p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors"
                        title="Ver mensajes de contacto"
                    >
                        <span className="material-symbols-outlined">mail</span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                )}
                
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/10">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                    <span className="text-xs font-bold text-on-surface-variant whitespace-nowrap">SISTEMA EN LINEA</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <span className="hidden md:block text-sm font-bold text-on-surface">Hola, {userName}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#005bbf] flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 border border-white/10">
                        {userName?.substring(0, 1).toUpperCase() || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
}
