// src/pages/CreditsPage.jsx — Créditos del Sistema
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import { useDocumentTitle } from '../controllers/useDocumentTitle';

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
const IconCode    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const IconUser    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconAward   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IconSchool  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconHeart   = () => <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-4 h-4 text-rose-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IconBadge   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

/* ─── Data ───────────────────────────────────────────────────────────── */
const TEAM = [
    { name: 'Fabiana Rodríguez', ci: 'C.I: 30.718.413', initials: 'FR', color: 'from-violet-500 to-purple-600', role: 'Desarrolladora' },
    { name: 'Yeismar Ruiz',      ci: 'C.I: 31.068.292', initials: 'YR', color: 'from-sky-500 to-cyan-600',    role: 'Desarrolladora' },
    { name: 'Benjamín Dumont',   ci: 'C.I: 29.731.619', initials: 'BD', color: 'from-emerald-500 to-teal-600', role: 'Desarrollador' },
    { name: 'Samuel Jiménez',    ci: 'C.I: 31.192.094', initials: 'SJ', color: 'from-[#005bbf] to-[#004a9e]', role: 'Desarrollador' },
    { name: 'Roiner Martínez',   ci: 'C.I: 31.228.873', initials: 'RM', color: 'from-amber-500 to-orange-600', role: 'Desarrollador' },
];

/* ─── Member Card ────────────────────────────────────────────────────── */
function MemberCard({ member, index }) {
    return (
        <div
            className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Avatar */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg shrink-0`}>
                <span className="text-white font-headline font-black text-2xl">{member.initials}</span>
            </div>

            {/* Info */}
            <div className="text-center">
                <h3 className="font-headline font-black text-on-surface text-base leading-tight mb-1">
                    {member.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                    <IconCode />
                    {member.role}
                </span>
                <p className="text-xs text-on-surface-variant font-mono font-semibold">{member.ci}</p>
            </div>
        </div>
    );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function CreditsPage() {
    useDocumentTitle('Créditos del Sistema');

    return (
        <div className="bg-surface min-h-screen font-body">
            <Header />

            {/* ── Hero ── */}
            <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute -top-20 right-0 w-[440px] h-[440px] bg-primary/6 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/15">
                        <IconCode />
                        <span>Servicio Comunitario</span>
                    </div>
                    <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black text-on-surface tracking-tight leading-[0.92] mb-5">
                        Créditos del
                        <br />
                        <span className="text-primary">Sistema</span>
                    </h1>
                    <p className="text-base md:text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                        Este portal fue desarrollado como proyecto de Servicio Comunitario por estudiantes de la
                        <strong className="text-on-surface"> Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI)</strong>,
                        como aporte educativo a la comunidad.
                    </p>
                </div>
            </section>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28 space-y-16 md:space-y-20">

                {/* ── UNETI Banner ── */}
                <section>
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#005bbf] to-[#003d82] p-8 md:p-12 text-white">
                        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none" aria-hidden="true" />
                        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-white/5 rounded-full -mb-12 pointer-events-none" aria-hidden="true" />
                        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                <IconSchool />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Aporte Educativo</p>
                                <h2 className="font-headline text-2xl md:text-3xl font-black text-white mb-3">
                                    Universidad Nacional Experimental de las Telecomunicaciones e Informática
                                </h2>
                                <p className="text-white/80 font-bold text-lg">UNETI</p>
                                <p className="text-white/60 text-sm mt-2 max-w-lg">
                                    Institución de educación superior venezolana comprometida con la formación tecnológica
                                    y el desarrollo de proyectos de impacto comunitario.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Team ── */}
                <section>
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/15">
                            <IconUser />
                            <span>Equipo de Desarrollo</span>
                        </div>
                        <h2 className="font-headline text-3xl md:text-4xl font-black text-on-surface tracking-tight mb-3">
                            Autores del Proyecto
                        </h2>
                        <p className="text-on-surface-variant max-w-md mx-auto">
                            Estudiantes responsables del diseño, desarrollo e implementación de este sistema web.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {TEAM.map((member, index) => (
                            <MemberCard key={member.ci} member={member} index={index} />
                        ))}
                    </div>
                </section>

                {/* ── Tutora Académica ── */}
                <section>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="md:w-72 shrink-0">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4 border border-amber-200 dark:border-amber-700/30">
                                <IconAward />
                                <span>Tutora Académica</span>
                            </div>
                            <h2 className="font-headline text-2xl md:text-3xl font-black text-on-surface tracking-tight">
                                Supervisión y Guía
                            </h2>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-5 p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-sm">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shrink-0">
                                    <span className="text-white font-headline font-black text-xl">MM</span>
                                </div>
                                <div>
                                    <h3 className="font-headline font-black text-on-surface text-xl mb-1">
                                        Maribel Moreno
                                    </h3>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold">
                                        <IconAward />
                                        Tutora Académica — UNETI
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Tech Stack ── */}
                <section className="rounded-3xl bg-surface-container-lowest border border-outline-variant/10 p-8 md:p-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <IconCode />
                        </div>
                        <h2 className="font-headline text-2xl font-black text-on-surface">Tecnologías Utilizadas</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {[
                            { name: 'React 19',         color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' },
                            { name: 'Vite',             color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' },
                            { name: 'Tailwind CSS',     color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
                            { name: 'Node.js + Express',color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
                            { name: 'SQLite (Turso)',   color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
                            { name: 'Groq AI',          color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
                            { name: 'React Router DOM', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' },
                            { name: 'Chart.js',         color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
                        ].map(tech => (
                            <div key={tech.name} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold ${tech.color}`}>
                                <IconBadge />
                                <span>{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Footer note ── */}
                <section className="text-center">
                    <p className="text-on-surface-variant text-sm flex flex-wrap items-center justify-center gap-1.5">
                        Desarrollado con
                        <IconHeart />
                        para la <strong className="text-on-surface">U.E.N. Pedro Emilio Coll</strong> ·
                        <span>{new Date().getFullYear()}</span>
                    </p>
                    <p className="text-xs text-on-surface-variant/60 mt-2">
                        Proyecto de Servicio Comunitario — UNETI
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}
