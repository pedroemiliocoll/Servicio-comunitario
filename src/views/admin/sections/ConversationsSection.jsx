import React, { useState } from 'react';
import { useConversations } from '../../../controllers/useAdminController';
import ConfirmDialog from '../../ui/ConfirmDialog';

export default function ConversationsSection() {
    const { sessions, selected, selectedMsgs, loading, viewSession, clearSelection, deleteSession } = useConversations();
    const [showConfirm, setShowConfirm] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);

    const handleDelete = () => {
        if (sessionToDelete) {
            deleteSession(sessionToDelete);
            setSessionToDelete(null);
            setShowConfirm(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 bg-surface-container-low rounded-3xl animate-pulse">
            <p className="text-primary dark:text-white font-bold uppercase tracking-widest">Sincronizando Archivos Históricos...</p>
        </div>
    );

    return (
        <>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black font-headline text-on-surface">Historial de Interacciones IA</h3>
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest opacity-60">Registros de Transparencia</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-[600px]">
                {/* Session List */}
                <div className={`${selected ? 'lg:col-span-5' : 'lg:col-span-12'} h-full flex flex-col gap-4 overflow-hidden`}>
                    <div className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 flex-1 overflow-y-auto custom-scrollbar divide-y divide-surface-container-low">
                        {sessions.length === 0 ? (
                            <div className="p-20 text-center flex flex-col items-center gap-4 text-on-surface-variant/30 font-bold italic">
                                <span className="material-symbols-outlined text-5xl">forum</span>
                                <p>Sin conversaciones registradas</p>
                            </div>
                        ) : sessions.map(s => (
                             <div 
                                key={s.session_id} 
                                onClick={() => viewSession(s.session_id)}
                                className={`p-6 cursor-pointer transition-all flex justify-between items-center group ${
                                    selected === s.session_id ? 'bg-[#005bbf] text-white shadow-lg shadow-primary/20' : 'hover:bg-surface-container-low'
                                }`}
                            >
                                <div className="flex-1 overflow-hidden pr-4 leading-tight">
                                    <p className={`font-bold text-sm truncate mb-1 italic ${selected === s.session_id ? 'text-white' : 'text-on-surface'}`}>"{s.first_question}"</p>
                                    <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-tighter opacity-70 ${selected === s.session_id ? 'text-white/80' : 'text-on-surface-variant'}`}>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">forum</span>
                                            {s.message_count} mensajes
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(s.started_at).toLocaleString('es-VE')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                     <button
                                        onClick={e => { e.stopPropagation(); setSessionToDelete(s.session_id); setShowConfirm(true); }}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-error hover:bg-error-container/20 rounded-xl transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                    <span className={`material-symbols-outlined transition-colors ${selected === s.session_id ? 'text-white' : 'text-on-surface-variant/30 group-hover:text-primary dark:group-hover:text-white'}`}>chevron_right</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Viewer */}
                {selected && (
                    <div className="lg:col-span-7 h-full animate-in slide-in-from-right-8 duration-500 flex flex-col">
                        <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-2xl border border-outline-variant/10 flex-1 flex flex-col overflow-hidden relative">
                            <div className="p-6 bg-surface-container-low border-b border-outline-variant/5 flex justify-between items-center">
                                <h4 className="text-xs font-black font-headline text-on-surface uppercase tracking-widest">Transcripción de Sesión</h4>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setSessionToDelete(selected); setShowConfirm(true); }}
                                        className="p-2 hover:bg-error-container/20 rounded-full transition-colors text-error"
                                        title="Eliminar conversación"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                    <button onClick={clearSelection} className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar bg-surface-container-low/50">
                                {selectedMsgs.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                                        <div className={`max-w-[85%] p-5 rounded-3xl ${
                                            m.role === 'user' 
                                                ? 'bg-primary text-white rounded-br-sm shadow-lg shadow-primary/10' 
                                                : 'bg-surface-container-lowest text-on-surface rounded-bl-sm shadow-sm border border-outline-variant/5'
                                        } text-sm leading-relaxed`}>
                                            <p className="font-bold mb-1 uppercase text-[10px] opacity-60 tracking-widest">
                                                {m.role === 'user' ? 'Estudiante' : 'Coll-Bot IA'}
                                            </p>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <ConfirmDialog
            open={showConfirm}
            onConfirm={handleDelete}
            onCancel={() => { setShowConfirm(false); setSessionToDelete(null); }}
            title="Eliminar Conversación"
            message="Se eliminará permanentemente esta sesión de conversación del registro histórico. ¿Deseas continuar?"
        />
        </>
    );
}
