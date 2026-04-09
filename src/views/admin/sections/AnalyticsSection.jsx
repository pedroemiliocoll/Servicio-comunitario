import React, { useState, useEffect, useCallback } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useAnalytics as useAnalyticsController } from '../../../controllers/useAdminController';
import { chatbotService } from '../../../services/chatbotService';

const CHART_COLORS = {
    primary: 'rgba(11, 146, 213, 0.8)',
    primaryLight: 'rgba(11, 146, 213, 0.2)',
    secondary: 'rgba(212, 168, 67, 0.8)',
    secondaryLight: 'rgba(212, 168, 67, 0.2)',
    tertiary: 'rgba(16, 185, 129, 0.8)',
    tertiaryLight: 'rgba(16, 185, 129, 0.2)',
    quaternary: 'rgba(139, 92, 246, 0.8)',
    quaternaryLight: 'rgba(139, 92, 246, 0.2)',
    error: 'rgba(239, 68, 68, 0.8)',
    grid: 'rgba(0, 0, 0, 0.05)'
};

function MetricCard({ title, value, subtitle, icon, trend, color = 'primary' }) {
    const colorClasses = {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        tertiary: 'bg-tertiary/10 text-tertiary',
        error: 'bg-error/10 text-error'
    };
    
    return (
        <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClasses[color]}`}>
                    <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-tertiary' : 'text-error'}`}>
                        <span className="material-symbols-outlined text-sm">{trend > 0 ? 'trending_up' : 'trending_down'}</span>
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-3xl font-black text-on-surface font-headline">{value}</p>
                <p className="text-sm font-bold text-on-surface-variant mt-1">{title}</p>
                {subtitle && <p className="text-xs text-on-surface-variant/60 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

function StatCard({ label, value, percentage, color }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-surface-container-low last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: color}}></div>
                <span className="text-sm font-bold text-on-surface">{label}</span>
            </div>
            <div className="text-right">
                <span className="text-sm font-black text-on-surface">{value}</span>
                {percentage !== undefined && (
                    <span className="text-xs text-on-surface-variant ml-2">({percentage}%)</span>
                )}
            </div>
        </div>
    );
}

function ActivityHeatmap({ data }) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hours = Array.from({length: 24}, (_, i) => i);
    
    const getIntensity = (day, hour) => {
        const key = `${day}-${hour}`;
        return data[key] || 0;
    };
    
    const maxValue = Math.max(...Object.values(data), 1);
    
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[600px]">
                <div className="flex gap-1 mb-2 ml-12">
                    {hours.filter((_, i) => i % 3 === 0).map(h => (
                        <div key={h} className="text-[10px] text-on-surface-variant w-8 text-center">{h}:00</div>
                    ))}
                </div>
                {days.map((day, dayIndex) => (
                    <div key={day} className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-on-surface-variant w-10 text-right">{day}</span>
                        <div className="flex gap-0.5">
                            {hours.map(hour => {
                                const value = getIntensity(dayIndex, hour);
                                const intensity = Math.min(value / maxValue, 1);
                                return (
                                    <div 
                                        key={hour}
                                        className="w-2 h-4 rounded-sm transition-colors"
                                        style={{
                                            backgroundColor: intensity > 0 
                                                ? `rgba(11, 146, 213, ${0.1 + intensity * 0.9})` 
                                                : 'rgba(0,0,0,0.03)'
                                        }}
                                        title={`${day} ${hour}:00 - ${value} mensajes`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AnalyticsSection() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ startDate: '', endDate: '', category: 'all' });
    const [summary, setSummary] = useState(null);
    const [feedbackStats, setFeedbackStats] = useState(null);
    const [hourlyData, setHourlyData] = useState({});
    
    const { loading, daily, categories, frequent, barData, doughnutData, exportCsv } = useAnalyticsController(refreshKey, filters);

    useEffect(() => {
        const loadExtra = async () => {
            try {
                const [sum, feedback, hourlyRes] = await Promise.all([
                    chatbotService.getSummary(),
                    chatbotService.getFeedbackStats(),
                    chatbotService.getHourlyStats().catch(() => ({ hourly: {} }))
                ]);
                setSummary(sum);
                setFeedbackStats(feedback);
                setHourlyData(hourlyRes.hourly || {});
            } catch (e) { console.error(e); }
        };
        loadExtra();
    }, [refreshKey]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey(k => k + 1);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setRefreshKey(k => k + 1), 30000);
        return () => clearInterval(interval);
    }, []);

    const handleExport = () => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.category !== 'all') params.append('category', filters.category);
        exportCsv(params.toString() ? `?${params.toString()}` : '');
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setRefreshKey(k => k + 1);
    };

    const chartOpts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'bottom',
                labels: { 
                    font: { family: 'Inter, sans-serif', size: 11, weight: '600' },
                    usePointStyle: true,
                    padding: 16
                } 
            },
            tooltip: {
                backgroundColor: '#191c23',
                padding: 12,
                titleFont: { family: 'Inter, sans-serif', size: 13, weight: '700' },
                bodyFont: { family: 'Inter, sans-serif', size: 12 },
                cornerRadius: 12,
                displayColors: true
            }
        },
        scales: {
            x: { 
                grid: { display: false },
                ticks: { font: { family: 'Inter, sans-serif', size: 10, weight: '600' }, color: '#64748b' }
            },
            y: { 
                grid: { color: CHART_COLORS.grid, drawBorder: false },
                ticks: { font: { family: 'Inter, sans-serif', size: 10, weight: '600' }, color: '#64748b' }
            }
        }
    };

    const lineData = {
        labels: daily.map(d => d.label),
        datasets: [
            {
                label: 'Consultas',
                data: daily.map(d => d.count),
                borderColor: CHART_COLORS.primary,
                backgroundColor: CHART_COLORS.primaryLight,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: CHART_COLORS.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ]
    };

    const categoryColors = ['#0b92d5', '#D4A843', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];
    const doughnutDataEnhanced = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: categoryColors.slice(0, Object.keys(categories).length),
            borderWidth: 0,
            hoverOffset: 8
        }]
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96 bg-surface-container-low rounded-3xl animate-pulse">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-primary font-bold tracking-widest uppercase text-sm">Cargando analytics...</p>
            </div>
        </div>
    );

    const maxCount = frequent.length > 0 ? frequent[0].count : 1;
    const totalConsultas = daily.reduce((acc, d) => acc + d.count, 0);
    const avgDaily = daily.length > 0 ? Math.round(totalConsultas / daily.length) : 0;
    const positiveFeedback = feedbackStats?.positive || 0;
    const negativeFeedback = feedbackStats?.negative || 0;
    const totalFeedback = positiveFeedback + negativeFeedback;
    const satisfactionRate = totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">Centro de Analíticas</h3>
                    <p className="text-on-surface-variant text-sm font-medium">Métricas y comportamiento del asistente virtual</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button 
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface font-bold rounded-xl text-sm hover:bg-surface-container-high disabled:opacity-50 transition-all"
                    >
                        <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
                    </button>
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 font-bold rounded-xl text-sm transition-all ${showFilters ? 'bg-primary text-white' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
                    >
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filtros
                    </button>
                    {/* Hide Export button as requested */}
                    {/* <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Exportar
                    </button> */}
                </div>
            </div>

            {showFilters && (
                <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Desde</label>
                            <input 
                                type="date" 
                                value={filters.startDate}
                                onChange={e => handleFilterChange('startDate', e.target.value)}
                                className="px-4 py-2 bg-surface-container rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Hasta</label>
                            <input 
                                type="date" 
                                value={filters.endDate}
                                onChange={e => handleFilterChange('endDate', e.target.value)}
                                className="px-4 py-2 bg-surface-container rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <button 
                            onClick={() => {
                                setFilters({ startDate: '', endDate: '', category: 'all' });
                                setRefreshKey(k => k + 1);
                            }}
                            className="px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    title="Total Consultas" 
                    value={summary?.total_messages || totalConsultas}
                    subtitle={`Últimos ${daily.length} días`}
                    icon="chat"
                    color="primary"
                />
                <MetricCard 
                    title="Promedio Diario" 
                    value={summary?.avg_daily || avgDaily}
                    subtitle="Consultas por día"
                    icon="trending_up"
                    color="secondary"
                />
                <MetricCard 
                    title="Usuarios Únicos" 
                    value={summary?.unique_users || '-'}
                    subtitle="Sesiones activas"
                    icon="group"
                    color="tertiary"
                />
                <MetricCard 
                    title="Satisfacción" 
                    value={`${summary?.satisfaction || satisfactionRate}%`}
                    subtitle={`${positiveFeedback} positivas / ${negativeFeedback} negativas`}
                    icon="thumb_up"
                    color={satisfactionRate >= 70 ? 'tertiary' : 'error'}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/5">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                            Tendencia de Consultas
                        </h4>
                        <span className="text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">Últimos {daily.length} días</span>
                    </div>
                    <div className="h-64">
                        {daily.length > 0 ? (
                            <Line data={lineData} options={chartOpts} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/30 gap-3 border-2 border-dashed border-outline-variant/10 rounded-2xl">
                                <span className="material-symbols-outlined text-4xl">show_chart</span>
                                <p className="text-sm font-bold">Sin datos disponibles</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/5">
                    <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest mb-6 text-center">
                        Distribución por Categoría
                    </h4>
                    <div className="h-48 flex items-center justify-center">
                        {Object.keys(categories).length > 0 ? (
                            <Doughnut data={doughnutDataEnhanced} options={{...chartOpts, scales: undefined, cutout: '65%'}} />
                        ) : (
                            <div className="h-32 w-32 rounded-full border-4 border-surface-container flex items-center justify-center">
                                <span className="text-xs text-on-surface-variant/50 text-center">Sin datos</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 space-y-1">
                        {Object.entries(categories).slice(0, 5).map(([cat, count], i) => (
                            <StatCard 
                                key={cat} 
                                label={cat} 
                                value={count} 
                                percentage={Math.round((count / Object.values(categories).reduce((a,b)=>a+b,0)) * 100)}
                                color={categoryColors[i]}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/5">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                        Actividad por Hora y Día
                    </h4>
                </div>
                <ActivityHeatmap data={hourlyData} />
            </div>

            <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant/5 overflow-hidden">
                <div className="p-6 border-b border-surface-container-low flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
                    </div>
                    <h4 className="text-lg font-black font-headline text-on-surface">Preguntas Más Frecuentes</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-container-low/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest font-headline">#</th>
                                <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest font-headline">Consulta</th>
                                <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest font-headline">Veces</th>
                                <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest font-headline text-right">Impacto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {frequent.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-on-surface-variant/30 italic font-bold">
                                        Sin registros de consultas
                                    </td>
                                </tr>
                            ) : frequent.map((q, i) => (
                                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                                    <td className="px-6 py-4">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${i < 3 ? 'bg-secondary/10 text-secondary' : 'bg-surface-container text-on-surface-variant'}`}>
                                            {i + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-on-surface italic line-clamp-1">"{q.question}"</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-black text-on-surface">{q.count}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                                    style={{width: `${(q.count / maxCount) * 100}%`}}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-primary w-10 text-right">
                                                {Math.round((q.count / maxCount) * 100)}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-center text-xs text-on-surface-variant/60">
                <p>Los datos se actualizan automáticamente cada 30 segundos • Generated with ❤️ by Coll-Bot Analytics</p>
            </div>
        </div>
    );
}
