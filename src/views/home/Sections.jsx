import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsGrid, NewsHero } from '../news/NewsComponents';
import { contactService } from '../../services/contactService.js';
import { useLiceoInfo } from '../../context/LiceoContext';

export function NewsSector({ previewNews = [] }) {
    return (
        <section className="py-[var(--section-padding)] bg-surface" id="news">
            <div className="max-w-7xl mx-auto px-[var(--container-padding)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">Actualidad &amp; Prensa</span>
                        <h2 className="text-3xl md:text-5xl font-headline font-black text-on-surface mb-4 tracking-tighter">Novedades Institucionales</h2>
                        <p className="text-on-surface-variant font-medium leading-relaxed">
                            Mantente informado sobre los hitos académicos, eventos deportivos y comunicados oficiales de nuestra comunidad educativa.
                        </p>
                    </div>
                    <Link to="/noticias" className="group flex items-center gap-3 bg-surface-container-high px-6 py-3.5 rounded-full text-on-surface font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 shadow-sm">
                        Explorar Hemeroteca
                        <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                </div>

                {previewNews.length > 0 && (
                    <div className="mb-12">
                        <NewsHero item={previewNews[0]} onSelect={() => window.location.href = '/noticias'} />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {previewNews.slice(1, 3).map((item, i) => (
                        <article
                            key={i}
                            className="bg-surface-container-low p-5 md:p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 md:gap-8 items-center group cursor-pointer hover:bg-surface-container-high transition-all duration-500"
                            onClick={() => window.location.href = '/noticias'}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (window.location.href = '/noticias')}
                            tabIndex="0"
                            role="button"
                            aria-label={`Ver noticia: ${item.titulo}`}
                        >
                            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-700">
                                <img src={item.image_url} alt={item.titulo} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div>
                                <span className="text-primary font-black text-[10px] uppercase tracking-widest mb-2 block">{item.categoria}</span>
                                <h4 className="font-headline font-black text-xl mb-3 text-on-surface group-hover:text-primary transition-colors leading-tight">
                                    {item.titulo}
                                </h4>
                                <p className="text-sm text-on-surface-variant font-medium line-clamp-2 leading-relaxed">
                                    {item.extracto}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function BiographySector() {
    return (
        <section className="py-[var(--section-padding)] bg-surface overflow-hidden" id="about">
            <div className="max-w-7xl mx-auto px-[var(--container-padding)] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="relative">
                    <div className="relative z-10 rounded-3xl lg:rounded-full overflow-hidden border-[8px] md:border-[12px] border-surface-container-lowest shadow-2xl aspect-square max-w-[320px] md:max-w-md mx-auto">
                        <img alt="Pedro Emilio Coll" className="w-full h-full object-cover" src="/assets/images/pedro-emilio-coll.png" loading="lazy" />
                    </div>
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl -z-0"></div>
                </div>
                <div>
                    <h2 className="text-4xl font-headline font-extrabold text-on-surface mb-8">Nuestro Epónimo: Pedro Emilio Coll</h2>
                    <div className="space-y-6 text-on-surface-variant leading-relaxed">
                        <p>
                            Pedro Emilio Coll (1872–1947) fue un distinguido periodista, escritor, ensayista y político venezolano. Es considerado uno de los precursores del modernismo en Venezuela y el introductor del pensamiento cosmopolita en nuestras letras.
                        </p>
                        <p>
                            Su legado intelectual, marcado por la sutileza crítica y el rigor humanista, sirve como cimiento de los valores que impartimos en nuestra institución: la búsqueda constante de la verdad a través del conocimiento y el arte.
                        </p>
                        <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-on-surface font-medium">
                            "La educación es el único camino hacia la verdadera libertad del espíritu."
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Fix #11: Dispatch custom event instead of trying to reach chatbot DOM directly
export function AssistanceSector() {
    const openChatbot = () => window.dispatchEvent(new CustomEvent('open-chatbot'));

    return (
        <section className="py-[var(--section-padding)] bg-surface-container-low">
            <div className="max-w-7xl mx-auto px-[var(--container-padding)] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center text-center lg:text-left">
                <div className="order-2 lg:order-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-[10px] md:text-xs font-black tracking-widest mb-6 uppercase">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span> ASISTENTE VIRTUAL
                    </span>
                    <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface mb-6 leading-tight tracking-tighter">
                        ¿Dudas sobre el proceso de inscripción?
                    </h2>
                    <p className="text-on-surface-variant text-base md:text-lg mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Nuestro asistente inteligente "Coll-Bot" está disponible 24/7 para responder preguntas sobre requisitos, horarios, uniformes y más. Obtén respuestas instantáneas sin esperas.
                    </p>
                    <button onClick={openChatbot} className="bg-primary text-white px-8 py-4 rounded-xl font-headline font-bold flex items-center justify-center lg:justify-start gap-3 hover:bg-primary-container transition-all shadow-lg shadow-primary/20 active:scale-95 mx-auto lg:mx-0">
                        Chatear con Coll-Bot <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                    </button>
                </div>
                <div className="relative order-1 lg:order-2">
                    <div className="bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/10 max-w-[340px] md:max-w-md mx-auto scale-90 sm:scale-100 mb-8 lg:mb-0">
                        <div className="bg-primary p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Asistente Coll-Bot</h4>
                                <p className="text-blue-100 text-xs flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> En línea ahora
                                </p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4 bg-surface-container-low min-h-[300px]">
                            <div className="flex flex-col gap-2">
                                <div className="bg-[#005bbf] text-white p-3 rounded-2xl rounded-tl-none text-sm max-w-[80%]">
                                    ¡Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="bg-[#005bbf] text-white p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%] shadow-md">
                                    ¿Cuáles son los requisitos para primer año?
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="bg-[#005bbf] text-white p-3 rounded-2xl rounded-tl-none text-sm max-w-[85%]">
                                    Necesitarás: Partida de nacimiento original, copia de cédula del representante y notas certificadas.
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/20 flex items-center gap-3">
                            <div className="flex-1 bg-surface-container rounded-full px-4 py-2 text-on-surface-variant text-sm">
                                Escribe tu mensaje...
                            </div>
                            <button className="text-primary">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function MissionVisionSector() {
    return (
        <section className="py-[var(--section-padding)] bg-surface-container-low" id="academics">
            <div className="max-w-7xl mx-auto px-[var(--container-padding)] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[2rem] shadow-sm border border-outline-variant/5">
                    <div className="w-16 h-16 bg-primary-fixed dark:bg-primary flex items-center justify-center rounded-2xl mb-8 shadow-sm">
                        <span className="material-symbols-outlined text-primary dark:text-white text-3xl">flag</span>
                    </div>
                    <h3 className="text-3xl font-headline font-bold mb-6 text-on-surface">Nuestra Misión</h3>
                    <p className="text-on-surface-variant leading-relaxed text-lg">
                        Garantizar una educación de calidad que promueva el desarrollo de competencias cognitivas, sociales y éticas en los estudiantes, fomentando el pensamiento crítico y la responsabilidad ciudadana bajo los estándares pedagógicos más elevados.
                    </p>
                </div>
                <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[2rem] shadow-sm border border-outline-variant/5">
                    <div className="w-16 h-16 bg-primary-fixed dark:bg-primary flex items-center justify-center rounded-2xl mb-8 shadow-sm">
                        <span className="material-symbols-outlined text-primary dark:text-white text-3xl">visibility</span>
                    </div>
                    <h3 className="text-3xl font-headline font-bold mb-6 text-on-surface">Nuestra Visión</h3>
                    <p className="text-on-surface-variant leading-relaxed text-lg">
                        Ser una institución educativa de referencia nacional por su innovación pedagógica, la excelencia académica de sus egresados y su compromiso inquebrantable con la construcción de una sociedad más justa, culta y progresista.
                    </p>
                </div>
            </div>
        </section>
    );
}

// Fix #2: ContactSector form now has real state + submit via contactService
const SUBJECTS = [
    { value: 'general', label: 'Consulta general' },
    { value: 'inscripciones', label: 'Inscripciones' },
    { value: 'academico', label: 'Asuntos académicos' },
    { value: 'docente', label: 'Información de docentes' },
    { value: 'otro', label: 'Otro asunto' },
];

export function ContactSector() {
    const { liceoInfo } = useLiceoInfo();
    const [form, setForm] = useState({ nombre: '', email: '', asunto: 'general', mensaje: '' });
    const [status, setStatus] = useState(null); // null | 'sending' | 'done' | 'error'
    const [error, setError] = useState('');

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const [touched, setTouched] = useState({});

    const handleBlur = e => setTouched(t => ({ ...t, [e.target.name]: true }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorId = 'contact-home-error';
        if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
            setError('Por favor completa todos los campos requeridos.');
            document.getElementById(errorId)?.focus();
            return;
        }
        setError(''); setStatus('sending');
        try {
            await contactService.submit(form);
            setStatus('done');
            setForm({ nombre: '', email: '', asunto: 'general', mensaje: '' });
            setTouched({});
        } catch (err) {
            setError(err.message || 'Error al enviar. Inténtalo de nuevo.');
            setStatus('error');
        }
    };

    return (
        <section className="py-[var(--section-padding)] bg-surface" id="contact">
            <div className="max-w-7xl mx-auto px-[var(--container-padding)]">
                <div className="bg-primary text-on-primary rounded-[2.5rem] p-8 md:p-12 lg:p-20 relative overflow-hidden shadow-2xl shadow-primary/20">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-headline font-bold mb-6 text-on-primary">¿Necesitas información?</h2>
                            <p className="text-on-primary/80 text-lg mb-10">Estamos aquí para ayudarte. Contáctanos por cualquiera de nuestros canales oficiales.</p>
                            <div className="space-y-6">
                                {[
                                    ['call', liceoInfo.telefono], 
                                    ['mail', liceoInfo.email], 
                                    ['location_on', liceoInfo.direccion]
                                ].map(([icon, text]) => (
                                    <div key={icon} className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-on-primary/10 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined">{icon}</span>
                                        </div>
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-on-primary/5 backdrop-blur-md rounded-3xl p-8 border border-on-primary/10">
                            {status === 'done' ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                                    <div className="w-20 h-20 bg-on-primary/10 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-on-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    </div>
                                    <h3 className="font-headline font-bold text-2xl text-on-primary mb-2 mt-4">¡Mensaje Enviado!</h3>
                                    <p className="text-on-primary/80 max-w-sm mx-auto">
                                        Hemos recibido tu consulta correctamente. Te contactaremos pronto.
                                    </p>
                                    <button
                                        onClick={() => setStatus(null)}
                                        className="mt-2 bg-on-primary text-primary font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity cursor-pointer"
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <form className="space-y-4" onSubmit={handleSubmit} aria-label="Formulario de contacto">
                                    {error && (
                                        <div id="contact-home-error" role="alert" tabIndex="-1" className="bg-white/20 border border-white/30 text-white text-sm px-4 py-3 rounded-xl">⚠️ {error}</div>
                                    )}
                                    <div>
                                        <label htmlFor="contact-nombre" className="block text-sm font-medium mb-1 opacity-90 text-white">Nombre Completo *</label>
                                        <input 
                                            id="contact-nombre" 
                                            name="nombre" 
                                            value={form.nombre} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            aria-invalid={touched.nombre && !form.nombre.trim() ? 'true' : 'false'}
                                            aria-describedby={touched.nombre && !form.nombre.trim() ? 'contact-nombre-error' : undefined}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" 
                                            placeholder="Ej. Juan Pérez" 
                                            type="text" 
                                            required 
                                            aria-required="true" 
                                        />
                                        {touched.nombre && !form.nombre.trim() && (
                                            <p id="contact-nombre-error" className="text-red-300 text-xs mt-1">El nombre es requerido</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block text-sm font-medium mb-1 opacity-90 text-white">Correo Electrónico *</label>
                                        <input 
                                            id="contact-email" 
                                            name="email" 
                                            value={form.email} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            aria-invalid={touched.email && !form.email.trim() ? 'true' : 'false'}
                                            aria-describedby={touched.email && !form.email.trim() ? 'contact-email-error' : undefined}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" 
                                            placeholder="juan@ejemplo.com" 
                                            type="email" 
                                            required 
                                            aria-required="true" 
                                        />
                                        {touched.email && !form.email.trim() && (
                                            <p id="contact-email-error" className="text-red-300 text-xs mt-1">El correo es requerido</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="contact-asunto" className="block text-sm font-medium mb-1 opacity-90 text-white">Asunto</label>
                                        <select id="contact-asunto" name="asunto" value={form.asunto} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/40 [&>option]:bg-surface [&>option]:text-on-surface">
                                            {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="contact-mensaje" className="block text-sm font-medium mb-1 opacity-90 text-white">Mensaje *</label>
                                        <textarea 
                                            id="contact-mensaje" 
                                            name="mensaje" 
                                            value={form.mensaje} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            aria-invalid={touched.mensaje && !form.mensaje.trim() ? 'true' : 'false'}
                                            aria-describedby={touched.mensaje && !form.mensaje.trim() ? 'contact-mensaje-error' : undefined}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40" 
                                            placeholder="Escribe tu consulta aquí..." 
                                            rows="4" 
                                            required 
                                            aria-required="true"
                                        ></textarea>
                                        {touched.mensaje && !form.mensaje.trim() && (
                                            <p id="contact-mensaje-error" className="text-red-300 text-xs mt-1">El mensaje es requerido</p>
                                        )}
                                    </div>
                                    <button type="submit" disabled={status === 'sending'} className="w-full bg-white text-[#005bbf] font-bold py-4 rounded-xl hover:bg-white/90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                                        {status === 'sending' ? '⏳ Enviando...' : '📨 Enviar Mensaje'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                </div>
            </div>
        </section>
    );
}

export function MapSector() {
    const { liceoInfo } = useLiceoInfo();
    return (
        <section className="py-[var(--section-padding)] bg-surface-container-low" id="location">
            <div className="max-w-7xl mx-auto px-[var(--container-padding)]">
                <div className="text-center mb-12 md:mb-16">
                    <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-4 block">Ubicación</span>
                    <h2 className="text-3xl md:text-5xl font-headline font-black text-on-surface mb-4 tracking-tighter">Encuéntranos</h2>
                    <p className="text-on-surface-variant font-medium leading-relaxed max-w-2xl mx-auto">
                        Estamos ubicados en {liceoInfo.direccion}.
                    </p>
                </div>
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-outline-variant/10">
                    <iframe
                        title="Ubicación UEN Pedro Emilio Coll"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.5!2d-66.9226658!3d10.450836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2af5f3f4e3fd07%3A0x45e2100c8cf9d884!2sUEN%20%22Pedro%20Emilio%20Coll%22!5e0!3m2!1ses!2sve!4v1700000000000!5m2!1ses!2sve"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-fixed dark:bg-primary rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary dark:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                        </div>
                        <div>
                            <p className="font-headline font-bold text-on-surface text-sm">Dirección</p>
                            <p className="text-on-surface-variant text-sm">{liceoInfo.direccion}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-fixed dark:bg-primary rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary dark:text-white" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                        </div>
                        <div>
                            <p className="font-headline font-bold text-on-surface text-sm">Horario</p>
                            <p className="text-on-surface-variant text-sm">Lunes a Viernes, {liceoInfo.horarios.entrada} – {liceoInfo.horarios.salida}</p>
                        </div>
                    </div>
                    <a
                        href="https://maps.app.goo.gl/9JiH8o9rGaLNb2a4A"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#005bbf] text-white px-6 py-3 rounded-full font-headline font-bold text-sm hover:bg-[#004a9e] transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">directions</span>
                        Cómo llegar
                    </a>
                </div>
            </div>
        </section>
    );
}
