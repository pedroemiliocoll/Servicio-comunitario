
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/test-sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const text = "Para realizar la inscripción en el U.E.N. Pedro Emilio Coll, se requiere presentar los siguientes documentos: Cédula del representante, Partida de nacimiento, Notas del año anterior, 2 fotos y Constancia de residencia. Es importante mencionar que las inscripciones son entre julio y agosto. Si necesita más información, no dude en preguntar.";
    
    let i = 0;
    const interval = setInterval(() => {
        if (i >= text.length) {
            res.write('data: [DONE]\n\n');
            res.end();
            clearInterval(interval);
            return;
        }
        
        // Enviamos de 1 a 3 caracteres cada vez para simular fragmentación agresiva
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const chunk = text.slice(i, i + chunkSize);
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        i += chunkSize;
    }, 50);
});

app.listen(3002, () => {
    console.log('Test SSE server running on http://localhost:3002/test-sse');
});
