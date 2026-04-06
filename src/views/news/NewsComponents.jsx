import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NEWS_CATEGORIES, formatDate } from '../../controllers/useNewsController.js';
import { eventsService } from '../../services/eventsService';
import { settingsService } from '../../services/settingsService';

function formatContent(content) {
    if (!content) return '';
    if (content.includes('<') && content.includes('>')) {
        return { __html: content };
    }
    return { __html: content.split('\n').map((p, i) => `<p key="${i}">${p}</p>`).join('') };
}

export function NewsFilters({ active, onChange, search, onSearch }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-wrap gap-2">
                {NEWS_CATEGORIES.map(cat => (
                    <button 
                        key={cat.id} 
                        className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
                            active === cat.id 
                            ? 'bg-[#005bbf] text-white shadow-lg shadow-primary/20' 
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container'
                        }`}
                        onClick={() => onChange(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
            <div className="relative w-full md:w-64">
                <input 
                    className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface font-medium placeholder:text-outline-variant" 
                    placeholder="Buscar noticias..." 
                    type="text"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
            </div>
        </div>
    );
}

export function NewsGrid({ news = [], onSelect }) {
    if (!news || news.length === 0) {
        return (
            <div className="py-20 text-center bg-surface-container-low rounded-[2rem] border-2 border-dashed border-outline-variant/30 flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-6xl text-outline-variant">newspaper</span>
                <p className="text-on-surface-variant font-headline font-bold">No hay noticias disponibles en esta categoría.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {news.map((item, i) => (
                <article 
                    key={item.id || i} 
                    className="bg-surface-container-lowest rounded-[1.5rem] overflow-hidden group border border-transparent hover:border-outline-variant/15 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer"
                    onClick={() => onSelect?.(item)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect?.(item)}
                    tabIndex="0"
                    role="button"
                    aria-label={`Leer noticia: ${item.titulo}`}
                >
                    <div className="h-56 overflow-hidden relative">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            src={item.image_url || '/assets/images/news-fallback.jpg'} 
                            alt={item.titulo} 
                        />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                            {item.categoria}
                        </span>
                    </div>
                    <div className="p-8">
                        <time className="text-on-surface-variant/60 text-[10px] font-black uppercase tracking-widest mb-3 block">
                            {formatDate(item.fecha)}
                        </time>
                        <h3 className="text-xl font-headline font-black text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                            {item.titulo}
                        </h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                            {item.extracto}
                        </p>
                        <div className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group/link">
                            Continuar leyendo 
                            <span className="material-symbols-outlined text-base group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

export function NewsHero({ item, onSelect }) {
    if (!item) return null;
    return (
        <section className="mb-16 animate-in fade-in zoom-in-95 duration-700" aria-labelledby="news-hero-title">
            <div 
                className="relative overflow-hidden rounded-[2.5rem] h-[550px] flex items-end group cursor-pointer shadow-2xl shadow-primary/10"
                onClick={() => onSelect(item)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(item)}
                tabIndex="0"
                role="button"
                aria-label={`Leer noticia: ${item.titulo}`}
            >
                <img 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    src={item.image_url || '/assets/images/news-fallback.jpg'} 
                    alt={item.titulo} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="relative p-6 md:p-12 w-full max-w-4xl">
                    <div className="bg-[#0b1326]/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl">
                        <div className="flex gap-2 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-[#005bbf] text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-primary/30">
                                {item.categoria}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black tracking-widest uppercase">
                                {formatDate(item.fecha)}
                            </span>
                        </div>
                        <h1 id="news-hero-title" className="text-4xl md:text-5xl lg:text-6xl font-headline font-black text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-lg">
                            {item.titulo}
                        </h1>
                        <p className="text-white/90 text-lg mb-8 max-w-2xl font-medium leading-relaxed line-clamp-2 drop-shadow-md">
                            {item.extracto}
                        </p>
                        <button className="bg-[#005bbf] text-white px-10 py-4 rounded-full font-headline font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-[#004a9e] shadow-xl shadow-black/20 transition-all active:scale-95">
                            Leer más <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function NewsSidebar() {
    const [events, setEvents] = useState([]);
    const [comunicado, setComunicado] = useState({ enabled: false, titulo: '', mensaje: '' });
    
    useEffect(() => {
        eventsService.getPublic()
            .then(data => setEvents(data?.slice(0, 3) || []))
            .catch(() => {});
        
        settingsService.getComunicado()
            .then(data => setComunicado(data || { enabled: false, titulo: '', mensaje: '' }))
            .catch(() => {});
    }, []);

    const formatEventDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return {
            day: d.getDate().toString().padStart(2, '0'),
            month: d.toLocaleDateString('es-VE', { month: 'short' }).toUpperCase()
        };
    };

    return (
        <aside aria-label="Barra lateral de noticias" className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            {/* Próximos Eventos */}
            <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
                <h2 className="text-xl font-headline font-black text-on-surface mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>calendar_month</span>
                    Próximos Eventos
                </h2>
                <div className="space-y-8">
                    {events.length > 0 ? events.map((ev, i) => {
                        const { day, month } = formatEventDate(ev.fecha);
                        return (
                            <div key={i} className="flex gap-5 group cursor-pointer">
                                <div className="flex-shrink-0 w-16 h-16 bg-surface-container-lowest rounded-2xl flex flex-col items-center justify-center shadow-sm border border-outline-variant/10 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                    <span className="text-[10px] font-black text-primary uppercase group-hover:text-on-primary">{month}</span>
                                    <span className="text-2xl font-black text-on-surface leading-none group-hover:text-on-primary">{day}</span>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="font-headline font-black text-on-surface group-hover:text-primary transition-colors text-sm leading-tight mb-1">{ev.titulo || ev.title}</h4>
                                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{ev.lugar || ''}</p>
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="text-on-surface-variant text-sm">No hay eventos próximos</p>
                    )}
                </div>
                <Link 
                    to="/calendario"
                    className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#005bbf] text-white font-bold text-sm hover:bg-[#004a9e] transition-colors"
                >
                    Ver Calendario Completo
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
            </div>

            {/* Comunicado Urgente - solo mostrar si está habilitado */}
            {comunicado.enabled && (
                <div className="bg-error-container/20 p-8 rounded-[2rem] border border-error/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-error/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-error/20 transition-all duration-700"></div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                        <h3 className="text-error font-black text-[10px] uppercase tracking-[0.2em]">{comunicado.titulo || 'Comunicado Urgente'}</h3>
                    </div>
                    <p className="text-on-error-container text-sm font-bold leading-relaxed relative z-10">
                        {comunicado.mensaje}
                    </p>
                </div>
            )}

            {/* Legado Pedro Emilio Coll */}
            <div className="relative rounded-[2rem] overflow-hidden group shadow-xl">
                <img 
                    className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-1000" 
                    src="/assets/images/legado.jpg" 
                    alt="Legado Cultural" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent"></div>
                <div className="absolute bottom-0 p-8">
                    <h3 className="text-white font-headline font-black text-2xl mb-2">Legado Cultural</h3>
                    <p className="text-white/80 text-sm italic font-medium mb-6 leading-relaxed">
                        "El mundo de los libros es el más hermoso de los mundos..."
                    </p>
                    <Link to="/eponimo" className="inline-flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest hover:gap-4 transition-all">
                        Conoce a nuestro epónimo
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}

export function NewsModal({ item, onClose }) {
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    if (!item) return null;
    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-xl" onClick={onClose}></div>
            <div className="bg-surface-container-lowest w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative z-10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="relative h-72 md:h-96 w-full">
                    <img className="w-full h-full object-cover" src={item.image_url} alt={item.titulo} />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                    <button 
                        className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all active:scale-90"
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="absolute bottom-8 left-8 right-8">
                         <span className="px-4 py-1.5 rounded-xl bg-[#005bbf] text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-primary/20">
                            {item.categoria}
                        </span>
                    </div>
                </div>
                <div className="p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8 text-on-surface-variant/40 font-black text-[10px] uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">event</span>
                        {formatDate(item.fecha)}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-headline font-black text-on-surface mb-8 tracking-tighter leading-tight">
                        {item.titulo}
                    </h2>
                    <div className="text-on-surface-variant font-medium leading-[2] text-lg space-y-6" dangerouslySetInnerHTML={formatContent(item.contenido)} />
                    
                    <div className="mt-12 pt-12 border-t border-outline-variant/10 flex flex-wrap gap-4">
                        <Link 
                            to="/calendario"
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-container-high text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:bg-[#005bbf] hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-base" aria-hidden="true">calendar_month</span>
                            Ver Calendario
                        </Link>
                        <button 
                            onClick={() => {
                                const url = window.location.href;
                                const title = item?.titulo || 'Noticia';
                                if (navigator.share) {
                                    navigator.share({ title, url }).catch(() => {});
                                } else {
                                    navigator.clipboard.writeText(url).then(() => {
                                        alert('Enlace copiado al portapapeles');
                                    });
                                }
                            }}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-container-high text-on-surface-variant font-black text-[10px] uppercase tracking-widest hover:bg-[#005bbf] hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-base" aria-hidden="true">share</span>
                            Compartir Noticia
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
