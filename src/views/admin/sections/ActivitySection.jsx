import React, { useState, useEffect } from 'react';
import { activityService } from '../../../services/activityService';

const actionIcons = {
    'LOGIN': { icon: 'login', color: 'text-green-500', bg: 'bg-green-100' },
    'LOGOUT': { icon: 'logout', color: 'text-orange-500', bg: 'bg-orange-100' },
    'NEWS_CREATE': { icon: 'post_add', color: 'text-blue-500', bg: 'bg-blue-100' },
    'NEWS_UPDATE': { icon: 'edit', color: 'text-amber-500', bg: 'bg-amber-100' },
    'NEWS_DELETE': { icon: 'delete', color: 'text-red-500', bg: 'bg-red-100' },
    'EVENT_CREATE': { icon: 'event_available', color: 'text-purple-500', bg: 'bg-purple-100' },
    'EVENT_UPDATE': { icon: 'edit_note', color: 'text-amber-500', bg: 'bg-amber-100' },
    'EVENT_DELETE': { icon: 'event_busy', color: 'text-red-500', bg: 'bg-red-100' },
    'USER_CREATE': { icon: 'person_add', color: 'text-indigo-500', bg: 'bg-indigo-100' },
    'USER_UPDATE': { icon: 'person', color: 'text-amber-500', bg: 'bg-amber-100' },
    'USER_DELETE': { icon: 'person_remove', color: 'text-red-500', bg: 'bg-red-100' },
    'GALERY_UPLOAD': { icon: 'add_photo_alternate', color: 'text-pink-500', bg: 'bg-pink-100' },
    'GALERY_DELETE': { icon: 'photo_library', color: 'text-red-500', bg: 'bg-red-100' },
    'MESSAGE_SEND': { icon: 'send', color: 'text-cyan-500', bg: 'bg-cyan-100' },
    'API_KEY_UPDATE': { icon: 'key', color: 'text-violet-500', bg: 'bg-violet-100' },
    'COMUNICADO_UPDATE': { icon: 'campaign', color: 'text-red-500', bg: 'bg-red-100' },
    'DEFAULT': { icon: 'info', color: 'text-gray-500', bg: 'bg-gray-100' },
};

function getActionMeta(action) {
    return actionIcons[action] || actionIcons['DEFAULT'];
}

export default function ActivitySection() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');

    const loadActivities = () => {
        activityService.getLog(100)
            .then(setActivities)
            .catch(console.error)
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        loadActivities();
        const interval = setInterval(loadActivities, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadActivities();
    };

    const filteredActivities = activities.filter(a => {
        if (filter === 'all') return true;
        return a.action?.startsWith(filter);
    });

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Hace un momento';
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} h`;
        return date.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const getActionLabel = (action) => {
        const labels = {
            'LOGIN': 'Inicio de sesión',
            'LOGOUT': 'Cierre de sesión',
            'NEWS_CREATE': 'Noticia creada',
            'NEWS_UPDATE': 'Noticia actualizada',
            'NEWS_DELETE': 'Noticia eliminada',
            'EVENT_CREATE': 'Evento creado',
            'EVENT_UPDATE': 'Evento actualizado',
            'EVENT_DELETE': 'Evento eliminado',
            'USER_CREATE': 'Usuario creado',
            'USER_UPDATE': 'Usuario actualizado',
            'USER_DELETE': 'Usuario eliminado',
            'GALERY_UPLOAD': 'Imagen subida',
            'GALERY_DELETE': 'Imagen eliminada',
            'MESSAGE_SEND': 'Mensaje enviado',
            'API_KEY_UPDATE': 'API Key actualizada',
            'COMUNICADO_UPDATE': 'Comunicado actualizado',
        };
        return labels[action] || action;
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 bg-surface-container-low rounded-3xl animate-pulse">
            <p className="text-primary font-bold tracking-widest uppercase">Cargando actividad...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">Registro de Actividad</h3>
                    <p className="text-on-surface-variant text-sm font-medium">Historial de acciones en el sistema</p>
                </div>
                <div className="flex gap-2">
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-surface-container rounded-xl text-sm font-bold"
                    >
                        <option value="all">Todas las acciones</option>
                        <option value="NEWS">Noticias</option>
                        <option value="EVENT">Eventos</option>
                        <option value="USER">Usuarios</option>
                        <option value="LOGIN">Sesiones</option>
                    </select>
                    <button 
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 disabled:opacity-50"
                    >
                        <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
                    </button>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-container-low/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest">Acción</th>
                                <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest">Detalle</th>
                                <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest text-right">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {filteredActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-16 text-center text-on-surface-variant/30 italic font-bold">
                                        No hay actividad registrada
                                    </td>
                                </tr>
                            ) : filteredActivities.map((activity, i) => {
                                const meta = getActionMeta(activity.action);
                                return (
                                    <tr key={i} className="hover:bg-surface-container-low transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center`}>
                                                    <span className={`material-symbols-outlined text-lg ${meta.color}`}>{meta.icon}</span>
                                                </div>
                                                <span className="text-sm font-bold text-on-surface">
                                                    {getActionLabel(activity.action)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-on-surface-variant">
                                                {activity.details}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs font-medium text-on-surface-variant">
                                                {formatTime(activity.timestamp)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-center text-xs text-on-surface-variant">
                <p>Los datos se actualizan automáticamente cada 30 segundos • Total: {filteredActivities.length} registros</p>
            </div>
        </div>
    );
}
