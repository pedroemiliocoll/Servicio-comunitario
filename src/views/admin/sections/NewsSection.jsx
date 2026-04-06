import React, { useState } from 'react';
import { useNewsAdmin, getCategoryGradient } from '../../../controllers/useNewsController';
import ConfirmDialog from '../../ui/ConfirmDialog';
import ImageUploader from '../../../components/ImageUploader';
import RichTextEditor from '../../../components/RichTextEditor';

export default function NewsSection({ showToast }) {
    const n = useNewsAdmin(showToast);
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleDelete = () => {
        if (itemToDelete) {
            n.remove(itemToDelete);
            setItemToDelete(null);
            setShowConfirm(false);
        }
    };

    return (
        <>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black font-headline text-on-surface">Gestión de Comunicados</h3>
                <button 
                    onClick={() => { n.reset(); n.setShowForm(true); }}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-headline font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Publicar Noticias
                </button>
            </div>

            {/* Creation Form Overlay/Section */}
            {n.showForm && (
                <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-2xl border border-outline-variant/10 animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#005bbf] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 border border-white/10">
                                <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>{n.editing ? 'edit_note' : 'post_add'}</span>
                            </div>
                            <h4 className="text-xl font-black font-headline">{n.editing ? 'Editar Comunicado' : 'Nueva Noticia'}</h4>
                        </div>
                        <button onClick={n.reset} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
                            <span className="material-symbols-outlined text-on-surface-variant">close</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Título del anuncio</label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold placeholder:text-on-surface-variant/40"
                                placeholder="Ej: Inscripciones Abiertas"
                                value={n.form.titulo} 
                                onChange={e => n.setForm(f => ({ ...f, titulo: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Fecha de Publicación</label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                                type="date" 
                                value={n.form.fecha} 
                                onChange={e => n.setForm(f => ({ ...f, fecha: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Imagen de Portada (Opcional)</label>
                            <ImageUploader
                                value={n.form.image_url}
                                onChange={(url) => n.setForm(f => ({ ...f, image_url: url }))}
                                placeholder="Arrastra una imagen o pega una URL"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Categoría</label>
                            <select 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                                value={n.form.categoria} 
                                onChange={e => n.setForm(f => ({ ...f, categoria: e.target.value }))}
                            >
                                {n.categories.filter(c => c.id !== 'todos').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Visualización</label>
                            <select 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                                value={n.form.status || 'published'} 
                                onChange={e => n.setForm(f => ({ ...f, status: e.target.value }))}
                            >
                                <option value="published">✓ Público (Publicada)</option>
                                <option value="draft">✏️ Privado (Borrador)</option>
                                <option value="scheduled">⏰ Programada</option>
                            </select>
                        </div>
                        {n.form.status === 'scheduled' && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Fecha y Hora Programada</label>
                                <input 
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                                    type="datetime-local" 
                                    value={n.form.scheduled_at || ''} 
                                    onChange={e => n.setForm(f => ({ ...f, scheduled_at: e.target.value }))}
                                />
                                <p className="text-xs text-on-surface-variant ml-2">La noticia se publicará automáticamente a la hora indicada</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Breve Descripción (Extracto)</label>
                            <textarea 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                                rows="2" 
                                value={n.form.extracto} 
                                onChange={e => n.setForm(f => ({ ...f, extracto: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Contenido Detallado</label>
                            <RichTextEditor
                                value={n.form.contenido}
                                onChange={(content) => n.setForm(f => ({ ...f, contenido: content }))}
                                placeholder="Escribe el contenido de la noticia..."
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button 
                            className="bg-surface-container-high text-on-surface px-6 py-4 rounded-2xl font-headline font-black text-sm hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                            onClick={() => setShowPreview(true)}
                        >
                            <span className="material-symbols-outlined">visibility</span>
                            Previsualizar
                        </button>
                        <button 
                            className="bg-primary text-white px-8 py-4 rounded-2xl font-headline font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            onClick={n.save} 
                            disabled={n.saving}
                        >
                            {n.saving ? 'Sincronizando...' : 'Guardar y Publicar'}
                        </button>
                        <button className="bg-surface-container-high text-on-surface-variant px-8 py-4 rounded-2xl font-headline font-black text-sm hover:bg-surface-container-highest transition-colors" onClick={n.reset}>
                            Descartar
                        </button>
                    </div>
                </div>
            )}

            {/* Data Table with Stitch styling */}
            <div className="bg-surface-container-lowest rounded-[2.5rem] shadow-sm border border-outline-variant/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-body">
                        <thead className="bg-surface-container-low/50">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline">Título</th>
                                <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline">Categoría</th>
                                <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline">Estado</th>
                                <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline">Fecha</th>
                                <th className="px-8 py-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest font-headline text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low text-sm">
                            {n.items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-on-surface-variant/40">
                                            <span className="material-symbols-outlined text-6xl">newspaper</span>
                                            <p className="font-bold">No se encontraron noticias publicadas</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : n.items.map(item => (
                                <tr key={item.id} className="hover:bg-surface-container-low transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant/10">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                                                        <span className="material-symbols-outlined text-sm">image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-bold text-on-surface leading-tight max-w-xs">{item.titulo}</div>
                                        </div>
                                    </td>
                                     <td className="px-8 py-5">
                                        <span className="text-[10px] font-black text-on-primary-container px-3 py-1 bg-primary-container rounded-full uppercase tracking-tighter shadow-sm border border-white/5">
                                            {item.categoria}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                                            item.status === 'published' ? 'bg-green-100 text-green-700' : 
                                            item.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                item.status === 'published' ? 'bg-green-500' : 
                                                item.status === 'scheduled' ? 'bg-blue-500' : 
                                                'bg-amber-500'
                                            }`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {item.status === 'published' ? 'Publicada' : 
                                                 item.status === 'scheduled' ? 'Programada' : 'Borrador'}
                                            </span>
                                        </div>
                                        {item.status === 'scheduled' && item.scheduled_at && (
                                            <p className="text-xs text-blue-600 mt-1">{new Date(item.scheduled_at).toLocaleString('es-VE')}</p>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 font-medium text-on-surface-variant/70 italic">{n.formatDate(item.fecha)}</td>
                                    <td className="px-4 py-5">
                                        <div className="flex items-center gap-1">
                                             <button 
                                                onClick={() => n.moveUp(item.id)}
                                                disabled={n.items.findIndex(i => i.id === item.id) === 0}
                                                className="p-2 bg-surface-container-high text-on-surface-variant rounded-lg hover:bg-[#005bbf] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                            </button>
                                            <button 
                                                onClick={() => n.moveDown(item.id)}
                                                disabled={n.items.findIndex(i => i.id === item.id) === n.items.length - 1}
                                                className="p-2 bg-surface-container-high text-on-surface-variant rounded-lg hover:bg-[#005bbf] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-right space-x-2">
                                         <button className="p-3 bg-surface-container-high text-on-surface-variant rounded-xl hover:bg-[#005bbf] hover:text-white transition-all active:scale-90" onClick={() => n.edit(item)}>
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button className="p-3 bg-surface-container-high text-error rounded-xl hover:bg-error-container/20 transition-all active:scale-90" onClick={() => { setItemToDelete(item.id); setShowConfirm(true); }}>
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
                <div className="relative bg-surface-container-lowest w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="sticky top-0 bg-surface-container-lowest p-4 border-b border-outline-variant/10 flex justify-between items-center">
                        <h3 className="font-headline font-black text-lg">Previsualización</h3>
                        <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-surface-container rounded-full">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="p-8">
                        {n.form.image_url && (
                            <img src={n.form.image_url} alt="" className="w-full h-48 object-cover rounded-2xl mb-6" onError={(e) => e.target.style.display = 'none'} />
                        )}
                        <div className="flex items-center gap-2 mb-4">
                            <span 
                                className="text-[10px] font-black px-3 py-1 rounded-full uppercase text-white"
                                style={{ background: getCategoryGradient(n.form.categoria) }}
                            >
                                {n.form.categoria}
                            </span>
                            <span className="text-xs text-on-surface-variant">{n.form.fecha}</span>
                        </div>
                        <h1 className="font-headline font-black text-2xl text-on-surface mb-4">{n.form.titulo || 'Sin título'}</h1>
                        <p className="font-bold text-on-surface-variant mb-6">{n.form.extracto || 'Sin extracto'}</p>
                        <div className="prose prose-sm max-w-none text-on-surface">
                            {n.form.contenido || 'Sin contenido'}
                        </div>
                    </div>
                </div>
            </div>
        )}

        <ConfirmDialog
            open={showConfirm}
            onConfirm={handleDelete}
            onCancel={() => { setShowConfirm(false); setItemToDelete(null); }}
            title="Eliminar Noticia"
            message="Esta acción eliminará la noticia permanentemente. ¿Deseas continuar?"
        />
        </>
    );
}
