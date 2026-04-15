import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useChatbot } from '../../controllers/useChatbotController';
import './Chatbot.css';

const safeHtml = (text) => {
    const raw = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    return DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['strong', 'br'], ALLOWED_ATTR: [] });
};

function FeedbackButtons({ onFeedback, disabled }) {
    const [showThanks, setShowThanks] = useState(false);

    const handleFeedback = async (rating) => {
        const success = await onFeedback(rating);
        if (success) {
            setShowThanks(true);
            setTimeout(() => setShowThanks(false), 2000);
        }
    };

    if (showThanks) {
        return (
            <div className="flex items-center gap-2 text-xs text-green-600 animate-fade-in">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                ¡Gracias por tu opinión!
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 transition-opacity ${disabled ? 'opacity-50' : 'opacity-100'}`}>
            <span className="text-[10px] text-on-surface-variant">¿Te fue útil?</span>
            <button
                onClick={() => handleFeedback('positive')}
                disabled={disabled}
                className="p-1.5 rounded-full hover:bg-green-100 text-green-600 disabled:cursor-not-allowed transition-colors"
                title="Sí, fue útil"
            >
                <span className="material-symbols-outlined text-base">thumb_up</span>
            </button>
            <button
                onClick={() => handleFeedback('negative')}
                disabled={disabled}
                className="p-1.5 rounded-full hover:bg-red-100 text-red-500 disabled:cursor-not-allowed transition-colors"
                title="No fue útil"
            >
                <span className="material-symbols-outlined text-base">thumb_down</span>
            </button>
        </div>
    );
}

function getPositionClasses(position) {
    const base = 'z-[100] max-w-sm w-full transition-all duration-300';
    switch (position) {
        case 'bottom-left':
            return `${base} fixed bottom-28 left-8 origin-bottom-left`;
        case 'top-right':
            return `${base} fixed top-20 right-8 origin-top-right`;
        case 'top-left':
            return `${base} fixed top-20 left-8 origin-top-left`;
        case 'bottom-right':
        default:
            return `${base} fixed bottom-28 right-8 origin-bottom-right`;
    }
}

function getButtonPosition(position) {
    switch (position) {
        case 'bottom-left':
            return 'fixed bottom-8 left-8 z-[100]';
        case 'top-right':
            return 'fixed top-20 right-8 z-[100]';
        case 'top-left':
            return 'fixed top-20 left-8 z-[100]';
        case 'bottom-right':
        default:
            return 'fixed bottom-8 right-8 z-[100]';
    }
}

export default function Chatbot() {
    const {
        open, toggle, close,
        messages, input, setInput, loading, streamingText,
        sendMessage, messagesEndRef, inputRef,
        suggestions,
        submitFeedback,
        lastBotMessageId,
        config,
    } = useChatbot();

    const [showFeedbackFor, setShowFeedbackFor] = useState(null);

    useEffect(() => {
        if (lastBotMessageId) {
            setShowFeedbackFor(lastBotMessageId);
        }
    }, [lastBotMessageId]);

    useEffect(() => {
        const handleOpen = () => { if (!open) toggle(); };
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, [open, toggle]);

    const widgetColor = config.widgetColor || '#0b92d5';
    const position = config.widgetPosition || 'bottom-right';

    return (
        <>
            <div className={`${getButtonPosition(position)} group`}>
                {/* Hover prompt hidden as requested */}
                {/* <div className={`absolute ${position.includes('left') ? 'bottom-full left-0 mb-4' : 'bottom-full right-0 mb-4'} w-64`}>
                    <div className={`bg-surface-container-lowest px-4 py-3 rounded-2xl shadow-xl border border-outline-variant transform transition-all ${open ? 'opacity-0 translate-y-2 pointer-events-none' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none'}`}>
                        <p className="text-sm font-medium text-on-surface">¿Tienes dudas sobre el liceo?</p>
                        <p className="text-xs text-on-surface-variant mt-1">Coll-Bot está en línea.</p>
                    </div>
                </div> */}
                <button 
                    onClick={toggle} 
                    className="w-16 h-16 rounded-2xl text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    style={{ backgroundColor: widgetColor, boxShadow: `0 20px 40px ${widgetColor}40` }}
                    aria-label={open ? 'Cerrar chatbot' : 'Abrir chatbot'}
                >
                    <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>{open ? 'close' : 'smart_toy'}</span>
                </button>
            </div>

            <div 
                className={`${getPositionClasses(position)} bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant ${open ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}
                role="dialog"
                aria-label="Chat con Coll-Bot"
            >
                <div className="p-4 flex items-center justify-between gap-3" style={{ backgroundColor: widgetColor }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">Coll-Bot Asistente</h4>
                            <p className="text-white/70 text-xs flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> En línea ahora
                            </p>
                        </div>
                    </div>
                    <button onClick={close} className="text-white/70 hover:text-white transition-colors" aria-label="Cerrar">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div className="p-4 space-y-4 bg-surface-container-low min-h-[350px] max-h-[450px] overflow-y-auto" role="log" aria-live="polite">
                    {messages.map((msg, i) => {
                        const isLastBotMessage = msg.role === 'bot' && i === messages.findIndex((m, idx) => idx > 0 && m.role === 'bot');
                        return (
                            <div key={i} className={`flex flex-col gap-1 ${msg.role === 'bot' ? 'items-start' : 'items-end'}`}>
                                <div
                                    className={`p-3 text-sm max-w-[85%] shadow-sm ${msg.role === 'bot' ? 'bg-surface-container-lowest text-on-surface rounded-2xl rounded-tl-none' : 'text-white rounded-2xl rounded-tr-none'}`}
                                    style={msg.role === 'user' ? { backgroundColor: widgetColor } : {}}
                                    dangerouslySetInnerHTML={{ __html: safeHtml(msg.text) }}
                                />
                                {msg.role === 'bot' && isLastBotMessage && !loading && showFeedbackFor === lastBotMessageId && config.feedbackEnabled && (
                                    <FeedbackButtons onFeedback={submitFeedback} disabled={loading} />
                                )}
                            </div>
                        );
                    })}
                    {streamingText && (
                        <div className="flex flex-col gap-1 items-start">
                            <div
                                className="bg-surface-container-lowest text-on-surface p-3 rounded-2xl rounded-tl-none text-sm max-w-[85%] shadow-sm"
                                dangerouslySetInnerHTML={{ __html: safeHtml(streamingText) }}
                            />
                        </div>
                    )}
                    {loading && !streamingText && config.typingIndicator && (
                        <div className="flex flex-col gap-2 items-start">
                            <div className="bg-surface-container-lowest text-on-surface p-3 rounded-2xl rounded-tl-none text-sm max-w-[85%] shadow-sm flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: widgetColor }}></span>
                                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: widgetColor, animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: widgetColor, animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                    {messages.length === 1 && !loading && suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {suggestions.map((s, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => sendMessage(s)} 
                                    className="text-xs bg-surface-container-lowest border border-outline-variant text-on-surface px-3 py-1.5 rounded-full hover:shadow-md transition-all cursor-pointer text-left"
                                    style={{ borderColor: `${widgetColor}40` }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        id="chatbot-input"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder={config.placeholder || 'Escribe tu pregunta...'}
                        className="flex-1 bg-surface-container-low border-none rounded-full px-4 py-2 text-on-surface text-sm focus:ring-1 outline-none"
                        style={{ '--tw-ring-color': widgetColor }}
                        aria-label="Escribe tu mensaje"
                        aria-required="false"
                        maxLength={500}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className="p-2 rounded-full flex items-center justify-center transition-colors"
                        style={{ color: widgetColor }}
                        aria-label="Enviar mensaje"
                    >
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                    </button>
                </div>
            </div>
        </>
    );
}
