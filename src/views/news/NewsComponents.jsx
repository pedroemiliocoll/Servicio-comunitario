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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2 -mb-1">
                {NEWS_CATEGORIES.map(cat => (
                    <button 
                        key={cat.id} 
                        className={`px-4 sm:px-5 py-2.5 sm:py-2 rounded-full font-medium text-sm transition-all min-h-[44px] ${
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
            <div className="relative w-full sm:w-64">
                <input 
                    className="w-full bg-surface-container-low border-none rounded-full py-2 sm:py-2.5 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all text-on-surface font-medium placeholder:text-outline-variant" 
                    placeholder="Buscar..." 
                    type="text"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg sm:text-xl">search</span>
            </div>
        </div>
    );
}

export function NewsGrid({ news = [], onSelect }) {
    if (!news || news.length === 0) {
        return (
            <div className="py-12 sm:py-20 text-center bg-surface-container-low rounded-2xl sm:rounded-[2rem] border-2 border-dashed border-outline-variant/30 flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-4xl sm:text-6xl text-outline-variant">newspaper</span>
                <p className="text-on-surface-variant font-headline font-bold text-sm sm:text-base">No hay noticias disponibles.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {news.map((item, i) => (
                <article 
                    key={item.id || i} 
                    className="bg-surface-container-lowest rounded-xl sm:rounded-[1.5rem] overflow-hidden group border border-transparent hover:border-outline-variant/15 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer"
                    onClick={() => onSelect?.(item)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect?.(item)}
                    tabIndex="0"
                    role="button"
                    aria-label={`Leer noticia: ${item.titulo}`}
                >
                    <div className="h-40 sm:h-56 overflow-hidden relative">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            src={item.image_url || '/assets/images/news-fallback.jpg'} 
                            alt={item.titulo} 
                        />
                        <span className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2 sm:px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                            {item.categoria}
                        </span>
                    </div>
                    <div className="p-4 sm:p-6 lg:p-8">
                        <time className="text-on-surface-variant/60 text-[10px] font-black uppercase tracking-widest mb-2 sm:mb-3 block">
                            {formatDate(item.fecha)}
                        </time>
                        <h3 className="text-base sm:text-xl font-headline font-black text-on-surface mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                            {item.titulo}
                        </h3>
                        <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-2 font-medium">
                            {item.extracto}
                        </p>
                        <div className="text-primary font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 group/link">
                            Leer más 
                            <span className="material-symbols-outlined text-sm sm:text-base group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
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
        <section className="mb-8 sm:mb-12 lg:mb-16 animate-in fade-in zoom-in-95 duration-700" aria-labelledby="news-hero-title">
            <div 
                className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[550px] flex items-end group cursor-pointer shadow-2xl shadow-primary/10"
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
                <div className="relative p-4 sm:p-6 md:p-12 w-full max-w-4xl">
                    <div className="bg-[#0b1326]/40 backdrop-blur-xl border border-white/10 p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl lg:rounded-[2rem] shadow-2xl">
                        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 md:mb-6">
                            <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#005bbf] text-white text-[8px] sm:text-[10px] font-black tracking-widest uppercase shadow-lg shadow-primary/30">
                                {item.categoria}
                            </span>
                            <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[8px] sm:text-[10px] font-black tracking-widest uppercase">
                                {formatDate(item.fecha)}
                            </span>
                        </div>
                        <h1 id="news-hero-title" className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-headline font-black text-white tracking-tighter leading-[1.1] mb-3 sm:mb-4 md:mb-6 drop-shadow-lg line-clamp-2">
                            {item.titulo}
                        </h1>
                        <p className="text-white/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 max-w-2xl font-medium leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow-md">
                            {item.extracto}
                        </p>
                        <button className="bg-[#005bbf] text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-full font-headline font-black text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2 sm:gap-3 hover:bg-[#004a9e] shadow-xl shadow-black/20 transition-all active:scale-95">
                            Leer más <span className="material-symbols-outlined text-lg sm:text-xl">arrow_right_alt</span>
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
            .then(data => setComunicado(data))
            .catch(() => {});
    }, []);

    return (
        <aside className="space-y-6 sm:space-y-8">
            {/* Comunicado Urgente */}
            {comunicado.enabled && (
                <div className="bg-error-container rounded-2xl p-4 sm:p-6 border border-error/20">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-error">campaign</span>
                        <h3 className="font-headline font-bold text-error text-sm sm:text-base">Comunicado Urgente</h3>
                    </div>
                    <h4 className="font-bold text-on-error-container text-sm sm:text-base mb-2">{comunicado.titulo}</h4>
                    <p className="text-on-error-container/80 text-xs sm:text-sm">{comunicado.mensaje}</p>
                </div>
            )}

            {/* Próximos Eventos */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6">
                <h3 className="font-headline font-black text-on-surface text-sm sm:text-base uppercase tracking-widest mb-4 sm:mb-6">Próximos Eventos</h3>
                {events.length === 0 ? (
                    <p className="text-on-surface-variant text-sm">No hay eventos programados.</p>
                ) : (
                    <div className="space-y-4">
                        {events.map(event => (
                            <div key={event.id} className="flex gap-3 sm:gap-4 border-b border-outline-variant/10 pb-3 sm:pb-4 last:border-0">
                                <div className="flex-shrink-0 w-10 sm:w-12 h-10 sm:h-12 bg-primary rounded-lg flex flex-col items-center justify-center text-white">
                                    <span className="text-[10px] font-bold uppercase">{new Date(event.fecha).toLocaleDateString('es-VE', { month: 'short' })}</span>
                                    <span className="text-sm sm:text-base font-black">{new Date(event.fecha).getDate()}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-on-surface text-xs sm:text-sm line-clamp-1">{event.titulo}</h4>
                                    <p className="text-on-surface-variant text-[10px] sm:text-xs">{event.hora || 'Por confirmar'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <Link to="/calendario" className="block text-center text-primary font-bold text-xs sm:text-sm mt-4 hover:underline">
                    Ver calendario completo →
                </Link>
            </div>

            {/* Categorías */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6">
                <h3 className="font-headline font-black text-on-surface text-sm sm:text-base uppercase tracking-widest mb-4 sm:mb-6">Categorías</h3>
                <div className="space-y-1">
                    {NEWS_CATEGORIES.slice(0, 6).map(cat => (
                        <Link key={cat.id} to={`/noticias?categoria=${cat.id}`} className="flex justify-between items-center py-3 sm:py-2 min-h-[48px] hover:text-primary transition-colors">
                            <span className="text-on-surface-variant text-sm">{cat.label}</span>
                            <span className="material-symbols-outlined text-on-surface-variant text-lg">chevron_right</span>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export function NewsModal({ item, onClose }) {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-surface-container-lowest w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-error hover:text-white transition-colors" aria-label="Cerrar">
                    <span className="material-symbols-outlined text-lg sm:text-xl">close</span>
                </button>
                
                <div className="relative h-48 sm:h-64 md:h-80">
                    <img src={item.image_url || '/assets/images/news-fallback.jpg'} alt={item.titulo} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#005bbf] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full">{item.categoria}</span>
                    </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8">
                    <time className="text-on-surface-variant/60 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-3 sm:mb-4 block">{formatDate(item.fecha)}</time>
                    <h1 id="modal-title" className="text-xl sm:text-2xl md:text-3xl font-headline font-black text-on-surface mb-4 sm:mb-6 leading-tight">{item.titulo}</h1>
                    <div className="prose prose-sm sm:prose max-w-none text-on-surface-variant" dangerouslySetInnerHTML={formatContent(item.contenido || item.extracto)}></div>
                    
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-outline-variant/20">
                        <Link to="/noticias" className="inline-flex items-center gap-2 text-primary font-bold text-sm sm:text-base hover:underline">
                            <span className="material-symbols-outlined">arrow_back</span> Volver a noticias
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}