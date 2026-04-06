import { useState, useRef, useCallback } from 'react';
import { uploadFile } from '../services/uploadService';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export default function ImageUploader({ 
    value = '',
    onChange,
    placeholder = 'Arrastra una imagen aquí o haz clic para seleccionar',
    disabled = false,
    className = ''
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(value);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Solo se permiten archivos JPG, PNG, GIF o WebP';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'El archivo debe ser menor a 5MB';
        }
        return null;
    };

    const handleUpload = async (file) => {
        const errorMsg = validateFile(file);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        setError('');
        setUploading(true);

        try {
            const data = await uploadFile(file);
            setPreview(data.url);
            onChange?.(data.url);
        } catch (err) {
            setError(err.message || 'Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    }, [disabled]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) handleUpload(file);
        e.target.value = '';
    };

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        setPreview('');
        onChange?.('');
        setError('');
    };

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setPreview(url);
        onChange?.(url);
        setError('');
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || uploading}
            />

            {preview ? (
                <div className="relative rounded-2xl overflow-hidden bg-surface-container border border-outline-variant">
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover"
                        onError={() => setError('No se pudo cargar la imagen')}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            title="Eliminar imagen"
                        >
                            <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                    className={`
                        relative h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer
                        flex flex-col items-center justify-center gap-3
                        ${isDragging 
                            ? 'border-primary bg-primary/5' 
                            : 'border-outline-variant hover:border-primary hover:bg-primary/5'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${uploading ? 'pointer-events-none' : ''}
                    `}
                >
                    {uploading ? (
                        <>
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-on-surface-variant">Subiendo imagen...</p>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                                cloud_upload
                            </span>
                            <p className="text-sm text-on-surface-variant text-center px-4">
                                {placeholder}
                            </p>
                            <p className="text-xs text-on-surface-variant/60">
                                Máx. 5MB • JPG, PNG, GIF, WebP
                            </p>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="text-sm text-error flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </p>
            )}

            <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-outline-variant"></div>
                <span className="text-xs text-on-surface-variant">o</span>
                <div className="flex-1 h-px bg-outline-variant"></div>
            </div>

            <div className="relative">
                <input
                    type="url"
                    value={showUrlInput ? preview : ''}
                    onChange={handleUrlChange}
                    onFocus={() => setShowUrlInput(true)}
                    placeholder="O pega una URL de imagen..."
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                    disabled={disabled || uploading}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-xl">
                    link
                </span>
            </div>
        </div>
    );
}
