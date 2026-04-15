// src/pages/GalleryPage.jsx — Galería de la Institución · Stitch faithful
import { useState, useEffect, useMemo } from 'react';
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import Chatbot from '../views/chatbot/Chatbot';
import { useDocumentTitle } from '../controllers/useDocumentTitle';
import { galleryService } from '../services/galleryService';
import { GalleryGridSkeleton } from '../components/Skeleton';

/* ─── SVG Icons ─────────────────────────────────────────────────────── */
const IconImage       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const IconGradCap     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconActivity    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconStar        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconBuilding    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconGrid        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconColumns     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/></svg>;
const IconX           = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconChevLeft    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="15 18 9 12 15 6"/></svg>;
const IconChevRight   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="9 18 15 12 9 6"/></svg>;
const IconArrowRight  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconMaximize    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>;
const IconLoader      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 animate-spin text-primary"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

/* ─── Category Config ────────────────────────────────────────────────── */
const CATEGORIES = [
  { key: 'all',          label: 'Todos',          Icon: IconImage },
  { key: 'academico',    label: 'Académico',       Icon: IconGradCap },
  { key: 'deportes',     label: 'Deportes',        Icon: IconActivity },
  { key: 'eventos',      label: 'Eventos',         Icon: IconStar },
  { key: 'campus',       label: 'Campus',          Icon: IconBuilding },
  { key: 'instalaciones',label: 'Instalaciones',    Icon: IconBuilding },
  { key: 'general',      label: 'General',         Icon: IconStar },
];

const FALLBACK_PHOTOS = [
  { id: '1', titulo: 'Campus Central Pedro Emilio Coll', descripcion: 'Nuestro entorno arquitectónico diseñado para fomentar la innovación.', categoria: 'campus',    url: null, size: 'lg' },
  { id: '2', titulo: 'Laboratorio de Biotecnología',     descripcion: 'Equipamientos de última generación para el aprendizaje práctico.', categoria: 'academico', url: null, size: 'sm' },
  { id: '3', titulo: 'Centro de Recursos',               descripcion: 'Biblioteca con amplia colección de textos y recursos digitales.',    categoria: 'academico', url: null, size: 'sm' },
  { id: '4', titulo: 'Inauguración Juegos Intercolegiales', descripcion: 'Nuestros atletas representando la institución con orgullo.',    categoria: 'deportes',  url: null, size: 'md' },
  { id: '5', titulo: 'Comunidad Estudiantil',            descripcion: 'Nuestros estudiantes en jornadas de integración y aprendizaje.',     categoria: 'eventos',   url: null, size: 'sm' },
  { id: '6', titulo: 'Ciclo de Conferencias: Futuro Digital', descripcion: 'Expertos compartiendo conocimiento con nuestra comunidad.',    categoria: 'academico', url: null, size: 'md' },
  { id: '7', titulo: 'Acto de Grado 2023',               descripcion: 'Celebración del éxito de nuestra promoción 2023.',                  categoria: 'eventos',   url: null, size: 'lg' },
  { id: '8', titulo: 'Áreas Verdes y Recreación',        descripcion: 'Espacios al aire libre para el descanso y la socialización.',        categoria: 'campus',    url: null, size: 'sm' },
  { id: '9', titulo: 'Copa Interescolar de Fútbol',      descripcion: 'Torneo deportivo con equipos de distintas escuelas.',               categoria: 'deportes',  url: null, size: 'md' },
];

/* ─── Placeholder tile ─────────────────────────────────────────────── */
function PhotoPlaceholder({ photo, onClick }) {
  const PALETTE = { campus: 'from-slate-400 to-slate-600', academico: 'from-primary/60 to-primary', deportes: 'from-emerald-400 to-emerald-600', eventos: 'from-violet-400 to-violet-600', general: 'from-gray-400 to-gray-600', instalaciones: 'from-amber-400 to-amber-600', default: 'from-gray-400 to-gray-600' };
  const grad = PALETTE[photo.categoria] || PALETTE.default;
  const imageUrl = photo.image_url || photo.url;

  if (imageUrl) {
    return (
      <div onClick={() => onClick(photo)} className="group relative w-full h-full overflow-hidden rounded-2xl cursor-pointer select-none">
        <img src={imageUrl} alt={photo.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.classList.remove('hidden'); }} />
        <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 flex flex-col items-center justify-center">
          <IconImage />
          <p className="mt-2 text-white/80 font-semibold text-xs text-center px-2">{photo.titulo}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-semibold text-sm line-clamp-1">{photo.titulo}</p>
            <p className="text-white/70 text-xs mt-1 line-clamp-2">{photo.descripcion}</p>
          </div>
        </div>
        <button className="absolute top-3 right-3 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
          <IconMaximize />
        </button>
      </div>
    );
  }
  return (
    <div onClick={() => onClick(photo)} className={`group relative w-full h-full overflow-hidden rounded-2xl cursor-pointer bg-gradient-to-br ${grad} flex flex-col items-center justify-center p-4 select-none`}>
      <div className="absolute inset-0 opacity-10 bg-white" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <IconImage />
      <p className="mt-3 text-white font-semibold text-sm text-center line-clamp-2 relative z-10">{photo.titulo}</p>
    </div>
  );
}

/* ─── Lightbox ──────────────────────────────────────────────────────── */
function Lightbox({ photos, index, onClose, onChange }) {
  const photo = photos[index];
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onChange(Math.max(0, index - 1));
      if (e.key === 'ArrowRight') onChange(Math.min(photos.length - 1, index + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index, onClose, onChange, photos.length]);

  if (!photo) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close */}
      <button onClick={onClose} className="absolute top-6 right-6 p-2.5 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-10">
        <IconX />
      </button>
      {/* Prev */}
      {index > 0 && (
        <button onClick={() => onChange(index - 1)} className="absolute left-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
          <IconChevLeft />
        </button>
      )}
      {/* Next */}
      {index < photos.length - 1 && (
        <button onClick={() => onChange(index + 1)} className="absolute right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
          <IconChevRight />
        </button>
      )}
      {/* Main */}
      <div className="max-w-3xl w-full mx-8">
        {photo.image_url || photo.url ? (
          <img src={photo.image_url || photo.url} alt={photo.titulo} className="w-full max-h-[70vh] object-contain rounded-2xl" />
        ) : (
          <div className="w-full h-72 rounded-2xl bg-surface-container flex items-center justify-center">
            <IconImage />
          </div>
        )}
        <div className="mt-4 px-2">
          <p className="text-white font-semibold text-lg">{photo.titulo}</p>
          {photo.descripcion && <p className="text-white/70 text-sm mt-1">{photo.descripcion}</p>}
        </div>
        <p className="text-center text-white/40 text-xs mt-6">{index + 1} / {photos.length} · Usa las flechas del teclado para navegar</p>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function GalleryPage() {
  useDocumentTitle('Galería');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [layout, setLayout] = useState('masonry');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [hasServerData, setHasServerData] = useState(false);

  useEffect(() => {
    galleryService.getAllPublic()
      .then(data => { 
        if (data?.length) { 
          setPhotos(data); 
          setHasServerData(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayPhotos = hasServerData ? photos : FALLBACK_PHOTOS;

  const filtered = useMemo(
    () => category === 'all' ? displayPhotos : displayPhotos.filter(p => p.categoria === category),
    [displayPhotos, category]
  );

  const openLightbox = (photo) => {
    const idx = filtered.findIndex(p => p.id === photo.id);
    if (idx >= 0) setLightboxIndex(idx);
  };

  /* Featured spotlight – first photo */
  const featured = displayPhotos[0] || null;

  return (
    <div className="bg-surface min-h-screen font-body">
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-[300px] sm:w-[440px] h-[300px] sm:h-[440px] bg-primary/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-secondary-container/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:px-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-4 sm:mb-6 border border-primary/15">
            <IconImage aria-hidden="true" />
            <span className="hidden xs:inline">Vida Institucional</span>
            <span className="xs:hidden">Galería</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-on-surface tracking-tight leading-[0.9] mb-4 sm:mb-6">
            Galería
            <br />
            <span className="text-primary">de la Institución</span>
          </h1>
          <p className="text-sm sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Explora la excelencia académica y la vida vibrante en nuestra institución.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:px-16 pb-16 sm:pb-20 lg:pb-28 space-y-8 sm:space-y-14">

        {/* ── Feature Spotlight ── */}
        {featured && (
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden" style={{ minHeight: 280 sm:360 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary" />
            {(featured.image_url || featured.url) && (
              <img src={featured.image_url || featured.url} alt={featured.titulo} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Grid of sub-items - hidden on mobile */}
            <div className="absolute inset-0 flex hidden md:flex">
              <div className="flex-1" />
              <div className="w-72 flex flex-col p-4 gap-3">
                {displayPhotos.slice(1, 3).map((p, i) => (
                  <div key={p.id} onClick={() => openLightbox(p)} className="flex-1 rounded-xl overflow-hidden cursor-pointer relative">
                    {(p.image_url || p.url) ? (
                      <img src={p.image_url || p.url} alt={p.titulo} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${i === 0 ? 'from-sky-400 to-sky-600' : 'from-violet-400 to-violet-600'} flex items-center justify-center`}>
                        <p className="text-white text-xs font-semibold text-center px-3">{p.titulo}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-end" style={{ minHeight: 280 sm:360 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold mb-2 sm:mb-3 w-fit">
                <IconBuilding />
                <span className="hidden sm:inline">Campus Central Pedro Emilio Coll</span>
                <span className="sm:hidden">Institución</span>
              </div>
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
                {featured.titulo}
              </h2>
              <p className="text-white/80 max-w-md text-sm sm:text-base">{featured.descripcion}</p>
            </div>
          </div>
        )}

        {/* ── Filters + Layout toggle ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Category tabs - scrollable on mobile */}
          <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2 sm:pb-0" role="group" aria-label="Filtrar galería por categoría">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setCategory(cat.key)}
                aria-pressed={category === cat.key}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  category === cat.key
                    ? 'bg-[#005bbf] text-white shadow-md shadow-primary/25'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <cat.Icon aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">{cat.label}</span>
                <span className="xs:hidden">{cat.label.substring(0, 4)}</span>
              </button>
            ))}
          </div>
          {/* Layout toggle - hide on very small screens */}
          <div className="flex gap-1 bg-surface-container p-1 rounded-full self-end sm:self-auto">
            <button onClick={() => setLayout('masonry')}
              className={`p-2 sm:p-2.5 rounded-full transition-all ${layout === 'masonry' ? 'bg-[#005bbf] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              aria-label="Diseño masonry"
              aria-pressed={layout === 'masonry'}
            >
              <IconColumns aria-hidden="true" />
            </button>
            <button onClick={() => setLayout('grid')}
              className={`p-2 sm:p-2.5 rounded-full transition-all ${layout === 'grid' ? 'bg-[#005bbf] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              aria-label="Diseño de cuadrícula"
              aria-pressed={layout === 'grid'}
            >
              <IconGrid aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Photo Grid ── */}
        {loading ? (
          <GalleryGridSkeleton count={8} />
        ) : filtered.length === 0 ? (
          <div className="py-12 sm:py-24 flex flex-col items-center gap-4 text-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"><IconImage /></div>
            <p className="text-on-surface-variant text-sm sm:text-base">No hay fotos en esta categoría.</p>
            <button onClick={() => setCategory('all')} className="px-5 py-2.5 bg-primary/10 text-primary text-sm font-semibold rounded-full hover:bg-primary/20 transition-colors">
              Ver todas
            </button>
          </div>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {filtered.map(photo => (
              <div key={photo.id} className="aspect-square">
                <PhotoPlaceholder photo={photo} onClick={openLightbox} />
              </div>
            ))}
          </div>
        ) : (
          /* Masonry-style with CSS columns */
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 sm:3 space-y-2 sm:space-y-3">
            {filtered.map((photo, i) => {
              const tall = photo.size === 'lg' || i % 5 === 0;
              return (
                <div key={photo.id} className={`break-inside-avoid mb-2 sm:mb-3 ${tall ? 'aspect-[3/4]' : 'aspect-square'}`}>
                  <PhotoPlaceholder photo={photo} onClick={openLightbox} />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <Chatbot />

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
