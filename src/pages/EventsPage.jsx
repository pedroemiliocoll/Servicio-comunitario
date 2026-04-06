// src/pages/EventsPage.jsx — Calendario de Eventos · Stitch faithful
import { useState, useMemo } from 'react';
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import Chatbot from '../views/chatbot/Chatbot';
import { useDocumentTitle } from '../controllers/useDocumentTitle';
import { eventsService } from '../services/eventsService';
import { useEffect } from 'react';
import { EventListSkeleton } from '../components/Skeleton';

/* ─── SVG Icons ─────────────────────────────────────────────────────── */
const IconCalendar    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconSearch      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconX           = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconList        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconGrid        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconGradCap     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconMask        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const IconActivity    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconStar        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconCpu         = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>;
const IconArrowRight  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconBell        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;

/* ─── Event type styling ─────────────────────────────────────────────── */
const TYPE_META = {
  academico:    { label: 'Académico',    Icon: IconGradCap,  pill: 'bg-primary/10 text-primary',       border: 'border-l-primary',    dateBg: 'bg-primary text-white' },
  cultural:     { label: 'Cultural',     Icon: IconMask,     pill: 'bg-violet-100 text-violet-700',     border: 'border-l-violet-400', dateBg: 'bg-violet-500 text-white' },
  deportivo:    { label: 'Deportivo',    Icon: IconActivity, pill: 'bg-emerald-100 text-emerald-700',   border: 'border-l-emerald-400',dateBg: 'bg-emerald-500 text-white' },
  institucional:{ label: 'Institucional',Icon: IconStar,     pill: 'bg-amber-100 text-amber-700',       border: 'border-l-amber-400',  dateBg: 'bg-amber-500 text-white' },
  general:      { label: 'General',      Icon: IconCpu,      pill: 'bg-sky-100 text-sky-700',           border: 'border-l-sky-400',    dateBg: 'bg-sky-500 text-white' },
};

function formatDay(dateStr) { return new Date(dateStr + 'T00:00:00').getDate().toString().padStart(2, '0'); }
function formatMonth(dateStr) {
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  return months[new Date(dateStr + 'T00:00:00').getMonth()];
}
function formatFullDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}
function groupByMonth(events) {
  const groups = {};
  events.forEach(ev => {
    const d = new Date(ev.fecha + 'T00:00:00');
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-VE', { month: 'long', year: 'numeric' });
    label.charAt(0).toUpperCase() + label.slice(1);
    if (!groups[key]) groups[key] = { label: label.charAt(0).toUpperCase() + label.slice(1), events: [] };
    groups[key].events.push(ev);
  });
  return Object.values(groups);
}

const ALL_TYPES = [
  { key: 'todos', label: 'Todos', Icon: IconCalendar },
  ...Object.entries(TYPE_META).map(([key, meta]) => ({ key, label: meta.label, Icon: meta.Icon })),
];

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function EventsPage() {
  useDocumentTitle('Calendario de Eventos');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [view, setView] = useState('list');

  useEffect(() => {
    eventsService.getPublic()
      .then(data => { 
        const normalized = (data || []).map(ev => ({
          ...ev,
          title: ev.titulo || ev.title || '',
          description: ev.descripcion || ev.description || ''
        }));
        setEvents(normalized); 
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return events.filter(ev => {
      const matchesType = typeFilter === 'todos' || ev.tipo === typeFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q || (ev.titulo || ev.title || '').toLowerCase().includes(q) || (ev.descripcion || ev.description || '').toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [events, search, typeFilter]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  return (
    <div className="bg-surface min-h-screen font-body">
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-[440px] h-[440px] bg-primary/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-secondary-container/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/15">
            <IconCalendar aria-hidden="true" />
            <span>Vida Institucional</span>
          </div>
          <h1 className="font-headline text-6xl md:text-8xl font-black text-on-surface tracking-tight leading-[0.9] mb-6">
            Calendario
            <br />
            <span className="text-primary">de Eventos</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Mantente al día con las actividades, fechas importantes y eventos de la U.E.N. Pedro Emilio Coll. Tu guía central para la vida académica y cultural.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 md:px-16 pb-28">
        {/* ── Controls bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 min-w-56 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" aria-hidden="true">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Buscar eventos"
              className="w-full pl-12 pr-10 py-3 rounded-full bg-surface-container-lowest border border-outline/20 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/40 text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface" aria-label="Limpiar búsqueda">
                <IconX />
              </button>
            )}
          </div>
          {/* View toggle */}
          <div className="flex gap-1 bg-surface-container p-1 rounded-full" role="group" aria-label="Cambiar vista de eventos">
            <button onClick={() => setView('list')}
              className={`p-2.5 rounded-full transition-all ${view === 'list' ? 'bg-[#005bbf] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              aria-label="Vista de lista"
              aria-pressed={view === 'list'}
            >
              <IconList aria-hidden="true" />
            </button>
            <button onClick={() => setView('grid')}
              className={`p-2.5 rounded-full transition-all ${view === 'grid' ? 'bg-[#005bbf] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              aria-label="Vista de cuadrícula"
              aria-pressed={view === 'grid'}
            >
              <IconGrid aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Type filters ── */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filtrar eventos por tipo">
          {ALL_TYPES.map(t => (
            <button key={t.key} onClick={() => setTypeFilter(t.key)}
              aria-pressed={typeFilter === t.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                typeFilter === t.key
                  ? 'bg-[#005bbf] text-white shadow-md shadow-primary/25'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <t.Icon aria-hidden="true" />
              {t.label}
            </button>
          ))}
          {filtered.length > 0 && (
            <span className="ml-auto flex items-center text-xs text-on-surface-variant self-center" aria-live="polite" aria-atomic="true">
              {filtered.length} evento{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <EventListSkeleton count={5} />
        ) : filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <IconCalendar />
            </div>
            <p className="text-on-surface-variant font-medium">Sin eventos para los filtros seleccionados.</p>
            <button onClick={() => { setSearch(''); setTypeFilter('todos'); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
              Limpiar filtros
            </button>
          </div>
        ) : view === 'list' ? (
          /* ── LIST VIEW ── */
          <div className="space-y-12">
            {grouped.map(group => (
              <div key={group.label}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-headline font-black text-xl text-on-surface capitalize">{group.label}</h2>
                  <div className="flex-1 h-px bg-outline-variant/50" />
                  <span className="text-xs text-on-surface-variant font-medium">{group.events.length} evento{group.events.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-3">
                  {group.events.map(ev => {
                    const meta = TYPE_META[ev.tipo] || TYPE_META.especial;
                    return (
                      <div key={ev.id} className={`flex gap-6 p-5 bg-surface-container-lowest rounded-2xl shadow-sm border-l-4 ${meta.border} hover:-translate-x-1 transition-all duration-200`}>
                        {/* Date badge */}
                        <div className={`shrink-0 w-14 flex flex-col items-center justify-center rounded-xl ${meta.dateBg} py-2`}>
                          <span className="text-2xl font-black leading-none">{formatDay(ev.fecha)}</span>
                          <span className="text-xs font-bold uppercase tracking-widest opacity-80">{formatMonth(ev.fecha)}</span>
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${meta.pill}`}>
                              <meta.Icon />
                              {meta.label}
                            </span>
                          </div>
                          <h3 className="font-headline font-bold text-on-surface text-base">{ev.title}</h3>
                          <p className="text-sm text-on-surface-variant leading-relaxed mt-1 line-clamp-2">{ev.description}</p>
                          <p className="text-xs text-on-surface-variant mt-2">{formatFullDate(ev.fecha)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── GRID VIEW ── */
          <div className="space-y-12">
            {grouped.map(group => (
              <div key={group.label}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-headline font-black text-xl text-on-surface capitalize">{group.label}</h2>
                  <div className="flex-1 h-px bg-outline-variant/50" />
                  <span className="text-xs text-on-surface-variant font-medium">{group.events.length} evento{group.events.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.events.map(ev => {
                    const meta = TYPE_META[ev.tipo] || TYPE_META.especial;
                    return (
                      <div key={ev.id} className="flex flex-col gap-4 p-6 bg-surface-container-lowest rounded-3xl shadow-sm hover:-translate-y-1 transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full ${meta.pill}`}>
                            <meta.Icon />
                            {meta.label}
                          </span>
                          <div className={`flex flex-col items-center justify-center rounded-xl ${meta.dateBg} w-12 h-12 shrink-0`}>
                            <span className="text-xl font-black leading-none">{formatDay(ev.fecha)}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-90">{formatMonth(ev.fecha)}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-headline font-bold text-on-surface">{ev.title}</h3>
                          <p className="text-sm text-on-surface-variant leading-relaxed mt-2 line-clamp-3">{ev.description}</p>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-auto">{formatFullDate(ev.fecha)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
