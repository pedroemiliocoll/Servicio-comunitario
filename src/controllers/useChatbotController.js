// useChatbotController.js — Controller: Lógica del chatbot para la View
import { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../services/chatbotService.js';

const formatMessage = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

const SESSION_KEY = 'collbot_session_id';

const DEFAULT_CONFIG = {
    welcomeMessage: '👋 ¡Hola! Soy el asistente virtual del **Liceo Pedro Emilio Coll**. ¿En qué puedo ayudarte hoy?',
    errorMessage: '❌ Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentar de nuevo?',
    placeholder: 'Escribe tu pregunta...',
    suggestions: ['📋 Inscripciones', '📚 Horarios', '📞 Contacto', '🏫 Sobre el Liceo'],
    feedbackEnabled: true,
    historyEnabled: true,
    typingIndicator: true,
    widgetColor: '#0b92d5',
    widgetPosition: 'bottom-right',
};

function getSessionId() {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
        sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
}

export function useChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [sessionId, setSessionId] = useState(getSessionId);
    const [lastBotMessageId, setLastBotMessageId] = useState(null);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const historyLoaded = useRef(false);
    const configLoaded = useRef(false);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const cfg = await chatbotService.getChatbotConfig();
                setConfig(cfg);
                configLoaded.current = true;
            } catch (err) {
                console.error('Error cargando config:', err);
                configLoaded.current = true;
            }
        };
        if (!configLoaded.current) {
            loadConfig();
        }
    }, []);

    useEffect(() => {
        if (open && !historyLoaded.current && (config.history_enabled !== undefined ? config.history_enabled : config.historyEnabled)) {
            loadHistory();
        }
        if (open && messages.length === 0) {
            setMessages([{ role: 'bot', text: config.welcome_message || config.welcomeMessage }]);
        }
    }, [open]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingText]);

    const loadHistory = async () => {
        try {
            const data = await chatbotService.getHistory(sessionId);
            if (data.messages && data.messages.length > 0) {
                const historyMessages = data.messages.map(m => ({
                    role: m.role === 'assistant' ? 'bot' : 'user',
                    text: m.content
                }));
                setMessages(historyMessages);
            }
            historyLoaded.current = true;
        } catch (err) {
            historyLoaded.current = true;
        }
    };

    const toggle = () => {
        setOpen(prev => !prev);
        if (!open) setTimeout(() => inputRef.current?.focus(), 300);
    };

    const sendMessage = async (text = null) => {
        const msg = text || input.trim();
        if (!msg || loading) return;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setLoading(true);
        setStreamingText('');

        try {
            let currentSessionId = sessionId;
            const result = await chatbotService.sendMessage(msg, sessionId, (data) => {
                if (data.sessionId && data.sessionId !== currentSessionId) {
                    currentSessionId = data.sessionId;
                    setSessionId(data.sessionId);
                    sessionStorage.setItem(SESSION_KEY, data.sessionId);
                }
                if (data.text) {
                    setStreamingText(prev => prev + data.text);
                }
            });
            
            setMessages(prev => [...prev, { role: 'bot', text: result }]);
            setStreamingText('');
            setLastBotMessageId(Date.now());
        } catch (err) {
            console.error('Chatbot error:', err);
            const errMsg = err.message.includes('429')
                ? '⏳ Demasiadas solicitudes. Espera un momento e intenta de nuevo.'
                : err.message.includes('API key')
                ? '⚠️ La API key no está configurada. Ve a **Admin → Configuración** para agregarla.'
                : config.error_message || config.errorMessage || '❌ Hubo un error. Intenta de nuevo.';
            setMessages(prev => [...prev, { role: 'bot', text: errMsg }]);
        }
        setLoading(false);
    };

    const submitFeedback = async (rating) => {
        if (!config.feedbackEnabled) return false;
        try {
            await chatbotService.submitFeedback(sessionId, rating);
            return true;
        } catch (err) {
            console.error('Feedback error:', err);
            return false;
        }
    };

    return {
        open, toggle, close: () => setOpen(false),
        messages, input, setInput, loading, streamingText,
        sendMessage, messagesEndRef, inputRef,
        suggestions: config.suggestions,
        feedbackEnabled: config.feedback_enabled !== undefined ? config.feedback_enabled : config.feedbackEnabled,
        formatMessage,
        submitFeedback,
        lastBotMessageId,
        config,
    };
}
