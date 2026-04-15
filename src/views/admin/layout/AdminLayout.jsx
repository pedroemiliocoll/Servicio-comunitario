import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import { useTheme } from '../../../context/ThemeContext';

const SECTION_LABELS = {
    dashboard: 'Panel Principal',
    estadisticas: 'Estadísticas',
    analytics: 'Analíticas',
    noticias: 'Noticias',
    galeria: 'Galería',
    eventos: 'Eventos',
    contactos: 'Mensajes',
    historial: 'Historial',
    usuarios: 'Usuarios',
    config: 'Configuración',
    seguridad: 'Seguridad',
    ai: 'Chatbot IA',
    actividad: 'Actividad',
};

export default function AdminLayout({
    children,
    section,
    setSection,
    currentUser,
    logout,
    sidebarOpen,
    setSidebarOpen,
    toast,
    userRole = 'admin'
}) {
    const currentLabel = SECTION_LABELS[section] || 'Admin';
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen bg-surface-container-low font-body selection:bg-primary/20">
            <AdminSidebar
                section={section}
                setSection={setSection}
                currentUser={currentUser}
                logout={logout}
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                userRole={userRole}
            />

            {/* Main content — offset by sidebar width on desktop */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
                <AdminTopBar
                    sectionName={currentLabel}
                    userName={currentUser?.username}
                    toggleSidebar={() => setSidebarOpen(s => !s)}
                    onContactClick={() => setSection('contactos')}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />

                <main className="flex-1 p-4 lg:p-8 animate-in fade-in duration-700" id="main-content">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>

                {/* Toast Notification */}
                {toast && (
                    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 max-w-[calc(100vw-3rem)] ${toast.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'}`}>
                        <span className="material-symbols-outlined text-[20px] shrink-0">
                            {toast.type === 'error' ? 'report' : 'check_circle'}
                        </span>
                        <span className="text-sm font-bold tracking-tight">{toast.msg}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

