import React from 'react';
import { Line } from 'react-chartjs-2';
import { useDashboard } from '../../../controllers/useAdminController';

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#191c23',
            padding: 12,
            cornerRadius: 8,
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { font: { size: 10 }, color: '#64748b' }
        },
        y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 10 }, color: '#64748b' }
        }
    },
    elements: {
        line: { tension: 0.4 },
        point: { radius: 4, hoverRadius: 6 }
    }
};

export default function DashboardSection() {
    const { loading, newsCount, totalQuestions, todayCount, unreadMessages, galleryCount, hasApiKey, recentNews, recentQuestions, formatDate } = useDashboard();

    const chartData = {
        labels: recentQuestions.map(d => d.label),
        datasets: [{
            label: 'Consultas',
            data: recentQuestions.map(d => d.count),
            borderColor: '#0b92d5',
            backgroundColor: 'rgba(11, 146, 213, 0.1)',
            fill: true,
            borderWidth: 3,
            pointBackgroundColor: '#0b92d5',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
        }]
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 bg-surface-container-low rounded-3xl animate-pulse">
            <p className="text-primary font-bold">Cargando métricas...</p>
        </div>
    );

    const stats = [
        { icon: 'newspaper', val: newsCount, label: 'Noticias', color: 'text-white', bg: 'bg-primary' },
        { icon: 'smart_toy', val: totalQuestions, label: 'Preguntas IA', color: 'text-white', bg: 'bg-tertiary' },
        { icon: 'event', val: todayCount, label: 'Actividad Hoy', color: 'text-white', bg: 'bg-secondary' },
        { icon: 'mail', val: unreadMessages, label: 'Mensajes', color: 'text-white', bg: 'bg-error' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group border border-outline-variant/5">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                <span className={`material-symbols-outlined text-3xl ${s.color}`} style={{fontVariationSettings: "'FILL' 1"}}>{s.icon}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mb-0.5">{s.label}</p>
                                <p className="text-3xl font-black text-on-surface leading-tight font-headline">{s.val}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/5 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-black text-on-surface font-headline mb-1">Estado de la Plataforma</h3>
                                <p className="text-sm text-on-surface-variant font-medium">Resumen operativo institucional</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Sistema Estable</span>
                        </div>
                        
                        <div className="h-64">
                            {recentQuestions.length > 0 ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant/30">
                                    <span className="material-symbols-outlined text-5xl">bar_chart</span>
                                    <div className="text-center">
                                        <p className="font-black text-sm uppercase tracking-widest">Actividad semanal</p>
                                        <p className="text-xs mt-1">Sin actividad registrada aún</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {recentQuestions.length > 0 && (
                            <div className="mt-4 flex justify-between text-xs text-on-surface-variant">
                                <span>Total semanal: {recentQuestions.reduce((a, b) => a + b.count, 0)} consultas</span>
                                <span>Promedio: {Math.round(recentQuestions.reduce((a, b) => a + b.count, 0) / recentQuestions.length) || 0}/día</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-surface-container-lowest/20 rounded-2xl backdrop-blur-md">
                                    <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                                </div>
                                <h3 className="font-black font-headline text-white">Coll-Bot IA</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-4xl font-black font-headline">{totalQuestions.toLocaleString()}</p>
                                    <p className="text-xs opacity-80 font-bold uppercase tracking-widest">Consultas Totales</p>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-[11px] font-bold mb-2">
                                        <span>CONSULTAS HOY</span>
                                        <span>{todayCount}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span>ESTADO IA</span>
                                        <span className={hasApiKey ? 'text-green-300' : 'text-amber-300'}>{hasApiKey ? 'Activa' : 'Sin API Key'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-surface-container-lowest/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    </div>

                    <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/5">
                        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-6 opacity-60">Infraestructura</h3>
                        <div className="space-y-5">
                            {[
                                { name: 'Portal Web', online: true },
                                { name: 'Chatbot IA', online: hasApiKey },
                                { name: 'Galería', online: galleryCount > 0 },
                            ].map((sys, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-on-surface">{sys.name}</span>
                                    <div className={`w-2.5 h-2.5 rounded-full ${sys.online ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {recentNews.length > 0 && (
                <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant/5 overflow-hidden">
                    <div className="p-8 border-b border-surface-container-low flex justify-between items-center bg-surface/30">
                        <h3 className="text-lg font-black font-headline text-on-surface">Noticias Recientes</h3>
                        <button className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:underline">
                            Ver todas <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-low/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Título</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Categoría</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Estado</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low">
                                {recentNews.map(n => (
                                    <tr key={n.id} className="hover:bg-surface-container-low transition-colors group">
                                        <td className="px-8 py-5 text-sm font-bold text-on-surface">{n.titulo}</td>
                                         <td className="px-8 py-5">
                                            <span className="text-[10px] font-black text-on-primary-container px-3 py-1 bg-primary-container rounded-full uppercase tracking-tighter shadow-sm border border-white/5">
                                                {n.categoria}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${n.status === 'published' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                                <span className="text-xs font-bold text-on-surface-variant">
                                                    {n.status === 'published' ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-bold text-on-surface-variant/60">{formatDate(n.fecha)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
