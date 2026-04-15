import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ news: [], events: [] });
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery('');
            setResults({ news: [], events: [] });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults({ news: [], events: [] });
            return;
        }

        const searchTimeout = setTimeout(async () => {
            setLoading(true);
            try {
                const [newsRes, eventsRes] = await Promise.all([
                    fetch(`/api/news?search=${encodeURIComponent(query)}`),
                    fetch(`/api/events?search=${encodeURIComponent(query)}`)
                ]);
                
                const newsData = await newsRes.json().catch(() => []);
                const eventsData = await eventsRes.json().catch(() => []);
                
                setResults({
                    news: Array.isArray(newsData) ? newsData.slice(0, 5) : [],
                    events: Array.isArray(eventsData) ? eventsData.slice(0, 5) : []
                });
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    const handleSelect = (type, id) => {
        onClose();
        setQuery('');
        if (type === 'news') {
            navigate(`/noticias/${id}`);
        } else if (type === 'event') {
            navigate('/calendario');
        } else if (type === 'page') {
            navigate(id);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4" role="dialog" aria-modal="true" aria-label="Buscar en el sitio">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20">
                <div className="flex items-center gap-3 px-4 py-3 border-b" style={{borderColor: 'var(--md-outline-variant)'}}>
                    <span className="material-symbols-outlined text-on-surface-variant" aria-hidden="true">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar en el sitio..."
                        className="flex-1 bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant/60 text-base"
                    />
                    {loading && (
                        <span className="material-symbols-outlined text-on-surface-variant animate-spin text-sm" aria-hidden="true">sync</span>
                    )}
                    <button onClick={onClose} className="p-1.5 hover:bg-surface-container-high rounded-full transition-colors" aria-label="Cerrar búsqueda">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm" aria-hidden="true">close</span>
                    </button>
                </div>

                <div className="max-h-[50vh] overflow-y-auto">
                    {query.length < 2 ? (
                        <div className="p-8 text-center text-on-surface-variant" role="status">
                            <span className="material-symbols-outlined text-5xl mb-3 opacity-40" aria-hidden="true">search</span>
                            <p className="text-sm">Escribe para buscar</p>
                            <p className="text-xs mt-1 opacity-60">Noticias, eventos y páginas</p>
                        </div>
                    ) : results.news.length === 0 && results.events.length === 0 ? (
                        <div className="p-8 text-center text-on-surface-variant" role="status">
                            <span className="material-symbols-outlined text-5xl mb-3 opacity-40" aria-hidden="true">search_off</span>
                            <p className="text-sm">Sin resultados</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.news.length > 0 && (
                                <div className="px-3">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1">Noticias</p>
                                    {results.news.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect('news', item.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-left"
                                        >
                                            <span className="material-symbols-outlined text-primary text-lg" aria-hidden="true">article</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-on-surface truncate">{item.titulo}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-on-surface-variant/40 text-sm" aria-hidden="true">chevron_right</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {results.events.length > 0 && (
                                <div className="px-3 mt-2">
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1">Eventos</p>
                                    {results.events.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect('event', item.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-left"
                                        >
                                            <span className="material-symbols-outlined text-tertiary text-lg" aria-hidden="true">event</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-on-surface truncate">{item.title || item.titulo}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-on-surface-variant/40 text-sm" aria-hidden="true">chevron_right</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="px-3 mt-2 pt-2" style={{borderTop: '1px solid var(--md-outline-variant)'}}>
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1">Páginas</p>
                                {[
                                    { label: 'Inicio', path: '/' },
                                    { label: 'Noticias', path: '/noticias' },
                                    { label: 'Calendario', path: '/calendario' },
                                    { label: 'Académico', path: '/academico' },
                                    { label: 'Galería', path: '/galeria' },
                                    { label: 'Contacto', path: '/contacto' },
                                ].filter(p => p.label.toLowerCase().includes(query.toLowerCase())).map((page) => (
                                    <button
                                        key={page.path}
                                        onClick={() => handleSelect('page', page.path)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-left"
                                    >
                                        <span className="material-symbols-outlined text-secondary text-lg" aria-hidden="true">web</span>
                                        <span className="text-sm font-medium text-on-surface">{page.label}</span>
                                        <span className="material-symbols-outlined text-on-surface-variant/40 text-sm ml-auto">chevron_right</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-4 py-2.5 flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-low" style={{borderTop: '1px solid var(--md-outline-variant)'}}>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-container-lowest border rounded text-[10px]" style={{borderColor: 'var(--md-outline-variant)'}}>↵</kbd> abrir</span>
                        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-surface-container-lowest border rounded text-[10px]" style={{borderColor: 'var(--md-outline-variant)'}}>esc</kbd> cerrar</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
