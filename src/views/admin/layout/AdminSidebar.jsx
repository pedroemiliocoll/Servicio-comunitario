import React from 'react';
import { Link } from 'react-router-dom';

const MENU_GROUPS = [
    {
        title: '📊 MÉTRICAS',
        items: [
            { id: 'dashboard', icon: 'analytics', label: 'Panel Principal' },
            { id: 'estadisticas', icon: 'bar_chart', label: 'Estadísticas del Portal' },
            { id: 'analytics', icon: 'insights', label: 'Analíticas del Chatbot' },
        ]
    },
    {
        title: '📰 CONTENIDO',
        items: [
            { id: 'noticias', icon: 'newspaper', label: 'Gestión de Noticias' },
            { id: 'galeria', icon: 'photo_library', label: 'Galería' },
            { id: 'eventos', icon: 'event', label: 'Eventos' },
        ]
    },
    {
        title: '💬 COMUNICACIÓN',
        items: [
            { id: 'contactos', icon: 'mail', label: 'Mensajes' },
            { id: 'historial', icon: 'chat_paste_go', label: 'Historial de Chats' },
        ]
    },
    {
        title: '⚙️ CONFIGURACIÓN',
        items: [
            { id: 'usuarios', icon: 'group', label: 'Usuarios', adminOnly: true },
            { id: 'config', icon: 'settings', label: 'Configuración General', adminOnly: true },
            { id: 'seguridad', icon: 'lock', label: 'Seguridad', adminOnly: true },
        ]
    },
    {
        title: '🤖 SISTEMA',
        items: [
            { id: 'ai', icon: 'smart_toy', label: 'Chatbot IA', adminOnly: true },
            { id: 'actividad', icon: 'history', label: 'Registro de Actividad', adminOnly: true },
        ]
    },
];

const ROLE_LABELS = {
    admin: 'Administrador',
    editor: 'Editor'
};

function filterMenuByRole(groups, userRole) {
    if (userRole === 'admin') return groups;
    return groups.map(group => ({
        ...group,
        items: group.items.filter(item => !item.adminOnly)
    }));
}

export default function AdminSidebar({ section, setSection, currentUser, logout, open, setOpen, unread = 0, userRole = 'admin' }) {
    const filteredGroups = filterMenuByRole(MENU_GROUPS, userRole);
    const roleLabel = ROLE_LABELS[userRole] || 'Administrador';
    
    return (
        <aside className={`fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r border-outline-variant/10 flex flex-col p-4 z-[100] transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="px-4 py-8 mb-4">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>school</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-on-surface leading-tight font-headline">Panel Académico</h1>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-70">Control Central</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {filteredGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        <h3 className="px-4 mb-2 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em] opacity-60">
                            {group.title}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setSection(item.id); setOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-bold text-sm transition-all group ${
                                        section === item.id 
                                            ? 'bg-[#005bbf] text-white shadow-lg shadow-primary/20 translate-x-1' 
                                            : 'text-on-surface hover:bg-surface-container-high hover:text-primary active:scale-95'
                                    }`}
                                >
                                    <span className={`material-symbols-outlined text-[22px] transition-colors ${section === item.id ? 'text-on-primary' : 'text-on-surface-variant group-hover:text-primary'}`} style={{fontVariationSettings: section === item.id ? "'FILL' 1" : "'FILL' 0"}}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                    {item.id === 'contactos' && unread > 0 && (
                                        <span className="ml-auto w-5 h-5 bg-error text-on-error text-[10px] flex items-center justify-center rounded-full">
                                            {unread}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="pt-6 mt-auto border-t border-outline-variant/30">
                {currentUser && (
                    <div className="bg-surface-container-high rounded-2xl p-4 mb-4 flex items-center gap-3 border border-white/5 shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-[#005bbf] flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 border border-white/10">
                            {currentUser.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-on-surface truncate">{currentUser.username}</p>
                            <p className="text-[10px] text-on-surface font-black uppercase tracking-[0.2em] opacity-80">{roleLabel}</p>
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                    <a href="/" target="_blank" className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high text-xs font-bold transition-all border border-transparent active:scale-95">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        <span>Sitio</span>
                    </a>
                    <button onClick={logout} className="flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-error hover:bg-error-container/20 text-xs font-bold transition-all border border-transparent active:scale-95">
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <span>Cerrar</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
