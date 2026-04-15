// src/pages/ContactPage.jsx — Formulario de contacto público (reescrito con Tailwind)
import { useState } from 'react';
import Header from '../views/layout/Header';
import Footer from '../views/layout/Footer';
import Chatbot from '../views/chatbot/Chatbot';
import { contactService } from '../services/contactService.js';
import { useDocumentTitle } from '../controllers/useDocumentTitle';
import { useLiceoInfo } from '../context/LiceoContext';

const SUBJECTS = [
    { value: 'general',       label: 'Consulta general' },
    { value: 'inscripciones', label: 'Inscripciones' },
    { value: 'academico',     label: 'Asuntos académicos' },
    { value: 'docente',       label: 'Información de docentes' },
    { value: 'otro',          label: 'Otro asunto' },
];

export default function ContactPage() {
    const { liceoInfo } = useLiceoInfo();
    const [form, setForm] = useState({ nombre: '', email: '', asunto: 'general', mensaje: '' });
    const [status, setStatus] = useState(null);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({});

    useDocumentTitle(`Contacto | ${liceoInfo.nombre}`);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleBlur = e => setTouched(t => ({ ...t, [e.target.name]: true }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorId = 'contact-page-error';
        if (!form.nombre.trim() || !form.email.trim() || !form.mensaje.trim()) {
            setError('Por favor completa todos los campos requeridos.');
            setTouched({ nombre: true, email: true, mensaje: true });
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
        <>
            <Header />
            <main id="main-content" className="bg-surface min-h-screen pt-16">
                {/* Page Banner */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary-container text-on-primary text-center px-4 sm:px-8">
                    <span className="material-symbols-outlined text-4xl md:text-5xl mb-3 block text-white" style={{ fontVariationSettings: "'FILL' 1"}}>mail</span>
                    <h1 className="text-3xl md:text-5xl font-headline font-black tracking-tighter mb-3 text-white">Contáctanos</h1>
                    <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto">Estamos aquí para ayudarte. Escríbenos y te responderemos a la brevedad.</p>
                </section>

                <section className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
                        {/* Form Card */}
                        <div className="lg:col-span-3 bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant/20 p-8">
                            <h2 className="text-2xl font-headline font-bold text-on-surface mb-6">Formulario de Contacto</h2>

                            {status === 'done' ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                                    <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-on-primary-fixed text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    </div>
                                    <h3 className="font-headline font-bold text-2xl text-on-surface mb-2 mt-4">¡Mensaje Enviado!</h3>
                                    <p className="text-on-surface-variant max-w-sm mx-auto">
                                        Hemos recibido tu consulta correctamente. Te contactaremos pronto.
                                    </p>
                                    <button
                                        onClick={() => setStatus(null)}
                                        className="mt-2 bg-[#005bbf] text-white font-bold px-8 py-3 rounded-full hover:bg-[#004a9e] transition-colors cursor-pointer"
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5" aria-label="Formulario de contacto">
                                    {error && (
                                        <div id="contact-page-error" role="alert" tabIndex="-1" className="bg-error-container text-error text-sm px-4 py-3 rounded-xl">⚠️ {error}</div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="nombre" className="block text-sm font-semibold text-on-surface-variant mb-1.5">Nombre completo *</label>
                                            <input 
                                                id="nombre" 
                                                name="nombre" 
                                                value={form.nombre} 
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                aria-invalid={touched.nombre && !form.nombre.trim() ? 'true' : 'false'}
                                                aria-describedby={touched.nombre && !form.nombre.trim() ? 'nombre-error' : undefined}
                                                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition" 
                                                placeholder="Juan Pérez" 
                                                required 
                                                aria-required="true" 
                                            />
                                            {touched.nombre && !form.nombre.trim() && (
                                                <p id="nombre-error" className="text-error text-xs mt-1">El nombre es requerido</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant mb-1.5">Correo electrónico *</label>
                                            <input 
                                                id="email" 
                                                name="email" 
                                                type="email" 
                                                value={form.email} 
                                                onChange={handleChange} 
                                                onBlur={handleBlur}
                                                aria-invalid={touched.email && !form.email.trim() ? 'true' : 'false'}
                                                aria-describedby={touched.email && !form.email.trim() ? 'email-error' : undefined}
                                                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition" 
                                                placeholder="correo@ejemplo.com" 
                                                required 
                                                aria-required="true" 
                                            />
                                            {touched.email && !form.email.trim() && (
                                                <p id="email-error" className="text-error text-xs mt-1">El correo es requerido</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="asunto" className="block text-sm font-semibold text-on-surface-variant mb-1.5">Asunto</label>
                                        <select id="asunto" name="asunto" value={form.asunto} onChange={handleChange} className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
                                            {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="mensaje" className="block text-sm font-semibold text-on-surface-variant mb-1.5">Mensaje *</label>
                                        <textarea 
                                            id="mensaje" 
                                            name="mensaje" 
                                            rows="6" 
                                            value={form.mensaje} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            aria-invalid={touched.mensaje && !form.mensaje.trim() ? 'true' : 'false'}
                                            aria-describedby={touched.mensaje && !form.mensaje.trim() ? 'mensaje-error' : undefined}
                                            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none" 
                                            placeholder="Escribe tu consulta aquí..." 
                                            required 
                                            aria-required="true"
                                        ></textarea>
                                        {touched.mensaje && !form.mensaje.trim() && (
                                            <p id="mensaje-error" className="text-error text-xs mt-1">El mensaje es requerido</p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full bg-[#005bbf] text-white font-bold py-4 rounded-xl hover:bg-[#004a9e] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                                        {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-outline-variant/20 p-8">
                                <h3 className="font-headline font-bold text-lg text-on-surface mb-6">Información de Contacto</h3>
                                <div className="space-y-5">
                                    {[
                                        { icon: 'location_on', label: 'Dirección',  text: liceoInfo.direccion },
                                        { icon: 'call',        label: 'Teléfono',   text: liceoInfo.telefono },
                                        { icon: 'mail',        label: 'Email',      text: liceoInfo.email },
                                        { icon: 'schedule',    label: 'Horario',    text: `Lunes a Viernes, ${liceoInfo.horarios.entrada} – ${liceoInfo.horarios.salida}` },
                                    ].map(item => (
                                        <div key={item.icon} className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-0.5">{item.label}</p>
                                                <p className="text-on-surface text-sm font-medium">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#005bbf] rounded-[2rem] p-8 text-white">
                                <span className="material-symbols-outlined text-4xl mb-3 block text-white" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                                <h4 className="font-headline font-bold text-lg mb-2 text-white">¿Respuesta inmediata?</h4>
                                <p className="text-white/80 text-sm mb-4">Usa nuestro chatbot Coll-Bot para resolver dudas al instante.</p>
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                                    className="bg-white text-[#005bbf] font-bold px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors cursor-pointer text-sm"
                                >
                                    Abrir Coll-Bot
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <Chatbot />
        </>
    );
}
