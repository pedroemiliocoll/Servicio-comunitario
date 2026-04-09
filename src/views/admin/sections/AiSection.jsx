import React, { useState } from 'react';
import { useAiConfig } from '../../../controllers/useAdminController';
import { chatbotService } from '../../../services/chatbotService';
import DOMPurify from 'dompurify';
import ConfirmDialog from '../../ui/ConfirmDialog';

const TONES = [
    { value: 'amigable', label: 'Amigable', desc: 'Cálido y cercano', icon: 'sentiment_satisfied' },
    { value: 'formal', label: 'Formal', desc: 'Profesional y serio', icon: 'balance' },
    { value: 'neutral', label: 'Neutral', desc: 'Equilibrado', icon: 'info' },
];

const POSITIONS = [
    { value: 'bottom-right', label: 'Abajo derecha', icon: 'south_east' },
    { value: 'bottom-left', label: 'Abajo izquierda', icon: 'south_west' },
    { value: 'top-right', label: 'Arriba derecha', icon: 'north_east' },
    { value: 'top-left', label: 'Arriba izquierda', icon: 'north_west' },
];

const COLOR_PRESETS = [
    { name: 'Azul', value: '#0b92d5' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Morado', value: '#8B5CF6' },
    { name: 'Naranja', value: '#F59E0B' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Rosa', value: '#EC4899' },
];

function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex items-center justify-between py-3 cursor-pointer group">
            <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors flex-1 pr-4">{label}</span>
            <div className="relative flex-shrink-0">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className={`w-14 h-8 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-surface-container-high'} flex items-center px-1`}>
                    <div className={`w-6 h-6 bg-surface-container-lowest rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>
        </label>
    );
}

export default function AiSection({ showToast }) {
    const ai = useAiConfig(showToast) || {};
    const [previewMsg, setPreviewMsg] = useState('¿Qué horario tiene el liceo?');
    const [previewResp, setPreviewResp] = useState('');
    const [previewing, setPreviewing] = useState(false);
    const [showAiConfirm, setShowAiConfirm] = useState(false);
    const [aiDeleteId, setAiDeleteId] = useState(null);
    const [activeTab, setActiveTab] = useState('behavior');

    const runPreview = async () => {
        if (!previewMsg.trim()) return;
        setPreviewing(true);
        setPreviewResp('');
        try {
            let text = '';
            await chatbotService.sendMessage(previewMsg, null, (chunk) => {
                if (chunk && typeof chunk === 'object' && chunk.text) {
                    text += chunk.text;
                }
                setPreviewResp(text);
            });
        } catch (e) {
            setPreviewResp('Error: ' + (e.message || 'Algo salió mal'));
        } finally {
            setPreviewing(false);
        }
    };

    if (ai.loading || !ai.config) return (
        <div className="flex items-center justify-center h-64 bg-surface-container-low rounded-3xl animate-pulse">
            <p className="text-primary font-bold tracking-widest">Cargando configuración...</p>
        </div>
    );

    const updateConfig = (key, value) => {
        ai.setConfig?.(c => ({ ...c, [key]: value }));
    };

    const config = ai.config || {};
    const tabs = [
        { id: 'behavior', label: 'Comportamiento', icon: 'psychology' },
        { id: 'appearance', label: 'Apariencia', icon: 'palette' },
        { id: 'messages', label: 'Mensajes', icon: 'chat' },
        { id: 'faq', label: 'FAQ', icon: 'quiz' },
    ];

    return (
        <>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="text-2xl font-black font-headline text-on-surface tracking-tight">Configuración del Chatbot</h3>
                        <p className="text-on-surface-variant text-sm font-medium mt-1">Personaliza el comportamiento y apariencia del Coll-Bot</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={ai.resetAll} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-error hover:bg-error/10 rounded-xl transition-colors">
                            <span className="material-symbols-outlined text-lg">restart_alt</span>
                            Restaurar
                        </button>
                        <button onClick={ai.saveConfig} className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-headline font-black text-sm rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-lg">save</span>
                            Guardar
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-surface-container-low p-2 rounded-2xl w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab: Comportamiento */}
                {activeTab === 'behavior' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Izquierda: Tono y Creatividad */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Tono */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                                    Personalidad
                                </h4>
                                <div className="space-y-3">
                                    {TONES.map(t => (
                                        <button
                                            key={t.value}
                                            onClick={() => updateConfig('tone', t.value)}
                                            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                                                config.tone === t.value
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-transparent bg-surface-container-low hover:bg-surface-container-high'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary">{t.icon}</span>
                                                <div>
                                                    <div className="text-sm font-black font-headline text-on-surface">{t.label}</div>
                                                    <div className="text-[10px] text-on-surface-variant uppercase opacity-60">{t.desc}</div>
                                                </div>
                                            </div>
                                            {config.tone === t.value && (
                                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Creatividad */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>thermostat</span>
                                    Creatividad
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-bold text-on-surface">Temperatura</span>
                                            <span className="text-xs font-mono bg-surface-container-low px-3 py-1 rounded-full">{config.temperature?.toFixed(1)}</span>
                                        </div>
                                        <div className="bg-surface-container-low rounded-full px-1 py-2">
                                            <input
                                                type="range" className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-transparent"
                                                min="0" max="1" step="0.1"
                                                value={config.temperature || 0.7}
                                                onChange={e => updateConfig('temperature', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-on-surface-variant/50 mt-2 italic">
                                            <span>Preciso y directo</span>
                                            <span>Creativo y flexible</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-bold text-on-surface">Máximo tokens</span>
                                            <span className="text-xs font-mono bg-surface-container-low px-3 py-1 rounded-full">{config.max_tokens || 600}</span>
                                        </div>
                                        <div className="bg-surface-container-low rounded-full px-1 py-2">
                                            <input
                                                type="range" className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-transparent"
                                                min="100" max="2000" step="100"
                                                value={config.max_tokens || 600}
                                                onChange={e => updateConfig('max_tokens', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-on-surface-variant/50 mt-2 italic">
                                            <span>Respuestas cortas</span>
                                            <span>Respuestas extensas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Derecha: Opciones y Límites */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Opciones */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-2 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>settings</span>
                                    Opciones de Comportamiento
                                </h4>
                                <p className="text-xs text-on-surface-variant mb-6">Configura cómo interactúa el chatbot con los usuarios</p>
                                <div className="space-y-1">
                                    <Toggle
                                        checked={Boolean(config.only_school)}
                                        onChange={e => updateConfig('only_school', e.target.checked ? 1 : 0)}
                                        label="Solo responder preguntas sobre el liceo"
                                    />
                                    <Toggle
                                        checked={Boolean(config.history_enabled)}
                                        onChange={e => updateConfig('history_enabled', e.target.checked ? 1 : 0)}
                                        label="Guardar historial de conversaciones"
                                    />
                                    <Toggle
                                        checked={Boolean(config.feedback_enabled)}
                                        onChange={e => updateConfig('feedback_enabled', e.target.checked ? 1 : 0)}
                                        label="Permitir feedback (pulgar arriba/abajo)"
                                    />
                                    <Toggle
                                        checked={Boolean(config.typing_indicator)}
                                        onChange={e => updateConfig('typing_indicator', e.target.checked ? 1 : 0)}
                                        label="Mostrar indicador de escritura"
                                    />
                                </div>
                            </div>

                            {/* Sandbox */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-2 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>science</span>
                                    Prueba tu Configuración
                                </h4>
                                <p className="text-xs text-on-surface-variant mb-4">Envía un mensaje para ver cómo responde el bot</p>
                                
                                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
                                    <div className="p-4 bg-surface-container-low border-b border-outline-variant/10">
                                        <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Sandbox</span>
                                    </div>
                                    <div className="p-4 space-y-4 max-h-[250px] overflow-y-auto">
                                        <div className="flex gap-3 items-start">
                                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
                                                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                                            </div>
                                            <div className="bg-surface-container-high p-3 rounded-2xl rounded-tl-sm text-sm text-on-surface" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((config.welcome_message || '¡Hola!').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')) }} />
                                        </div>
                                        {previewResp && (
                                            <div className="flex gap-3 items-start">
                                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
                                                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                                                </div>
                                                <div className="bg-primary/5 p-3 rounded-2xl rounded-tl-sm text-sm text-on-surface" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewResp.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')) }} />
                                            </div>
                                        )}
                                        {previewing && (
                                            <div className="flex gap-3 items-start">
                                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 animate-pulse">
                                                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                                                </div>
                                                <div className="bg-primary/5 p-3 rounded-2xl rounded-tl-sm text-sm flex gap-1">
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 bg-surface-container-low border-t border-outline-variant/10">
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 bg-surface-container-lowest border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary"
                                                placeholder={config.placeholder || 'Escribe tu pregunta...'}
                                                value={previewMsg}
                                                onChange={e => setPreviewMsg(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && runPreview()}
                                            />
                                            <button
                                                onClick={runPreview}
                                                disabled={previewing || !previewMsg.trim()}
                                                className="p-3 bg-primary text-white rounded-xl hover:bg-primary-container transition-all disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined">{previewing ? 'hourglass_top' : 'send'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Apariencia */}
                {activeTab === 'appearance' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-6 space-y-6">
                            {/* Color */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>palette</span>
                                    Color del Widget
                                </h4>
                                <div className="flex gap-3 flex-wrap mb-4">
                                    {COLOR_PRESETS.map(c => (
                                        <button
                                            key={c.value}
                                            onClick={() => updateConfig('widget_color', c.value)}
                                            className={`w-14 h-14 rounded-2xl shadow-lg transition-all hover:scale-110 ${
                                                config.widget_color === c.value ? 'ring-4 ring-offset-2 ring-primary scale-110' : ''
                                            }`}
                                            style={{ backgroundColor: c.value }}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="color"
                                        value={config.widget_color || '#0b92d5'}
                                        onChange={e => updateConfig('widget_color', e.target.value)}
                                        className="w-14 h-14 rounded-2xl cursor-pointer border-none"
                                    />
                                    <input
                                        type="text"
                                        value={config.widget_color || '#0b92d5'}
                                        onChange={e => updateConfig('widget_color', e.target.value)}
                                        className="flex-1 bg-surface-container-low border-none rounded-2xl px-4 py-3 text-sm font-mono"
                                    />
                                </div>
                                <div className="mt-6 p-4 bg-surface-container-low rounded-2xl">
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">Vista previa</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: config.widget_color || '#0b92d5' }}>
                                            <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-on-surface">Coll-Bot</p>
                                            <p className="text-xs text-on-surface-variant">Asistente Virtual</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6 space-y-6">
                            {/* Posición */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>corner</span>
                                    Posición en Pantalla
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {POSITIONS.map(p => (
                                        <button
                                            key={p.value}
                                            onClick={() => updateConfig('widget_position', p.value)}
                                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                                                config.widget_position === p.value
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-transparent bg-surface-container-low hover:bg-surface-container-high'
                                            }`}
                                        >
                                            <span className="material-symbols-outlined text-3xl text-on-surface-variant">{p.icon}</span>
                                            <span className="text-sm font-bold text-on-surface">{p.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Mensajes */}
                {activeTab === 'messages' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-6 space-y-6">
                            {/* Bienvenida */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>waving_hand</span>
                                    Mensaje de Bienvenida
                                </h4>
                                <p className="text-xs text-on-surface-variant mb-4">Usa **texto** para negrita y \n para salto de línea</p>
                                <textarea
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 text-sm font-medium h-32 resize-none focus:ring-2 focus:ring-primary"
                                    value={config.welcome_message || ''}
                                    onChange={e => updateConfig('welcome_message', e.target.value)}
                                />
                                <div className="mt-4 p-4 bg-surface-container-low rounded-2xl">
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Vista previa</p>
                                    <div className="bg-primary-fixed text-on-surface p-4 rounded-2xl rounded-tl-none text-sm max-w-[85%]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((config.welcome_message || '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')) }} />
                                </div>
                            </div>

                            {/* Error */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
                                    Mensaje de Error
                                </h4>
                                <textarea
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 text-sm font-medium h-24 resize-none focus:ring-2 focus:ring-primary"
                                    value={config.error_message || ''}
                                    onChange={e => updateConfig('error_message', e.target.value)}
                                    placeholder="Mensaje cuando algo falla..."
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-6 space-y-6">
                            {/* Placeholder */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>edit_note</span>
                                    Placeholder del Input
                                </h4>
                                <input
                                    type="text"
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={config.placeholder || ''}
                                    onChange={e => updateConfig('placeholder', e.target.value)}
                                    placeholder="Texto cuando el input está vacío..."
                                />
                            </div>

                            {/* Sugerencias */}
                            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                                <h4 className="text-base font-black font-headline text-on-surface mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>assistant</span>
                                    Sugerencias Rápidas
                                </h4>
                                <p className="text-xs text-on-surface-variant mb-4">Separadas por coma. Aparecen al abrir el chat.</p>
                                <textarea
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 text-sm font-medium h-24 resize-none focus:ring-2 focus:ring-primary"
                                    value={
                                        Array.isArray(config.suggestions) 
                                            ? config.suggestions.join(', ') 
                                            : (config.suggestions || '[]').replace(/[\[\]"]/g, '')
                                    }
                                    onChange={e => {
                                        const suggestions = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                        updateConfig('suggestions', JSON.stringify(suggestions));
                                    }}
                                    placeholder="📋 Inscripciones, 📚 Horarios, 📞 Contacto"
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {(() => {
                                        const sList = Array.isArray(config.suggestions) 
                                            ? config.suggestions 
                                            : (() => { try { return JSON.parse(config.suggestions || '[]'); } catch { return []; } })();
                                        
                                        return sList.map((s, i) => (
                                            <span key={i} className="text-xs bg-surface-container-low px-4 py-2 rounded-full">{s}</span>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: FAQ */}
                {activeTab === 'faq' && (
                    <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                        <h4 className="text-base font-black font-headline text-on-surface mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>quiz</span>
                            Respuestas Rápidas (FAQ)
                        </h4>
                        <p className="text-xs text-on-surface-variant mb-6">Agrega respuestas automáticas para preguntas frecuentes. El bot las priorizará.</p>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
                            <div className="md:col-span-4 space-y-2">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Palabra Clave</label>
                                <input
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary"
                                    placeholder="ej: horario"
                                    value={ai.newTrigger || ''}
                                    onChange={e => ai.setNewTrigger?.(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-6 space-y-2">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2 opacity-60">Respuesta</label>
                                <textarea
                                    className="w-full bg-surface-container-low border-none rounded-2xl px-4 py-3 text-sm font-bold h-[52px] resize-none focus:ring-2 focus:ring-primary"
                                    placeholder="Respuesta automática..."
                                    value={ai.newResponse || ''}
                                    onChange={e => ai.setNewResponse?.(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2 flex items-end">
                                <button
                                    className="w-full bg-primary text-white hover:bg-primary-container py-3 rounded-2xl font-headline font-black text-sm transition-colors active:scale-95 flex items-center justify-center gap-2"
                                    onClick={ai.addResponse}
                                >
                                    <span className="material-symbols-outlined">add</span>
                                    Agregar
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!ai.responses || ai.responses.length === 0 ? (
                                <div className="col-span-2 py-12 text-center">
                                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">quiz</span>
                                    <p className="text-sm text-on-surface-variant/40 mt-3 italic">No hay respuestas rápidas configuradas</p>
                                </div>
                            ) : ai.responses.map(r => (
                                <div key={r.id} className="flex justify-between items-start p-6 bg-surface-container-low rounded-3xl border border-outline-variant/5 hover:shadow-md transition-all group">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">{r.trigger}</span>
                                            {!r.enabled && <span className="text-[10px] text-error font-bold">Deshabilitado</span>}
                                        </div>
                                        <p className="text-sm text-on-surface font-medium leading-relaxed">{r.response}</p>
                                    </div>
                                    <button
                                        onClick={() => { setAiDeleteId(r.id); setShowAiConfirm(true); }}
                                        className="p-2 text-on-surface-variant/30 hover:text-error transition-colors group-hover:opacity-100 opacity-0"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Prompt del Sistema - Siempre visible */}
                <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-base font-black font-headline text-on-surface flex items-center gap-3">
                            <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
                            Prompt del Sistema
                        </h4>
                        <button onClick={ai.resetPrompt} className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:underline">
                            <span className="material-symbols-outlined">restart_alt</span>
                            Restaurar
                        </button>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-4">Instrucciones avanzadas para definir la personalidad del bot. Usa las variables disponibles.</p>
                    <textarea
                        className="w-full bg-surface-container-low font-mono text-[13px] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary text-on-surface leading-relaxed h-48 resize-none shadow-inner"
                        value={config.system_prompt || ''}
                        onChange={e => updateConfig('system_prompt', e.target.value)}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                        {['{nombre}', '{mision}', '{vision}', '{direccion}', '{telefono}', '{email}', '{horario_entrada}', '{horario_salida}', '{niveles}'].map(v => (
                            <code key={v} className="text-[11px] bg-surface-container-low px-3 py-1.5 rounded-lg font-mono">{v}</code>
                        ))}
                    </div>
                </div>
            </div>

            {showAiConfirm && (
                <ConfirmDialog
                    open={showAiConfirm}
                    title="¿Eliminar Respuesta?"
                    message="Esta acción no se puede deshacer. La respuesta automática será eliminada."
                    danger={true}
                    onConfirm={() => {
                        if (aiDeleteId) ai.deleteResponse?.(aiDeleteId);
                        setShowAiConfirm(false);
                    }}
                    onCancel={() => setShowAiConfirm(false)}
                />
            )}
        </>
    );
}
