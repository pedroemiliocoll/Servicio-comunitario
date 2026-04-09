import React, { useState, useEffect, useCallback } from 'react';

const StatCard = ({ icon, label, value, sub, color, iconColor }) => (
    <div className="bg-surface-container-lowest p-5 rounded-2xl hover:scale-[1.02] transition-transform border border-outline-variant/10 hover:border-primary/20">
        <div className="flex items-start justify-between mb-3">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-2xl ${iconColor}`} style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
            </div>
        </div>
        <p className="text-3xl font-black text-on-surface">{value}</p>
        <p className="text-sm font-bold text-on-surface-variant">{label}</p>
        {sub && <p className="text-xs text-on-surface-variant/70 mt-1">{sub}</p>}
    </div>
);

const MiniStat = ({ icon, label, value, iconColor, sub }) => (
    <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
        <span className={`material-symbols-outlined ${iconColor}`} style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
        <div className="flex-1">
            <div className="flex items-baseline gap-2">
                <p className="text-xl font-black text-on-surface">{value}</p>
                {sub && <span className="text-xs text-on-surface-variant">{sub}</span>}
            </div>
            <p className="text-xs text-on-surface-variant">{label}</p>
        </div>
    </div>
);

const BarChart = ({ data, title }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
            <h4 className="font-black text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>bar_chart</span>
                {title}
            </h4>
            <div className="space-y-3">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-on-surface-variant w-24 truncate">{item.label}</span>
                        <div className="flex-1 h-6 bg-surface-container rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                style={{ width: `${(item.value / max) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant w-8 text-right">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PieChart = ({ data, title }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const colors = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-green-500', 'bg-amber-500', 'bg-red-500'];
    const strokeColors = ['#0b92d5', '#7c3aed', '#0891b2', '#22c55e', '#f59e0b', '#ef4444'];
    let cumulative = 0;
    
    return (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
            <h4 className="font-black text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>pie_chart</span>
                {title}
            </h4>
            <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                        {data.map((item, i) => {
                            const percent = total > 0 ? (item.value / total) * 100 : 0;
                            const dash = (percent * 0.2827).toFixed(3);
                            const dashArray = `${dash} ${(100 - percent * 0.2827).toFixed(3)}`;
                            const offset = (cumulative * 0.2827).toFixed(3);
                            cumulative += percent;
                            return (
                                <circle
                                    key={i}
                                    cx="18" cy="18" r="15.9155"
                                    fill="transparent"
                                    stroke={strokeColors[i % 6]}
                                    strokeWidth="4"
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={-offset}
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-black text-on-surface">{total}</span>
                    </div>
                </div>
                <div className="space-y-2 flex-1">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                            <span className="text-xs font-medium text-on-surface-variant flex-1">{item.label}</span>
                            <span className="text-xs font-bold text-on-surface">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function StatsSection() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadStats = useCallback(async () => {
        try {
            const token = localStorage.getItem('liceo_admin_token');
            const res = await fetch('/api/analytics/portal', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            } else if (res.status === 401) {
                window.dispatchEvent(new Event('auth:expired'));
            }
        } catch (err) {
            console.error('Error loading stats:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, [loadStats]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadStats();
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96 bg-surface-container-low rounded-3xl animate-pulse">
            <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-primary animate-pulse">analytics</span>
                <p className="text-primary font-bold tracking-widest uppercase mt-4">Cargando Estadisticas...</p>
            </div>
        </div>
    );

    const data = stats || {
        news: 0, gallery: 0, events: 0, users: 0,
        contact_messages: 0, unread_messages: 0, published_news: 0, draft_news: 0,
        upcoming_events: 0, past_events: 0, active_images: 0,
        last_message_date: null, last_news_date: null,
        new_users_this_month: 0, recent_activity: 0,
        chatbot: { total_conversations: 0, today_conversations: 0 },
        gallery_by_category: [], users_by_role: []
    };

    const categoryData = data.gallery_by_category?.map((c, i) => ({
        label: c.categoria || 'Sin categoria',
        value: c.count,
        color: ['bg-primary/20', 'bg-secondary/20', 'bg-tertiary/20', 'bg-green-500/20', 'bg-amber-500/20'][i % 5]
    })) || [];

    const usersData = data.users_by_role?.map((u, i) => ({
        label: u.role === 'admin' ? 'Administradores' : u.role === 'editor' ? 'Editores' : 'Usuarios',
        value: u.count,
        color: ['bg-red-500/20', 'bg-blue-500/20', 'bg-green-500/20'][i % 3]
    })) || [];

    const newsData = [
        { label: 'Publicadas', value: data.published_news || 0, color: 'bg-green-500' },
        { label: 'Borradores', value: data.draft_news || 0, color: 'bg-amber-500' }
    ];

    const eventData = [
        { label: 'Proximos', value: data.upcoming_events || 0, color: 'bg-primary' },
        { label: 'Pasados', value: data.past_events || 0, color: 'bg-gray-400' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl text-white" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">Estadisticas del Portal</h3>
                            <p className="text-on-surface-variant text-sm font-medium">Resumen integral de la plataforma academica</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-on-surface-variant bg-surface-container px-4 py-2 rounded-full font-medium border border-outline-variant/20">
                            <span className="material-symbols-outlined text-sm align-text-bottom mr-1" style={{fontVariationSettings: "'FILL' 1"}}>schedule</span>
                            {new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button 
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
                        >
                            <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
                            {refreshing ? 'Actualizando...' : 'Actualizar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard icon="newspaper" label="Noticias" value={data.news} sub={`${data.published_news ?? '?'} pub / ${data.draft_news ?? '?'} bor`} color="bg-primary/10" iconColor="text-primary" />
                <StatCard icon="photo_library" label="Galeria" value={data.gallery} sub={`${data.active_images ?? '?'} activas`} color="bg-secondary-container" iconColor="text-secondary" />
                <StatCard icon="mail" label="Mensajes" value={data.contact_messages ?? 0} sub={`${data.unread_messages ?? '?'} sin leer`} color="bg-red-500/10" iconColor="text-red-500" />
                <StatCard icon="event" label="Eventos" value={data.events} sub={`${data.upcoming_events ?? '?'} proximos`} color="bg-green-500/10" iconColor="text-green-500" />
                <StatCard icon="group" label="Usuarios" value={data.users} sub={`${data.new_users_this_month ?? '?'} este mes`} color="bg-cyan-500/10" iconColor="text-cyan-500" />
            </div>

            {/* Stats Cards - Segunda fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Chatbot */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                        </div>
                        <h4 className="font-black text-on-surface">Chatbot IA</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-surface-container rounded-xl">
                            <p className="text-3xl font-black text-primary">{data.chatbot?.total_conversations || 0}</p>
                            <p className="text-xs text-on-surface-variant">Total conversaciones</p>
                        </div>
                        <div className="text-center p-4 bg-surface-container rounded-xl">
                            <p className="text-3xl font-black text-green-500">{data.chatbot?.today_conversations || 0}</p>
                            <p className="text-xs text-on-surface-variant">Hoy</p>
                        </div>
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500" style={{fontVariationSettings: "'FILL' 1"}}>trending_up</span>
                        </div>
                        <h4 className="font-black text-on-surface">Actividad Reciente</h4>
                    </div>
                    <div className="space-y-3">
                        <MiniStat icon="schedule" label="Ultimas 24 horas" value={data.recent_activity ?? 0} iconColor="text-amber-500" />
                        <MiniStat icon="calendar_month" label="Este mes" value={data.new_users_this_month ?? 0} iconColor="text-primary" sub="usuarios nuevos" />
                    </div>
                </div>

                {/* Ultima Actividad */}
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-amber-500" style={{fontVariationSettings: "'FILL' 1"}}>update</span>
                        </div>
                        <h4 className="font-black text-on-surface">Ultima Actividad</h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
                            <span className="material-symbols-outlined text-primary text-xl">newspaper</span>
                            <div>
                                <p className="text-xs text-on-surface-variant">Ultima noticia</p>
                                <p className="text-sm font-bold text-on-surface">{data.last_news_date ? new Date(data.last_news_date).toLocaleDateString('es-VE') : 'Sin noticias'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
                            <span className="material-symbols-outlined text-red-500 text-xl">mail</span>
                            <div>
                                <p className="text-xs text-on-surface-variant">Ultimo mensaje</p>
                                <p className="text-sm font-bold text-on-surface">{data.last_message_date ? new Date(data.last_message_date).toLocaleDateString('es-VE') : 'Sin mensajes'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.length > 0 && newsData.some(d => d.value > 0) && <BarChart data={newsData.filter(d => d.value > 0)} title="Estado de Noticias" />}
                {eventData.length > 0 && eventData.some(d => d.value > 0) && <BarChart data={eventData.filter(d => d.value > 0)} title="Eventos" />}
                {usersData.length > 0 && usersData.some(d => d.value > 0) && <PieChart data={usersData.filter(d => d.value > 0)} title="Usuarios por Rol" />}
            </div>

            {/* Galeria por categoria */}
            {categoryData.length > 0 && categoryData.some(d => d.value > 0) && (
                <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                    <h4 className="font-black text-on-surface mb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>photo_library</span>
                        Galeria por Categoria
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categoryData.filter(d => d.value > 0).map((cat, i) => (
                            <div key={i} className="text-center p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
                                <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${['bg-primary/10', 'bg-secondary/10', 'bg-tertiary/10', 'bg-green-500/10', 'bg-amber-500/10'][i % 5]}`}>
                                    <span className={`material-symbols-outlined ${['text-primary', 'text-secondary', 'text-cyan-500', 'text-green-500', 'text-amber-500'][i % 5]}`} style={{fontVariationSettings: "'FILL' 1"}}>folder</span>
                                </div>
                                <p className="text-2xl font-black text-on-surface">{cat.value}</p>
                                <p className="text-xs text-on-surface-variant truncate">{cat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Resumen Ejecutivo */}
            <div className="bg-primary p-8 rounded-3xl text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>insights</span>
                        </div>
                        <div>
                            <h4 className="text-xl font-black">Resumen Ejecutivo</h4>
                            <p className="text-white/80 text-sm mt-1">
                                El portal cuenta con <span className="font-bold">{data.news}</span> noticias ({data.publishedNews} publicadas), 
                                <span className="font-bold"> {data.gallery}</span> imagenes en la galeria, 
                                <span className="font-bold"> {data.events}</span> eventos y 
                                <span className="font-bold"> {data.users}</span> usuarios registrados.
                            </p>
                        </div>
                    </div>
                    <div className="text-center bg-white/10 px-8 py-4 rounded-2xl">
                        <p className="text-4xl font-black">{data.unread_messages ?? 0}</p>
                        <p className="text-xs text-white/70 uppercase tracking-widest mt-1">mensajes sin leer</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-on-surface-variant/70 bg-surface-container py-3 rounded-xl">
                <span className="material-symbols-outlined text-sm align-text-bottom mr-1" style={{fontVariationSettings: "'FILL' 1"}}>sync</span>
                Los datos se actualizan automaticamente cada 30 segundos
            </div>
        </div>
    );
}