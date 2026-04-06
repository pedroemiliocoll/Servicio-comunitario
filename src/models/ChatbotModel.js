// ChatbotModel.js — Model (LEGACY - mantiene compatibilidad)
// La lógica del chatbot ahora está en src/services/chatbotService.js y en el backend.
// Este archivo se puede eliminar en una futura limpieza.

export const SUGGESTIONS = ['📋 Inscripciones', '📚 Horarios', '📞 Contacto', '🏫 Sobre el Liceo'];

export const formatMessage = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
