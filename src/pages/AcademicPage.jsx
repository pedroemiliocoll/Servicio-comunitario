// src/pages/AcademicPage.jsx — Oferta Académica · Stitch faithful
import { useState } from 'react';
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import Chatbot from '../views/chatbot/Chatbot';
import { useDocumentTitle } from '../controllers/useDocumentTitle';

/* ─── SVG Icons ─────────────────────────────────────────────────────── */
const IconBook        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IconGradCap     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconCpu         = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>;
const IconMusicNote   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
const IconActivity    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconBookOpen    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const IconMask        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const IconLeaf        = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 8C8 10 5.9 16.17 3.82 19.34A.5.5 0 0 0 4.28 20c5.5-1 10.5-3.5 13-10z"/><line x1="3" y1="21" x2="17" y2="8"/></svg>;
const IconFileText    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IconId          = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="12" y1="10" x2="12" y2="14"/><path d="M16 10v2a2 2 0 0 1-2 2h-1"/></svg>;
const IconCamera      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconAward       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IconMessageCircle = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconArrowRight  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconClock       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconCheck       = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>;

/* ─── Data ───────────────────────────────────────────────────────────── */
const LEVELS = [
  {
    id: 'primaria',
    title: 'Educación Primaria',
    subtitle: 'Fundamentos para el éxito',
    description: 'Formación integral con enfoque en lecto-escritura, matemáticas y ciencias naturales, desarrollando habilidades esenciales para la vida y el aprendizaje continuo.',
    grades: ['1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado'],
    schedule: 'Lunes a Viernes · 7:00 AM – 12:00 PM',
    Icon: IconBook,
    gradient: 'from-sky-500 to-cyan-400',
    highlights: ['Arte y Cultura', 'Educación Física', 'Valores', 'Matemáticas Lúdicas'],
  },
  {
    id: 'media',
    title: 'Educación Media General',
    subtitle: 'Preparación para la universidad',
    description: 'Bachillerato con mención en Ciencias. Preparación rigurosa para la educación universitaria con énfasis en ciencias exactas, humanidades y formación ciudadana integral.',
    grades: ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'],
    schedule: 'Lunes a Viernes · 7:00 AM – 1:00 PM',
    Icon: IconGradCap,
    gradient: 'from-primary to-primary-container',
    highlights: ['Ciencias Exactas', 'Humanidades', 'Laboratorio', 'Orientación Vocacional'],
  },
];

const EXTRACURRICULAR = [
  { name: 'Robótica',         desc: 'Desarrollo de pensamiento lógico y programación aplicada.',           Icon: IconCpu,       color: 'sky' },
  { name: 'Banda Marcial',    desc: 'Disciplina y coordinación a través de la música orquestal.',          Icon: IconMusicNote,  color: 'violet' },
  { name: 'Fútbol',           desc: 'Trabajo en equipo y condición física en nuestras canchas.',           Icon: IconActivity,   color: 'emerald' },
  { name: 'Lectura',          desc: 'Club literario para fomentar el análisis y la imaginación.',           Icon: IconBookOpen,   color: 'amber' },
  { name: 'Teatro',           desc: 'Expresión corporal y artes escénicas para la confianza.',             Icon: IconMask,       color: 'rose' },
  { name: 'Brigada Ambiental',desc: 'Conciencia ecológica y cuidado de nuestras áreas verdes.',           Icon: IconLeaf,       color: 'green' },
];

const ENROLLMENT_STEPS = [
  { num: '01', title: 'Partida de Nacimiento', desc: 'Original y copia legible (Actualizada).', Icon: IconFileText },
  { num: '02', title: 'Cédula de Identidad',   desc: 'Copia del estudiante y representantes legales.', Icon: IconId },
  { num: '03', title: 'Fotos Tipo Carnet',      desc: '4 fotos recientes de frente con fondo blanco.', Icon: IconCamera },
  { num: '04', title: 'Certificado de Calificaciones', desc: 'Notas certificadas del plantel de procedencia.', Icon: IconAward },
];

const COLOR_MAP = {
  sky: { card: 'bg-sky-50 dark:bg-sky-900/20 dark:border dark:border-sky-800/50', icon: 'bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-300', text: 'text-sky-700 dark:text-sky-200', tag: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300' },
  violet: { card: 'bg-violet-50 dark:bg-violet-900/20 dark:border dark:border-violet-800/50', icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300', text: 'text-violet-700 dark:text-violet-200', tag: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' },
  emerald: { card: 'bg-emerald-50 dark:bg-emerald-900/20 dark:border dark:border-emerald-800/50', icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300', text: 'text-emerald-700 dark:text-emerald-200', tag: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' },
  amber: { card: 'bg-amber-50 dark:bg-amber-900/20 dark:border dark:border-amber-800/50', icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300', text: 'text-amber-700 dark:text-amber-200', tag: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
  rose: { card: 'bg-rose-50 dark:bg-rose-900/20 dark:border dark:border-rose-800/50', icon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300', text: 'text-rose-700 dark:text-rose-200', tag: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
  green: { card: 'bg-green-50 dark:bg-green-900/20 dark:border dark:border-green-800/50', icon: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300', text: 'text-green-700 dark:text-green-200', tag: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' },
};

export default function AcademicPage() {
  useDocumentTitle('Oferta Académica');
  const [activeLevel, setActiveLevel] = useState(0);
  const level = LEVELS[activeLevel];

  return (
    <div className="bg-surface min-h-screen font-body">
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-0 w-[480px] h-[480px] bg-primary/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-secondary-container/40 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5 border border-primary/15">
            <IconGradCap />
            <span>Formación de Calidad</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-on-surface tracking-tight leading-[0.92] mb-5">
            Oferta
            <br />
            <span className="text-primary">Académica</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Formamos líderes con valores integrales y excelencia académica. Nuestra institución ofrece un entorno seguro y tecnológicamente avanzado para el desarrollo de futuros profesionales.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pb-20 md:pb-28 space-y-16 md:space-y-24">

        {/* ── Niveles Educativos ── */}
        <section>
          <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-10">
            Niveles Educativos
          </h2>

          {/* Tab switcher */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {LEVELS.map((l, i) => (
              <button key={l.id} onClick={() => setActiveLevel(i)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  activeLevel === i
                    ? 'bg-[#005bbf] text-white shadow-lg shadow-primary/25'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <div className={activeLevel === i ? 'text-white' : 'text-on-surface-variant'}>
                  <l.Icon />
                </div>
                {l.title}
              </button>
            ))}
          </div>

          {/* Active level detail card */}
          <div className="rounded-3xl overflow-hidden shadow-sm">
            {/* Gradient header */}
            <div className={`bg-gradient-to-r ${level.gradient} p-10 text-white`}>
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                    <level.Icon />
                  </div>
                  <h3 className="font-headline text-3xl font-black text-white">{level.title}</h3>
                  <p className="text-white/80 font-medium mt-1">{level.subtitle}</p>
                  <div className="flex items-center gap-2 mt-3 text-white/70 text-sm">
                    <IconClock />
                    {level.schedule}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 max-w-xs">
                  {level.highlights.map(h => (
                    <span key={h} className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      <IconCheck />
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Body */}
            <div className="bg-surface-container-lowest p-10">
              <p className="text-on-surface-variant leading-relaxed mb-8">{level.description}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                Grados / Años
              </p>
              <div className="flex flex-wrap gap-2">
                {level.grades.map(g => (
                  <span key={g} className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Actividades Extracurriculares ── */}
        <section>
          <div className="mb-10">
            <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface tracking-tight mb-3">
              Actividades Extracurriculares
            </h2>
            <p className="text-on-surface-variant max-w-xl">
              Complementamos la formación académica con espacios de recreación, arte y deporte para potenciar el talento de nuestros estudiantes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXTRACURRICULAR.map(ec => {
              const c = COLOR_MAP[ec.color];
              return (
                <div key={ec.name} className={`flex flex-col gap-4 p-6 rounded-3xl ${c.card} hover:-translate-y-1 transition-all duration-300`}>
                  <div className={`w-11 h-11 rounded-2xl ${c.icon} flex items-center justify-center`}>
                    <ec.Icon />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface text-lg mb-1">{ec.name}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{ec.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Proceso de Inscripción + Ayuda ── */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div>
            <h2 className="font-headline text-4xl font-black text-on-surface tracking-tight mb-3">
              Proceso de Inscripción
            </h2>
            <p className="text-on-surface-variant mb-8">
              Sigue estos pasos para formar parte de nuestra comunidad estudiantil.
            </p>
            <div className="space-y-4">
              {ENROLLMENT_STEPS.map(step => (
                <div key={step.num} className="flex items-start gap-5 p-5 rounded-2xl bg-surface-container-lowest shadow-sm">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                    <span className="text-white text-xs font-black">{step.num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="text-primary">
                        <step.Icon />
                      </div>
                      <h3 className="font-semibold text-on-surface text-sm">{step.title}</h3>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help CTA */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#005bbf] to-[#004a9e] p-10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <IconMessageCircle />
              </div>
                <h3 className="font-headline text-2xl font-black mb-2 text-white">¿Necesitas Ayuda?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-8">
                Nuestro asistente inteligente está disponible 24/7 para resolver tus dudas sobre el proceso de inscripción y la oferta académica.
              </p>
              <div className="space-y-3">
                <a href="/contacto"
                  className="flex items-center justify-center gap-2 w-full bg-white text-[#005bbf] font-bold py-3.5 rounded-full hover:bg-white/90 transition-colors shadow-lg">
                  Escríbenos
                  <IconArrowRight />
                </a>
                <button onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                  className="flex items-center justify-center gap-2 w-full border border-white/40 text-white font-semibold py-3.5 rounded-full hover:bg-white/10 transition-colors">
                  Consultar al Asistente IA
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
