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
        <header className="sticky top-0 z-[50] bg-surface/80 backdrop-blur-xl px-4 md:px-8 h-16 md:h-20 flex items-center justify-between border-b border-outline-variant/5">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <button 
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors flex-shrink-0"
                    aria-label="Abrir barra lateral"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                
                <div className="overflow-hidden">
                    <nav className="flex text-[10px] font-bold text-on-surface-variant/40 gap-1 uppercase tracking-[0.2em] mb-0.5 whitespace-nowrap">
                        <span className="hidden xs:inline">Admin</span>
                        <span className="hidden xs:inline">/</span>
                        <span className="text-primary truncate">{sectionName}</span>
                    </nav>
                    <h2 className="text-lg md:text-2xl font-black tracking-tight text-on-surface font-headline truncate">{sectionName}</h2>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                {/* Theme Toggle */}
                {toggleTheme && (
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl hover:bg-surface-container-high transition-all duration-300 cursor-pointer group"
                        aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    >
                        <span className="material-symbols-outlined text-[20px] md:text-2xl text-on-surface-variant group-hover:text-primary transition-colors" style={{fontVariationSettings: "'FILL' 1"}}>
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
                        <span className="material-symbols-outlined text-[22px] md:text-2xl">mail</span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-error text-white text-[9px] font-black min-w-[17px] h-[17px] rounded-full flex items-center justify-center animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                )}
                
                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/10">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                    <span className="text-xs font-bold text-on-surface-variant whitespace-nowrap uppercase tracking-wider">Sistema Online</span>
                </div>
                
                <div className="flex items-center gap-2 ml-1 md:ml-0">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-xs font-black text-on-surface leading-none">{userName}</span>
                        <span className="text-[10px] text-on-surface-variant font-bold opacity-60">ADMIN</span>
                    </div>
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-black shadow-lg shadow-primary/20 border border-white/10 text-sm md:text-base">
                        {userName?.substring(0, 1).toUpperCase() || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
}
