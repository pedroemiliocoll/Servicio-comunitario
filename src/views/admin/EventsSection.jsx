// src/views/admin/EventsSection.jsx — Admin: Gestión de eventos del calendario
import { useState, useEffect } from 'react';
import { eventsService } from '../../services/eventsService';

const TIPOS = ['general', 'academico', 'cultural', 'deportivo', 'institucional'];
const TIPO_LABELS = { general:'General', academico:'Académico', cultural:'Cultural', deportivo:'Deportivo', institucional:'Institucional' };
const TIPO_COLORS = { general:'bg-gray-100 text-gray-700', academico:'bg-blue-100 text-blue-700', cultural:'bg-purple-100 text-purple-700', deportivo:'bg-green-100 text-green-700', institucional:'bg-amber-100 text-amber-700' };

const empty = { titulo: '', descripcion: '', fecha: '', hora: '', tipo: 'general', lugar: '', enabled: true };

export default function EventsSection() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data }
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [filter, setFilter] = useState('todos');

    const load = () => {
        setLoading(true);
        eventsService.getAll().then(setEvents).catch(console.error).finally(() => setLoading(false));
    };
    useEffect(load, []);

    const openCreate = () => { setForm(empty); setError(''); setModal({ mode: 'create' }); };
    const openEdit   = ev  => { setForm({ ...ev, hora: ev.hora || '', enabled: ev.enabled === 1 }); setError(''); setModal({ mode: 'edit', id: ev.id }); };

    const handleSave = async () => {
        if (!form.titulo.trim() || !form.fecha) { setError('Título y fecha son requeridos'); return; }
        setSaving(true); setError('');
        try {
            if (modal.mode === 'create') await eventsService.create(form);
            else await eventsService.update(modal.id, form);
            setModal(null);
            load();
        } catch (e) { setError(e.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try { await eventsService.delete(id); setDeleteConfirm(null); load(); }
        catch (e) { alert(e.message); }
    };

    const allTypes = ['todos', ...new Set(events.map(e => e.tipo))];
    const filtered = filter === 'todos' ? events : events.filter(e => e.tipo === filter);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-headline font-black text-on-surface tracking-tighter">Calendario de Eventos</h2>
                    <p className="text-on-surface-variant text-sm mt-1">{events.length} evento{events.length !== 1 ? 's' : ''} registrado{events.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                    Nuevo Evento
                </button>
            </div>

            {/* Type filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {allTypes.map(t => (
                    <button key={t} onClick={() => setFilter(t)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === t ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                        {t === 'todos' ? 'Todos' : TIPO_LABELS[t] || t}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"/></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-4xl mb-3">📅</div>
                    <p className="text-on-surface-variant">No hay eventos. Crea el primero.</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-outline-variant overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-surface-container">
                            <tr>
                                {['Fecha', 'Título', 'Tipo', 'Lugar', 'Estado', ''].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/40">
                            {filtered.map(ev => (
                                <tr key={ev.id} className="hover:bg-surface-container/50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-mono text-on-surface-variant whitespace-nowrap">{ev.fecha}{ev.hora ? ` ${ev.hora}` : ''}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-on-surface text-sm">{ev.titulo}</p>
                                        {ev.descripcion && <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{ev.descripcion}</p>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TIPO_COLORS[ev.tipo] || ''}`}>
                                            {TIPO_LABELS[ev.tipo] || ev.tipo}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-on-surface-variant">{ev.lugar || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ev.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {ev.enabled ? 'Activo' : 'Oculto'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                            </button>
                                            <button onClick={() => setDeleteConfirm(ev)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-on-surface-variant hover:text-red-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create / Edit Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
                    <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-headline font-black mb-6">
                            {modal.mode === 'create' ? 'Nuevo Evento' : 'Editar Evento'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-1">Título *</label>
                                <input value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                                    className="w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                                    placeholder="Ej: Inicio de clases 2do lapso"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface mb-1">Fecha *</label>
                                    <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                                        className="w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-on-surface mb-1">Hora</label>
                                    <input type="time" value={form.hora} onChange={e => setForm(f => ({ ...f, hora: e.target.value }))}
                                        className="w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-1">Tipo</label>
                                <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                                    className="w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
                                    {TIPOS.map(t => <option key={t} value={t}>{TIPO_LABELS[t]}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-1">Lugar</label>
                                <input value={form.lugar} onChange={e => setForm(f => ({ ...f, lugar: e.target.value }))}
                                    className="w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                                    placeholder="Ej: Aula Magna, Cancha deportiva..."/>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-on-surface mb-1">Descripción</label>
                                <textarea rows={3} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                                    className="w-full border border-outline-variant rounded-xl px-4 py-2.5 bg-surface text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                                    placeholder="Descripción corta del evento..."/>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))}
                                    className="w-4 h-4 accent-primary"/>
                                <span className="text-sm font-semibold text-on-surface">Visible en el portal público</span>
                            </label>
                        </div>
                        {error && <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>}
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setModal(null)} className="flex-1 border border-outline-variant text-on-surface py-2.5 rounded-xl font-semibold hover:bg-surface-container transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-1 bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
                                {saving ? 'Guardando…' : modal.mode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center" onClick={e => e.stopPropagation()}>
                        <div className="text-4xl mb-4">🗑️</div>
                        <h3 className="font-bold text-on-surface text-lg mb-2">¿Eliminar evento?</h3>
                        <p className="text-on-surface-variant text-sm mb-6">«{deleteConfirm.titulo}» será eliminado permanentemente.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-outline-variant py-2.5 rounded-xl font-semibold text-on-surface hover:bg-surface-container transition-colors">Cancelar</button>
                            <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
