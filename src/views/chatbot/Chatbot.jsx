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
                ¡Gracias!
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
                title="Sí"
            >
                <span className="material-symbols-outlined text-base">thumb_up</span>
            </button>
            <button
                onClick={() => handleFeedback('negative')}
                disabled={disabled}
                className="p-1.5 rounded-full hover:bg-red-100 text-red-500 disabled:cursor-not-allowed transition-colors"
                title="No"
            >
                <span className="material-symbols-outlined text-base">thumb_down</span>
            </button>
        </div>
    );
}

function getPositionClasses(position) {
    const base = 'z-[100] w-[calc(100%-0.5rem)] sm:max-w-sm transition-all duration-300';
    switch (position) {
        case 'bottom-left':
            return `${base} fixed bottom-24 sm:bottom-28 left-2 sm:left-8 origin-bottom-left`;
        case 'top-right':
            return `${base} fixed top-16 sm:top-20 right-2 sm:right-8 origin-top-right`;
        case 'top-left':
            return `${base} fixed top-16 sm:top-20 left-2 sm:left-8 origin-top-left`;
        case 'bottom-right':
        default:
            return `${base} fixed bottom-24 sm:bottom-28 right-2 sm:right-8 origin-bottom-right`;
    }
}

function getButtonPosition(position) {
    const base = 'z-[100]';
    switch (position) {
        case 'bottom-left':
            return `${base} fixed bottom-4 sm:bottom-8 left-2 sm:left-8`;
        case 'top-right':
            return `${base} fixed top-16 sm:top-20 right-2 sm:right-8`;
        case 'top-left':
            return `${base} fixed top-16 sm:top-20 left-2 sm:left-8`;
        case 'bottom-right':
        default:
            return `${base} fixed bottom-4 sm:bottom-8 right-2 sm:right-8`;
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
            {/* Floating Button */}
            <div className={`${getButtonPosition(position)} group`}>
                <button 
                    onClick={toggle} 
                    className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    style={{ backgroundColor: widgetColor, boxShadow: `0 20px 40px ${widgetColor}40` }}
                    aria-label={open ? 'Cerrar chatbot' : 'Abrir chatbot'}
                >
                    <span className="material-symbols-outlined text-2xl sm:text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>{open ? 'close' : 'smart_toy'}</span>
                </button>
            </div>

            {/* Chat Window */}
            <div 
                className={`${getPositionClasses(position)} bg-surface-container-lowest rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-outline-variant ${open ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}
                role="dialog"
                aria-label="Chat con Coll-Bot"
            >
                {/* Header */}
                <div className="p-3 sm:p-4 flex items-center justify-between gap-3" style={{ backgroundColor: widgetColor }}>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-xs sm:text-sm">Coll-Bot</h4>
                            <p className="text-white/70 text-[10px] sm:text-xs flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> En línea
                            </p>
                        </div>
                    </div>
                    <button onClick={close} className="text-white/70 hover:text-white transition-colors p-1" aria-label="Cerrar">
                        <span className="material-symbols-outlined text-lg sm:text-xl">close</span>
                    </button>
                </div>

                {/* Messages */}
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-surface-container-low min-h-[250px] sm:min-h-[300px] md:min-h-[350px] max-h-[300px] sm:max-h-[350px] md:max-h-[450px] overflow-y-auto" role="log" aria-live="polite">
                    {messages.map((msg, i) => {
                        const isLastBotMessage = msg.role === 'bot' && i === messages.findIndex((m, idx) => idx > 0 && m.role === 'bot');
                        return (
                            <div key={i} className={`flex flex-col gap-1 ${msg.role === 'bot' ? 'items-start' : 'items-end'}`}>
                                <div
                                    className={`p-2 sm:p-3 text-xs sm:text-sm max-w-[85%] shadow-sm ${msg.role === 'bot' ? 'bg-surface-container-lowest text-on-surface rounded-xl sm:rounded-2xl rounded-tl-none' : 'text-white rounded-xl sm:rounded-2xl rounded-tr-none'}`}
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
                                className="bg-surface-container-lowest text-on-surface p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tl-none text-xs sm:text-sm max-w-[85%] shadow-sm"
                                dangerouslySetInnerHTML={{ __html: safeHtml(streamingText) }}
                            />
                        </div>
                    )}
                    {loading && !streamingText && config.typingIndicator && (
                        <div className="flex flex-col gap-2 items-start">
                            <div className="bg-surface-container-lowest text-on-surface p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-tl-none text-xs sm:text-sm max-w-[85%] shadow-sm flex items-center gap-1">
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
                                    className="text-xs bg-surface-container-lowest border border-outline-variant text-on-surface px-2 sm:px-3 py-1.5 rounded-full hover:shadow-md transition-all cursor-pointer text-left"
                                    style={{ borderColor: `${widgetColor}40` }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-2 sm:p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        id="chatbot-input"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder={config.placeholder || 'Escribe tu pregunta...'}
                        className="flex-1 bg-surface-container-low border-none rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-on-surface text-xs sm:text-sm focus:ring-1 outline-none"
                        style={{ '--tw-ring-color': widgetColor }}
                        aria-label="Escribe tu mensaje"
                        aria-required="false"
                        maxLength={500}
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className="p-1.5 sm:p-2 rounded-full flex items-center justify-center transition-colors"
                        style={{ color: widgetColor }}
                        aria-label="Enviar mensaje"
                    >
                        <span className="material-symbols-outlined text-lg sm:text-xl" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                    </button>
                </div>
            </div>
        </>
    );
}