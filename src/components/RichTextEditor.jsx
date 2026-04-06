import React, { useRef, useEffect, useCallback } from 'react';

const ToolbarButton = ({ icon, onClick, active, title }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-2 rounded-lg transition-colors ${
            active 
                ? 'bg-primary text-white' 
                : 'text-on-surface-variant hover:bg-surface-container-low'
        }`}
    >
        <span className="material-symbols-outlined text-lg">{icon}</span>
    </button>
);

export default function RichTextEditor({ value, onChange, placeholder }) {
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            if (document.activeElement !== editorRef.current) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    const handleLink = () => {
        const url = prompt('Ingresa la URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const handleImage = () => {
        const url = prompt('Ingresa la URL de la imagen:');
        if (url) {
            execCommand('insertImage', url);
        }
    };

    const toolbarButtons = [
        { icon: 'format_bold', command: 'bold', title: 'Negrita (Ctrl+B)' },
        { icon: 'format_italic', command: 'italic', title: 'Cursiva (Ctrl+I)' },
        { icon: 'format_underlined', command: 'underline', title: 'Subrayado (Ctrl+U)' },
        { icon: 'strikethrough_s', command: 'strikeThrough', title: 'Tachado' },
        { type: 'divider' },
        { icon: 'title', command: 'formatBlock', value: 'h2', title: 'Título' },
        { icon: 'format_size', command: 'formatBlock', value: 'h3', title: 'Subtítulo' },
        { icon: 'format_quote', command: 'formatBlock', value: 'blockquote', title: 'Cita' },
        { type: 'divider' },
        { icon: 'format_list_bulleted', command: 'insertUnorderedList', title: 'Lista con viñetas' },
        { icon: 'format_list_numbered', command: 'insertOrderedList', title: 'Lista numerada' },
        { type: 'divider' },
        { icon: 'link', command: handleLink, title: 'Insertar enlace' },
        { icon: 'image', command: handleImage, title: 'Insertar imagen' },
        { type: 'divider' },
        { icon: 'undo', command: 'undo', title: 'Deshacer' },
        { icon: 'redo', command: 'redo', title: 'Rehacer' },
    ];

    return (
        <div className="border border-outline-variant/20 rounded-2xl overflow-hidden bg-surface-container-low">
            <div className="flex flex-wrap items-center gap-1 p-2 bg-surface-container border-b border-outline-variant/10">
                {toolbarButtons.map((btn, i) => 
                    btn.type === 'divider' ? (
                        <div key={i} className="w-px h-6 bg-outline-variant/20 mx-1" />
                    ) : (
                        <ToolbarButton
                            key={i}
                            icon={btn.icon}
                            title={btn.title}
                            onClick={() => {
                                if (typeof btn.command === 'function') {
                                    btn.command();
                                } else if (btn.value) {
                                    execCommand(btn.command, btn.value);
                                } else {
                                    execCommand(btn.command);
                                }
                            }}
                        />
                    )
                )}
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onBlur={() => onChange(editorRef.current?.innerHTML || '')}
                className="min-h-[200px] p-4 bg-surface-container-low text-on-surface font-sans text-sm focus:outline-none prose prose-sm max-w-none"
                style={{ 
                    minHeight: '200px',
                    lineHeight: '1.6'
                }}
                data-placeholder={placeholder || 'Escribe el contenido aquí...'}
            />
            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: rgb(var(--on-surface-variant) / 0.4);
                    pointer-events: none;
                }
                [contenteditable] h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; }
                [contenteditable] h3 { font-size: 1.25rem; font-weight: 600; margin: 0.75rem 0 0.5rem; }
                [contenteditable] blockquote { 
                    border-left: 4px solid rgb(var(--primary)); 
                    padding-left: 1rem; 
                    margin: 1rem 0; 
                    font-style: italic;
                    color: rgb(var(--on-surface-variant));
                }
                [contenteditable] ul, [contenteditable] ol { margin: 0.5rem 0; padding-left: 1.5rem; }
                [contenteditable] li { margin: 0.25rem 0; }
                [contenteditable] a { color: rgb(var(--primary)); text-decoration: underline; }
                [contenteditable] img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 0.5rem 0; }
            `}</style>
        </div>
    );
}
