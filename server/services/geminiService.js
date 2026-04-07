// server/services/geminiService.js — Service: Proxy seguro para la API de Gemini
// La API key NUNCA sale del servidor, protegiendo las credenciales del usuario.
import { SettingsModel } from '../models/SettingsModel.js';
import { AiConfigModel } from '../models/AiConfigModel.js';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const AI_MODEL = 'llama-3.3-70b-versatile';

function safeLog(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const safeMeta = { ...meta };
    if (safeMeta.apiKey) safeMeta.apiKey = '[OCULTO]';
    if (safeMeta.authorization) safeMeta.authorization = '[OCULTO]';
    
    if (process.env.NODE_ENV !== 'production' || level === 'error') {
        console[level](`[${timestamp}] [GeminiService] ${message}`, safeMeta);
    }
}

/**
 * Construye el system prompt dinámicamente combinando:
 * 1. Información actual del liceo (desde DB)
 * 2. Configuración de IA (tono, restricciones, prompt personalizado)
 * 3. Respuestas personalizadas del admin (FAQ)
 */
function buildSystemPrompt(liceoInfo, aiConfig, customResponses) {
    let prompt = aiConfig.system_prompt || AiConfigModel.getDefaultPromptTemplate();

    // Reemplazar placeholders con datos reales del liceo
    prompt = prompt
        .replace('{nombre}', liceoInfo.nombre)
        .replace('{mision}', liceoInfo.mision || 'Por definir')
        .replace('{vision}', liceoInfo.vision || 'Por definir')
        .replace('{direccion}', liceoInfo.ubicacion?.direccion || 'Por definir')
        .replace('{telefono}', liceoInfo.contacto?.telefono || 'Por definir')
        .replace('{email}', liceoInfo.contacto?.email || 'Por definir')
        .replace('{horario_entrada}', liceoInfo.horario?.entrada || '7:00 AM')
        .replace('{horario_salida}', liceoInfo.horario?.salida || '1:00 PM')
        .replace('{niveles}', (liceoInfo.niveles_educativos || []).join(', '));

    // Insertar tono de respuesta
    const toneInstructions = {
        formal: 'Usa un tono formal y profesional.',
        amigable: 'Usa un tono amigable y cercano.',
        profesional: 'Usa un tono profesional pero accesible.',
    };
    const toneText = toneInstructions[aiConfig.tone] || toneInstructions.amigable;

    // Insertar respuestas personalizadas como contexto prioritario
    let customInstructions = `\nEstilo de respuesta: ${toneText}`;
    if (customResponses && customResponses.length > 0) {
        customInstructions += '\n\nRespuestas prioritarias para estas preguntas frecuentes:';
        customResponses.forEach(r => {
            customInstructions += `\n- Si preguntan sobre "${r.trigger}", responde: "${r.response}"`;
        });
    }

    if (aiConfig.only_school) {
        customInstructions += '\n\nIMPORTANTE: Solo responde preguntas relacionadas con el liceo. Si preguntan sobre otro tema, amablemente redirígelos a preguntar sobre el liceo.';
    }

    prompt = prompt.replace('{custom_instructions}', customInstructions);
    return prompt;
}

/**
 * Envía un mensaje a Gemini con retry logic.
 */
export async function streamChatMessage(message, res, onContent) {
    let apiKey = (await SettingsModel.getApiKey()) || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.write(`data: ${JSON.stringify({ error: 'API key no configurada. Ve al panel de admin → Configuración.' })}\n\n`);
        res.end();
        return;
    }
    apiKey = apiKey.trim();

    const liceoInfo = await SettingsModel.getLiceoInfo();
    const aiConfig  = await AiConfigModel.getConfig();
    const customResponses = await AiConfigModel.getEnabledResponses();
    const systemPrompt = buildSystemPrompt(liceoInfo, aiConfig, customResponses);

    let fullText = '';
    const MAX_RETRIES = 2;
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
        attempt++;
        try {
            const payload = {
                model: AI_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                stream: true
            };

            const groqRes = await fetch(GROQ_ENDPOINT, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (groqRes.status === 429) {
                if (attempt <= MAX_RETRIES) {
                    safeLog('warn', 'Rate limited, retrying...', { attempt });
                    await new Promise(r => setTimeout(r, 1000 * attempt));
                    continue;
                }
            }

            if (!groqRes.ok) {
                safeLog('error', 'API request failed', { status: groqRes.status });
                res.write(`data: ${JSON.stringify({ error: 'Error al procesar tu solicitud. Intenta de nuevo.' })}\n\n`);
                res.end();
                return;
            }

            const reader = groqRes.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                
                const lines = buffer.split(/\r?\n/);
                buffer = lines.pop();

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
                    
                    const parts = trimmedLine.split('data: ');
                    for (const part of parts) {
                        const raw = part.trim();
                        if (!raw || raw === '[DONE]') continue;
                        try {
                            const data = JSON.parse(raw);
                            const text = data.choices?.[0]?.delta?.content || '';
                            if (text) {
                                fullText += text;
                                res.write(`data: ${JSON.stringify({ text })}\n\n`);
                            }
                        } catch (err) { }
                    }
                }
            }

            if (onContent) onContent(fullText);
            res.write('data: [DONE]\n\n');
            res.end();
            return;

        } catch (err) {
            if (attempt <= MAX_RETRIES && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')) {
                safeLog('warn', 'Connection error, retrying...', { attempt, code: err.code });
                await new Promise(r => setTimeout(r, 1000 * attempt));
                continue;
            }
            safeLog('error', 'Connection error', { code: err.code });
            res.write(`data: ${JSON.stringify({ error: 'Error de conexión. Verifica tu internet e intenta de nuevo.' })}\n\n`);
            res.end();
            return;
        }
    }
}
