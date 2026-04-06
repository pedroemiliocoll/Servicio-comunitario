
// Simulation of the SSE buffering logic in geminiService.js
function simulateSSE(chunks) {
    let buffer = '';
    let output = [];
    const decoder = { decode: (v) => v }; // Mock decoder

    for (const value of chunks) {
        buffer += decoder.decode(value);
        
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
            
            if (trimmedLine.startsWith('data: ')) {
                try {
                    const data = JSON.parse(trimmedLine.slice(6));
                    const text = data.choices?.[0]?.delta?.content || '';
                    if (text) {
                        output.push(text);
                    }
                } catch (err) {
                    buffer = trimmedLine + '\n' + buffer;
                }
            }
        }
    }
    return output.join('');
}

// Test case: Fragmented JSON across chunks
const chunks = [
    'data: {"choices": [{"delta": {"content": "Ho"}}]}\n',
    'data: {"choices": [{"delt',
    'a": {"content": "la"}}]}\n',
    'data: {"choices": [{"delta": {"content": " com"}}]}\n',
    'data: {"choices": [{"delta": {"con',
    'tent": "o "}}]}\n',
    'data: {"choices": [{"delta": {"content": "estas"}}]}\n',
    'data: [DONE]\n'
];

const result = simulateSSE(chunks);
console.log('Result:', result);
if (result === 'Hola como estas') {
    console.log('TEST PASSED');
} else {
    console.log('TEST FAILED');
    process.exit(1);
}
