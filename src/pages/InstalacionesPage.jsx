// src/pages/InstalacionesPage.jsx — Nuestras Instalaciones · Stitch faithful
import { useState } from 'react';
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import Chatbot from '../views/chatbot/Chatbot';
import { useDocumentTitle } from '../controllers/useDocumentTitle';
import { galleryService } from '../services/galleryService';
import { useEffect } from 'react';

/* ─── SVG Icon Components ──────────────────────────────────────────── */
const IconLibrary     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IconLab         = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 3h6l3 9H6L9 3z"/><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/><path d="M10 17h4"/></svg>;
const IconComputer    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
const IconSport       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const IconStage       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 20h20"/><path d="M4 20V8l8-6 8 6v12"/><path d="M9 20v-6h6v6"/></svg>;
const IconDining      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>;
const IconTree        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 22V12"/><path d="M12 12C12 7 7 4 7 4s5 3 5 8c0-5 5-8 5-8s-5 3-5 8z"/><path d="M5 22h14"/></svg>;
const IconOffice      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M12 12v5"/><path d="M8 12v1"/><path d="M16 12v1"/></svg>;
const IconArrowRight  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconMapPin      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconBuilding    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconUsers       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconStar        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconCalendar    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

/* ─── Facilities Data ───────────────────────────────────────────────── */
const FACILITIES = [
  {
    id: 'biblioteca',
    title: 'Biblioteca',
    description: 'Colección extensa de textos académicos, zonas de lectura silenciosa y recursos digitales de vanguardia.',
    icon: IconLibrary,
    accent: 'text-blue-600 dark:text-blue-300',
    bgAccent: 'bg-blue-50 dark:bg-blue-900/30',
    iconRing: 'bg-blue-100 dark:bg-blue-800/40',
  },
  {
    id: 'laboratorio',
    title: 'Laboratorio',
    description: 'Equipamiento especializado para química, física y biología, permitiendo el aprendizaje práctico y seguro.',
    icon: IconLab,
    accent: 'text-violet-600 dark:text-violet-300',
    bgAccent: 'bg-violet-50 dark:bg-violet-900/30',
    iconRing: 'bg-violet-100 dark:bg-violet-800/40',
  },
  {
    id: 'computacion',
    title: 'Sala de Computación',
    description: 'Sistemas de última generación con internet de alta velocidad y software educativo especializado para el siglo XXI.',
    icon: IconComputer,
    accent: 'text-sky-600 dark:text-sky-300',
    bgAccent: 'bg-sky-50 dark:bg-sky-900/30',
    iconRing: 'bg-sky-100 dark:bg-sky-800/40',
  },
  {
    id: 'deportivo',
    title: 'Complejo Deportivo',
    description: 'Múltiples canchas de usos diversos para baloncesto, fútbol y voleibol, fomentando el trabajo en equipo y la salud física.',
    icon: IconSport,
    accent: 'text-emerald-600 dark:text-emerald-300',
    bgAccent: 'bg-emerald-50 dark:bg-emerald-900/30',
    iconRing: 'bg-emerald-100 dark:bg-emerald-800/40',
  },
  {
    id: 'aulaMagna',
    title: 'Aula Magna',
    description: 'Espacio emblemático para conferencias, actos culturales y ceremonias de graduación de alto nivel.',
    icon: IconStage,
    accent: 'text-amber-600 dark:text-amber-300',
    bgAccent: 'bg-amber-50 dark:bg-amber-900/30',
    iconRing: 'bg-amber-100 dark:bg-amber-800/40',
  },
  {
    id: 'comedor',
    title: 'Comedor Escolar',
    description: 'Área nutricional supervisada con menús balanceados y estrictas normas de higiene para nuestra comunidad.',
    icon: IconDining,
    accent: 'text-orange-600 dark:text-orange-300',
    bgAccent: 'bg-orange-50 dark:bg-orange-900/30',
    iconRing: 'bg-orange-100 dark:bg-orange-800/40',
  },
  {
    id: 'areasVerdes',
    title: 'Áreas Verdes',
    description: 'Espacios recreativos al aire libre rodeados de naturaleza, ideales para el descanso y la socialización entre clases.',
    icon: IconTree,
    accent: 'text-green-600 dark:text-green-300',
    bgAccent: 'bg-green-50 dark:bg-green-900/30',
    iconRing: 'bg-green-100 dark:bg-green-800/40',
  },
  {
    id: 'secretaria',
    title: 'Secretaría',
    description: 'Atención administrativa eficiente y personalizada para trámites estudiantiles y comunicación con representantes.',
    icon: IconOffice,
    accent: 'text-slate-600 dark:text-slate-300',
    bgAccent: 'bg-slate-50 dark:bg-slate-800/30',
    iconRing: 'bg-slate-100 dark:bg-slate-700/40',
  },
];

const STATS = [
  { value: '8', label: 'Espacios Especializados', Icon: IconBuilding },
  { value: '1,200+', label: 'Estudiantes Activos', Icon: IconUsers },
  { value: '25+', label: 'Años de Excelencia', Icon: IconStar },
  { value: '12', label: 'Eventos Anuales', Icon: IconCalendar },
];

/* ─── Facility Card ─────────────────────────────────────────────────── */
function FacilityCard({ facility }) {
  const { title, description, icon: Icon, accent, bgAccent, iconRing } = facility;
  return (
    <div className={`group flex flex-col gap-5 p-7 rounded-3xl ${bgAccent} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
      <div className={`w-12 h-12 ${iconRing} rounded-2xl flex items-center justify-center ${accent}`}>
        <Icon />
      </div>
      <div>
        <h3 className="font-headline font-bold text-on-surface text-xl mb-2">{title}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default function InstalacionesPage() {
  useDocumentTitle('Instalaciones');
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    galleryService.getPublic().then(imgs => setPhotos(imgs.slice(0, 5))).catch(() => {});
  }, []);

  return (
    <div className="bg-surface min-h-screen font-body">
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-primary/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary-container/40 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5 border border-primary/15">
            <IconBuilding />
            <span>Campus Institucional</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-on-surface tracking-tight mb-5 leading-[0.92]">
            Nuestras
            <br />
            <span className="text-primary">Instalaciones</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Espacios Diseñados para Aprender
          </p>
          <p className="text-base text-on-surface-variant max-w-xl mt-3 leading-relaxed">
            Nuestra institución ofrece una gama completa de instalaciones especializadas para garantizar que cada estudiante encuentre su camino al éxito.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pb-20 md:pb-28 space-y-16 md:space-y-24">

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label, Icon }) => (
            <div key={label} className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-surface-container-lowest shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon />
              </div>
              <span className="font-headline text-3xl font-black text-primary">{value}</span>
              <span className="text-xs text-on-surface-variant text-center font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Facilities Grid ── */}
        <section>
          <div className="mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-3">
              Espacios Diseñados
              <span className="text-primary"> para Aprender</span>
            </h2>
            <p className="text-on-surface-variant max-w-xl">
              Cada rincón de nuestro campus fue pensado para impulsar el aprendizaje, la creatividad y el bienestar estudiantil.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FACILITIES.map(f => <FacilityCard key={f.id} facility={f} />)}
          </div>
        </section>

        {/* ── Photo Gallery Strip ── */}
        {photos.length > 0 && (
          <section>
            <h2 className="font-headline text-3xl font-black text-on-surface tracking-tight mb-8">
              Galería del Campus
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {photos.map((photo, i) => (
                <div key={photo.id || i}
                  className={`relative overflow-hidden rounded-2xl bg-surface-container ${i === 0 ? 'row-span-2 md:col-span-2' : ''}`}
                  style={{ aspectRatio: i === 0 ? '4/3' : '1/1' }}
                >
                  {photo.image_url && (
                    <img src={photo.image_url} alt={photo.titulo || 'Instalación'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-sm font-semibold">{photo.titulo}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Visit CTA ── */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#005bbf] to-[#004a9e] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full -mb-10" />
          </div>
          <div className="relative px-10 md:px-16 py-16 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6">
                <IconMapPin />
              </div>
              <h2 className="font-headline text-3xl md:text-4xl font-black text-white mb-4">
                ¿Tienes preguntas sobre nuestras instalaciones?
              </h2>
              <p className="text-white/80 leading-relaxed max-w-md">
                Contáctanos para resolver cualquier duda o agenda una visita guiada a nuestro campus.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a href="/contacto"
                className="flex items-center justify-center gap-2 bg-white text-[#005bbf] font-bold px-8 py-3.5 rounded-full hover:bg-white/90 transition-colors shadow-lg whitespace-nowrap">
                Contáctanos
                <IconArrowRight />
              </a>
              <a href="/#mapa"
                className="flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap">
                Ver en el Mapa
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
