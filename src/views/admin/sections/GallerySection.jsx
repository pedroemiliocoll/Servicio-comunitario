import React, { useState } from 'react';
import { useGalleryAdmin } from '../../../controllers/useAdminController';
import ConfirmDialog from '../../ui/ConfirmDialog';
import ImageUploader from '../../../components/ImageUploader';

const CATS = [
    { key: 'general', label: 'General' },
    { key: 'eventos', label: 'Eventos' },
    { key: 'instalaciones', label: 'Instalaciones' },
    { key: 'academico', label: 'Académico' },
    { key: 'deportes', label: 'Deportes' }
];

const CATEGORY_ICONS = {
    general: 'info',
    eventos: 'celebration',
    instalaciones: 'apartment',
    academico: 'school',
    deportes: 'sports_soccer'
};

export default function GallerySection({ showToast }) {
    const g = useGalleryAdmin(showToast);
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDelete = () => {
        if (itemToDelete) {
            g.remove(itemToDelete);
            setItemToDelete(null);
            setShowConfirm(false);
        }
    };

    const featuredCount = g.items.filter(i => i.featured).length;

    return (
        <>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black font-headline text-on-surface">Galería Institucional</h3>
                    <p className="text-sm text-on-surface-variant mt-1">
                        {featuredCount}/5 imágenes seleccionadas para la página de Instalaciones
                    </p>
                </div>
                <button 
                    onClick={() => g.setShowForm(!g.showForm)}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-headline font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                    {g.showForm ? 'Cerrar' : 'Subir Imagen'}
                </button>
            </div>

            {g.showForm && (
                <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-2xl border border-outline-variant/10 animate-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Título de la Imagen</label>
                                <input className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold" placeholder="Ej: Biblioteca Principal" value={g.form.titulo} onChange={e => g.setForm(f => ({ ...f, titulo: e.target.value }))} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Categoría</label>
                                <select className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold capitalize" value={g.form.categoria} onChange={e => g.setForm(f => ({ ...f, categoria: e.target.value }))}>
                                    {CATS.map(c => (
                                        <option key={c.key} value={c.key}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-600">star</span>
                                    <div>
                                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Mostrar en página de Instalaciones</p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">Selecciona hasta 5 imágenes destacadas</p>
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={g.form.featured || false}
                                        onChange={e => g.setForm(f => ({ ...f, featured: e.target.checked }))}
                                        disabled={!g.form.featured && featuredCount >= 5}
                                        className="w-5 h-5 rounded text-blue-600"
                                    />
                                    <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                        {g.form.featured ? '✓ Marcada como destacada' : (featuredCount >= 5 ? 'Límite alcanzado (5/5)' : 'Marcar como destacada')}
                                    </span>
                                </label>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Subir Imagen</label>
                                <ImageUploader
                                    value={g.form.image_url}
                                    onChange={(url) => g.setForm(f => ({ ...f, image_url: url }))}
                                    placeholder="Arrastra una imagen o haz clic para seleccionar"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="bg-surface-container-low rounded-3xl p-6">
                                <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">preview</span>
                                    Vista Previa
                                </h4>
                                {g.form.image_url ? (
                                    <div className="aspect-video bg-surface-container-lowest rounded-2xl overflow-hidden">
                                        <img src={g.form.image_url} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-surface-container-lowest rounded-2xl flex items-center justify-center text-on-surface-variant/30">
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-5xl">image</span>
                                            <p className="text-xs font-bold uppercase tracking-widest mt-2">Sin imagen</p>
                                        </div>
                                    </div>
                                )}
                                {g.form.titulo && (
                                    <p className="text-sm font-bold text-on-surface mt-3 text-center">{g.form.titulo}</p>
                                )}
                                <div className="flex items-center justify-center gap-1 mt-1">
                                    {g.form.categoria && (
                                        <p className="text-xs text-on-surface-variant text-center capitalize flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">{CATEGORY_ICONS[g.form.categoria]}</span>
                                            {g.form.categoria}
                                        </p>
                                    )}
                                    {g.form.featured && (
                                        <span className="ml-2 bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[10px]">star</span>
                                            Destacada
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <button 
                            className="bg-primary text-white px-8 py-4 rounded-2xl font-headline font-black text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-50 transition-all" 
                            onClick={g.save} 
                            disabled={g.saving || !g.form.titulo || !g.form.image_url}
                        >
                            {g.saving ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Publicando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">photo_library</span>
                                    Publicar en Galería
                                </span>
                            )}
                        </button>
                        <button 
                            className="bg-surface-container-high text-on-surface-variant px-8 py-4 rounded-2xl font-headline font-black text-sm hover:bg-surface-container-highest transition-colors" 
                            onClick={g.reset}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {g.items.length === 0 && !g.showForm ? (
                <div className="py-20 text-center bg-surface-container-lowest rounded-[2rem] border-2 border-dashed border-outline-variant/30">
                    <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">photo_library</span>
                    <h4 className="text-lg font-headline font-black text-on-surface mb-2">No hay imágenes en la galería</h4>
                    <p className="text-sm text-on-surface-variant mb-6">Agrega la primera imagen haciendo clic en "Subir Imagen"</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {g.items.map(item => (
                        <div key={item.id} className="break-inside-avoid bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-outline-variant/10 group transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="relative">
                                <img 
                                    src={item.image_url} 
                                    alt={item.titulo} 
                                    className="w-full h-auto object-cover" 
                                    onError={(e) => e.target.src = '/assets/images/placeholder.jpg'}
                                />
                                {item.featured && (
                                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                                        <span className="material-symbols-outlined text-[10px]">star</span>
                                        Destacada
                                    </div>
                                )}
                                {!item.enabled && (
                                    <div className="absolute inset-0 bg-on-surface/60 backdrop-blur-sm flex items-center justify-center">
                                        <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">visibility_off</span>
                                            Oculta
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col gap-3">
                                <div>
                                    <h5 className="font-bold text-on-surface text-sm line-clamp-1">{item.titulo}</h5>
                                    <span className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest capitalize flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-xs">{CATEGORY_ICONS[item.categoria]}</span>
                                        {item.categoria}
                                    </span>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 p-2 bg-surface-container rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95" onClick={() => g.edit(item)} title="Editar">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button 
                                        className={`flex-1 p-2 rounded-xl transition-all active:scale-95 ${item.featured ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-surface-container hover:bg-blue-50 hover:text-blue-600'}`} 
                                        onClick={() => g.toggleFeatured(item.id)}
                                        title={item.featured ? 'Quitar de destacadas' : 'Marcar como destacada'}
                                        disabled={!item.featured && featuredCount >= 5}
                                    >
                                        <span className="material-symbols-outlined text-sm">star</span>
                                    </button>
                                    <button className="flex-1 p-2 bg-surface-container rounded-xl hover:bg-secondary hover:text-white transition-all active:scale-95" onClick={() => g.toggle(item)} title={item.enabled ? 'Ocultar' : 'Mostrar'}>
                                        <span className="material-symbols-outlined text-sm">{item.enabled ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                    <button className="flex-1 p-2 bg-surface-container text-error rounded-xl hover:bg-error-container hover:text-error transition-all active:scale-95" onClick={() => { setItemToDelete(item.id); setShowConfirm(true); }} title="Eliminar">
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <ConfirmDialog
            open={showConfirm}
            onConfirm={handleDelete}
            onCancel={() => { setShowConfirm(false); setItemToDelete(null); }}
            title="Eliminar Imagen"
            message="Esta imagen se eliminará permanentemente de la galería. ¿Deseas continuar?"
        />
        </>
    );
}
