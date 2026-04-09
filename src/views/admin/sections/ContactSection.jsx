import React, { useState, useEffect, useCallback } from 'react';
import { useContactMessages } from '../../../controllers/useAdminController';
import ConfirmDialog from '../../ui/ConfirmDialog';

const QUICK_REPLIES = [
    { label: 'Gracias por contactarnos', text: 'Gracias por contactarnos. Hemos recibido su mensaje y pronto le responderemos.' },
    { label: 'Información recibida', text: 'Su mensaje ha sido recibido. Estamos revisando su consulta y le contestaremos en breve.' },
    { label: 'Llamar a oficina', text: 'Para mayor información, por favor comuníquese directamente con nuestra oficina en el horario de atención.' },
    { label: 'Inscripciones abiertas', text: 'Le informamos que las inscripciones para el próximo año escolar se encuentran abiertas. Puede acercarse a nuestras oficinas para más detalles.' },
];

export default function ContactSection({ showToast }) {
    const { messages, selected, setSelected, loading, markRead, markAllRead, remove, search, setSearch, filters, setFilters, refresh } = useContactMessages(showToast);
    const unread = messages.filter(m => !m.leido).length;
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [emailConfigured, setEmailConfigured] = useState(true);

    useEffect(() => {
        contactService.getEmailStatus().then(res => {
            setEmailConfigured(res.configured);
        }).catch(() => {});
    }, []);

    useEffect(() => {
        if (selected?.id) {
            loadReplies(selected.id);
        }
    }, [selected]);

    const loadReplies = async (messageId) => {
        try {
            const data = await contactService.getReplies(messageId);
            setReplies(data);
        } catch (err) {
            console.error('Error loading replies:', err);
        }
    };

    const handleDelete = () => {
        if (itemToDelete) {
            remove(itemToDelete);
            if (selected?.id === itemToDelete) setSelected(null);
            setItemToDelete(null);
            setShowConfirm(false);
        }
    };

    const handleReply = async (sendEmail = true) => {
        if (!replyText.trim() || !selected) return;
        
        setSendingReply(true);
        try {
            let result;
            if (sendEmail) {
                result = await contactService.reply(selected.id, replyText, true);
            } else {
                result = await contactService.replyOnly(selected.id, replyText);
            }
            setReplyText('');
            await loadReplies(selected.id);
            if (!sendEmail) {
                showToast('Borrador de respuesta guardado correctamente');
            } else {
                showToast(result.email?.sent ? 'Respuesta enviada por email' : 'Respuesta guardada pero email no enviado (revisa config)');
            }
        } catch (err) {
            showToast(err.message || 'Error al enviar respuesta', 'error');
        }
        setSendingReply(false);
    };

    const handleQuickReply = (text) => {
        setReplyText(text);
    };

    const handleExport = async () => {
        try {
            const data = await contactService.getAll();
            const csv = convertToCSV(data);
            downloadCSV(csv, `contact-messages-${new Date().toISOString().split('T')[0]}.csv`);
            showToast('Mensajes exportados correctamente');
        } catch (err) {
            showToast('Error al exportar', 'error');
        }
    };

    const convertToCSV = (data) => {
        const headers = ['Nombre', 'Email', 'Asunto', 'Mensaje', 'Leído', 'Fecha'];
        const rows = data.map(m => [
            m.nombre,
            m.email,
            m.asunto,
            m.mensaje.replace(/"/g, '""'),
            m.leido ? 'Sí' : 'No',
            m.timestamp
        ].map(v => `"${v}"`).join(','));
        return [headers.join(','), ...rows].join('\n');
    };

    const downloadCSV = (csv, filename) => {
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const clearFilters = () => {
        setSearch('');
        setFilters({ status: '', from: '', to: '' });
    };

    const hasFilters = search || filters.status || filters.from || filters.to;

    if (loading) return (
        <div className="flex items-center justify-center h-64 bg-surface-container-low rounded-3xl animate-pulse">
            <p className="text-primary font-bold uppercase tracking-widest">Abriendo Casillero Postal...</p>
        </div>
    );

    return (
        <>
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-black font-headline text-on-surface">Bandeja de Entrada</h3>
                    {unread > 0 && <span className="bg-error text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{unread} Pendientes</span>}
                </div>
                <div className="flex items-center gap-2">
                    {unread > 0 && (
                        <button onClick={markAllRead} className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">Marcar todos leídos</button>
                    )}
                    <button onClick={handleExport} className="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre, email o mensaje..."
                            className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 pl-12 text-sm font-bold"
                        />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                        className="bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold"
                    >
                        <option value="">Todos</option>
                        <option value="unread">No leídos</option>
                        <option value="read">Leídos</option>
                    </select>
                    <input
                        type="date"
                        value={filters.from}
                        onChange={(e) => setFilters(f => ({ ...f, from: e.target.value }))}
                        className="bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold"
                    />
                    <input
                        type="date"
                        value={filters.to}
                        onChange={(e) => setFilters(f => ({ ...f, to: e.target.value }))}
                        className="bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold"
                    />
                    {hasFilters && (
                        <button onClick={clearFilters} className="text-error font-bold text-xs uppercase tracking-widest hover:underline">
                            Limpiar
                        </button>
                    )}
                </div>
                {!emailConfigured && (
                    <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Email no configurado. Configure SMTP para enviar respuestas por email.
                    </div>
                )}
            </div>

            {/* Messages List and Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Messages List */}
                <div className={`lg:col-span-12 ${selected ? 'xl:col-span-5' : 'xl:col-span-12'} space-y-4`}>
                    {messages.length === 0 ? (
                        <div className="bg-surface-container-lowest p-20 rounded-[2.5rem] border border-outline-variant/5 text-center flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">mail_outline</span>
                            <p className="font-bold text-on-surface-variant/40">No hay mensajes{hasFilters ? ' que coincidan con los filtros' : ''}</p>
                            {hasFilters && <button onClick={clearFilters} className="text-primary font-bold text-sm">Limpiar filtros</button>}
                        </div>
                    ) : (
                        <div className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 overflow-hidden divide-y divide-surface-container-low">
                            {messages.map(m => (
                                <div 
                                    key={m.id} 
                                    onClick={() => { setSelected(m); markRead(m.id); }}
                                    className={`p-5 cursor-pointer transition-all flex justify-between items-center group ${
                                        selected?.id === m.id ? 'bg-primary-fixed shadow-inner translate-x-1' : 'hover:bg-surface-container-low'
                                    } ${!m.leido ? 'border-l-4 border-primary' : ''}`}
                                >
                                    <div className="flex-1 overflow-hidden pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            {!m.leido && <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>}
                                            <h5 className="font-black text-on-surface text-sm truncate">{m.nombre}</h5>
                                        </div>
                                        <p className="text-xs font-bold text-on-surface-variant/70 mb-1">{m.asunto}</p>
                                        <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest italic">{new Date(m.timestamp).toLocaleDateString('es-VE')}</p>
                                    </div>
                                    <button onClick={e => { e.stopPropagation(); setItemToDelete(m.id); setShowConfirm(true); }} className="opacity-0 group-hover:opacity-100 p-2 text-error hover:bg-error-container/20 rounded-xl transition-all">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Detail & Reply */}
                {selected && (
                    <div className="lg:col-span-12 xl:col-span-7 animate-in slide-in-from-right-8 duration-500">
                        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-2xl border border-outline-variant/10 relative overflow-hidden">
                            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 hover:bg-surface-container-low rounded-full transition-colors">
                                <span className="material-symbols-outlined text-on-surface-variant">close</span>
                            </button>
                            
                            {/* Sender Info */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-primary rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-inner">
                                        {selected.nombre.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black font-headline text-on-surface">{selected.nombre}</h4>
                                        <p className="text-primary font-bold text-sm">{selected.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-surface-container-low rounded-xl">
                                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mb-1">Asunto</p>
                                        <p className="text-sm font-bold text-on-surface">{selected.asunto}</p>
                                    </div>
                                    <div className="p-3 bg-surface-container-low rounded-xl">
                                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mb-1">Fecha</p>
                                        <p className="text-sm font-bold text-on-surface">{new Date(selected.timestamp).toLocaleString('es-VE')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Original Message */}
                            <div className="mb-6">
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 mb-2 opacity-60">Mensaje</p>
                                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 text-on-surface leading-relaxed text-sm italic shadow-inner min-h-[100px]">
                                    {selected.mensaje}
                                </div>
                            </div>

                            {/* Previous Replies */}
                            {replies.length > 0 && (
                                <div className="mb-6">
                                    <button 
                                        onClick={() => setShowReplies(!showReplies)}
                                        className="flex items-center gap-2 text-primary font-bold text-sm mb-3"
                                    >
                                        <span className="material-symbols-outlined text-sm">{showReplies ? 'expand_less' : 'expand_more'}</span>
                                        Respuestas anteriores ({replies.length})
                                    </button>
                                    {showReplies && (
                                        <div className="space-y-3 max-h-48 overflow-y-auto">
                                            {replies.map(r => (
                                                <div key={r.id} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                                                    <p className="text-xs text-green-700 mb-1">{new Date(r.created_at).toLocaleString('es-VE')}</p>
                                                    <p className="text-sm text-on-surface">{r.respuesta}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Reply Section */}
                            <div className="border-t border-outline-variant/20 pt-6">
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 mb-3 opacity-60">Enviar Respuesta</p>
                                
                                {/* Quick Replies */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {QUICK_REPLIES.map((qr, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleQuickReply(qr.text)}
                                            className="text-xs bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors"
                                        >
                                            {qr.label}
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Escribe tu respuesta..."
                                    rows={4}
                                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm font-bold mb-4"
                                />

                                <div className="flex flex-wrap gap-3">
                                    <button 
                                        onClick={() => handleReply(true)}
                                        disabled={!replyText.trim() || sendingReply}
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-headline font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">send</span>
                                        {sendingReply ? 'Enviando...' : 'Enviar por Email'}
                                    </button>
                                    {/* Hide draft save button as requested */}
                                    {/* <button 
                                        onClick={() => handleReply(false)}
                                        disabled={!replyText.trim() || sendingReply}
                                        className="bg-surface-container-high text-on-surface-variant px-6 py-3 rounded-xl font-headline font-black text-sm hover:bg-surface-container-highest transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">save</span>
                                        Solo Guardar
                                    </button> */}
                                    <a 
                                        href={`mailto:${selected.email}`} 
                                        className="bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-headline font-black text-sm hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">reply</span>
                                        Cliente Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <ConfirmDialog
            open={showConfirm}
            onConfirm={handleDelete}
            onCancel={() => { setShowConfirm(false); setItemToDelete(null); }}
            title="Eliminar Mensaje"
            message="Este mensaje se eliminará permanentemente. ¿Deseas continuar?"
        />
        </>
    );
}

// Import service directly for local functions
import { contactService } from '../../../services/contactService';
