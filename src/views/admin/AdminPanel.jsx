import React from 'react';
import { useAdmin } from '../../controllers/useAdminController';

// Layout Components
import AdminLayout from './layout/AdminLayout';
import AdminLogin from './layout/AdminLogin';

// Section Components
import DashboardSection from './sections/DashboardSection';
import NewsSection from './sections/NewsSection';
import AnalyticsSection from './sections/AnalyticsSection';
import AiSection from './sections/AiSection';
import ContactSection from './sections/ContactSection';
import GallerySection from './sections/GallerySection';
import UsersSection from './sections/UsersSection';
import ConversationsSection from './sections/ConversationsSection';
import SettingsSection from './sections/SettingsSection';
import SecuritySection from './sections/SecuritySection';
import StatsSection from './sections/StatsSection';
import ActivitySection from './sections/ActivitySection';
import EventsSection from './EventsSection';

import './Admin.css'; // Keep existing for any global overrides if needed, though Tailwind covers most

export default function AdminPanel() {
    const admin = useAdmin();
    const { 
        section, setSection, sidebarOpen, setSidebarOpen, isLoggedIn, authChecked,
        loginUsername, setLoginUsername, loginPass, setLoginPass, loginLoading, loginError,
        login, logout, toast, showToast, currentUser 
    } = admin;

    // Show loading while checking auth
    if (!authChecked) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Login Guard
    if (!isLoggedIn) {
        return (
            <AdminLogin 
                loginUsername={loginUsername}
                setLoginUsername={setLoginUsername}
                loginPass={loginPass}
                setLoginPass={setLoginPass}
                login={login}
                loginLoading={loginLoading}
                loginError={loginError}
            />
        );
    }

    // Section Router
    const userRole = currentUser?.role || 'admin';
    const adminOnlySections = ['usuarios', 'config', 'seguridad', 'ai', 'actividad'];
    
    const renderSection = () => {
        // Redirect editor to dashboard if trying to access admin-only sections
        if (userRole !== 'admin' && adminOnlySections.includes(section)) {
            return <DashboardSection />;
        }
        
        switch (section) {
            case 'dashboard': return <DashboardSection />;
            case 'noticias': return <NewsSection showToast={showToast} />;
            case 'analytics': return <AnalyticsSection />;
            case 'ai': return <AiSection showToast={showToast} />;
            case 'contactos': return <ContactSection showToast={showToast} />;
            case 'galeria': return <GallerySection showToast={showToast} />;
            case 'usuarios': return <UsersSection showToast={showToast} />;
            case 'historial': return <ConversationsSection />;
            case 'config': return <SettingsSection showToast={showToast} />;
            case 'seguridad': return <SecuritySection showToast={showToast} />;
            case 'estadisticas': return <StatsSection />;
            case 'actividad': return <ActivitySection />;
            case 'eventos': return <EventsSection />;
            default: return <DashboardSection />;
        }
    };

    return (
        <AdminLayout
            section={section}
            setSection={setSection}
            currentUser={currentUser}
            logout={logout}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            toast={toast}
            userRole={currentUser?.role || 'admin'}
        >
            {renderSection()}
        </AdminLayout>
    );
}
