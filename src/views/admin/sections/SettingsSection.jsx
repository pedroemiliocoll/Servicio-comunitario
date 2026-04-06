import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../controllers/useAdminController';
import { backupService } from '../../../services/backupService';
import { settingsService } from '../../../services/settingsService';

export default function SettingsSection({ showToast }) {
    const s = useSettings(showToast);
    const [stats, setStats] = useState({});
    const [exporting, setExporting] = useState(false);
    const [comunicado, setComunicado] = useState({ enabled: false, titulo: '', mensaje: '' });
    const [savingComunicado, setSavingComunicado] = useState(false);

    useEffect(() => {
        backupService.getStats()
            .then(setStats)
            .catch(() => {});
        
        settingsService.getComunicado()
            .then(setComunicado)
            .catch(() => {});
    }, []);

    const handleExport = async () => {
        setExporting(true);
        try {
            await backupService.export();
            showToast('Backup descargado exitosamente');
        } catch (err) {
            showToast('Error al exportar backup', 'error');
        } finally {
            setExporting(false);
        }
    };

    const handleSaveComunicado = async () => {
        setSavingComunicado(true);
        try {
            await settingsService.updateComunicado(comunicado);
            showToast('Comunicado guardado correctamente');
        } catch (err) {
            showToast('Error al guardar comunicado', 'error');
        } finally {
            setSavingComunicado(false);
        }
    };

    if (s.loading || !s.info) return (
        <div className="flex items-center justify-center h-64 bg-surface-container-low rounded-3xl animate-pulse">
            <p className="text-secondary font-bold tracking-widest uppercase italic">Accediendo al Núcleo...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h3 className="text-3xl font-black font-headline text-on-surface tracking-tight">Preferencias del Sistema</h3>
                <p className="text-on-surface-variant font-medium">Configuración de núcleo y conexiones API externas</p>
            </div>

            <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-sm border border-outline-variant/10 space-y-10">
                {/* API Key Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                        <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>key</span>
                        <h4 className="text-lg font-black font-headline text-on-surface">Conectividad OpenRouter AI</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-4 opacity-60">ApiKey de Producción (Invisible por seguridad)</label>
                            <div className="relative group">
                                <input 
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-8 py-5 focus:ring-2 focus:ring-primary/20 text-sm font-bold shadow-inner" 
                                    type="password" 
                                    placeholder="sk-or-v1-••••••••••••••••••••••••••••••••" 
                                    value={s.apiKey} 
                                    onChange={e => s.setApiKey(e.target.value)} 
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant/30">lock</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-on-surface-variant px-2 italic font-medium leading-relaxed">
                            ⚠️ Esta llave permite al chatbot utilizar los modelos de lenguaje. Nunca la compartas ni la pegues en sitios públicos.
                        </p>
                        <button className="bg-[#005bbf] text-white px-8 py-4 rounded-2xl font-headline font-black text-sm shadow-xl shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all" onClick={s.saveApiKey}>
                            Actualizar Llave de Acceso
                        </button>
                    </div>
                </div>

                <hr className="border-outline-variant/20" />

                {/* Institution Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-secondary pl-4">
                        <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>school</span>
                        <h4 className="text-lg font-black font-headline text-on-surface">Identidad del Liceo</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['nombre', 'nombreCorto', 'email', 'telefono'].map(k => (
                            <div key={k} className="space-y-1">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-4 opacity-60">
                                    {k === 'nombre' ? 'Nombre Institucional Completo' : k === 'nombreCorto' ? 'Siglas/Nombre Corto' : k}
                                </label>
                                <input 
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-secondary/20 text-sm font-bold shadow-sm" 
                                    value={s.info[k] || ''} 
                                    onChange={e => s.setInfo(i => ({ ...i, [k]: e.target.value }))} 
                                />
                            </div>
                        ))}
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-4 opacity-60">Dirección Física</label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-secondary/20 text-sm font-bold shadow-sm" 
                                value={s.info.direccion || ''} 
                                onChange={e => s.setInfo(i => ({ ...i, direccion: e.target.value }))} 
                            />
                        </div>
                    </div>
                    <button className="w-full bg-[#004a9e] text-white py-5 rounded-2xl font-headline font-black text-sm shadow-xl shadow-lg shadow-black/20 hover:scale-[1.01] active:scale-[0.99] transition-all" onClick={s.saveInfo}>
                        Sincronizar Datos Institucionales
                    </button>
                </div>

                <hr className="border-outline-variant/20" />

                {/* Comunicado Urgente */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-error pl-4">
                        <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>campaign</span>
                        <h4 className="text-lg font-black font-headline text-on-surface">Comunicado Urgente</h4>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={comunicado.enabled} 
                                onChange={e => setComunicado(c => ({ ...c, enabled: e.target.checked }))}
                                className="w-5 h-5 accent-error"
                            />
                            <span className="text-sm font-semibold text-on-surface">Mostrar comunicado en el portal público</span>
                        </label>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-4 opacity-60">Título</label>
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-error/20 text-sm font-bold shadow-sm" 
                                value={comunicado.titulo} 
                                onChange={e => setComunicado(c => ({ ...c, titulo: e.target.value }))}
                                placeholder="Ej: Mantenimiento Programado"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-4 opacity-60">Mensaje</label>
                            <textarea 
                                rows={3}
                                className="w-full bg-surface-container-low border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-error/20 text-sm font-bold shadow-sm resize-none" 
                                value={comunicado.mensaje} 
                                onChange={e => setComunicado(c => ({ ...c, mensaje: e.target.value }))}
                                placeholder="Escribe el mensaje que aparecerá en el portal..."
                            />
                        </div>
                        <button 
                            onClick={handleSaveComunicado}
                            disabled={savingComunicado}
                            className="bg-error text-white px-8 py-4 rounded-2xl font-headline font-black text-sm shadow-xl shadow-error/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {savingComunicado ? 'Guardando...' : 'Publicar Comunicado'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Backup Section */}
            <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-sm border border-outline-variant/10 space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-tertiary pl-4">
                    <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>backup</span>
                    <h4 className="text-lg font-black font-headline text-on-surface">Respaldo de Datos</h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(stats).map(([key, count]) => (
                        <div key={key} className="bg-surface-container p-4 rounded-2xl text-center">
                            <p className="text-2xl font-black text-on-surface">{count}</p>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{key.replace('_', ' ')}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={handleExport}
                        disabled={exporting}
                        className="flex items-center gap-2 bg-surface-container-highest text-on-surface px-8 py-4 rounded-2xl font-headline font-black text-sm shadow-xl shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined">download</span>
                        {exporting ? 'Exportando...' : 'Descargar Backup JSON'}
                    </button>
                    <p className="text-xs text-on-surface-variant self-center">
                        Se descargará un archivo JSON con todos los datos del sistema
                    </p>
                </div>
            </div>
        </div>
    );
}
