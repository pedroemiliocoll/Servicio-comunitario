import { useState, useEffect } from 'react';

const DEFAULT_FALLBACK = '/assets/images/placeholder.jpg';

export function useWebPSupport() {
    const [supportsWebP, setSupportsWebP] = useState(false);

    useEffect(() => {
        const checkWebP = async () => {
            const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
            const img = new Image();
            img.onload = () => setSupportsWebP(true);
            img.onerror = () => setSupportsWebP(false);
            img.src = webpData;
        };
        checkWebP();
    }, []);

    return supportsWebP;
}

export function LazyImage({ 
    src, 
    alt, 
    className = '', 
    fallback = DEFAULT_FALLBACK,
    aspectRatio,
    sizes = '100vw',
    priority = false
}) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(fallback);

    useEffect(() => {
        if (!src) {
            setError(true);
            setCurrentSrc(fallback);
            return;
        }

        const img = new Image();
        img.src = src;
        
        img.onload = () => {
            setCurrentSrc(src);
            setLoaded(true);
            setError(false);
        };
        
        img.onerror = () => {
            setError(true);
            setCurrentSrc(fallback);
            setLoaded(true);
        };
    }, [src, fallback]);

    const containerStyle = aspectRatio ? {
        aspectRatio,
        position: 'relative',
        overflow: 'hidden'
    } : {};

    const imageStyle = {
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
    };

    return (
        <div className={`lazy-image-container ${className}`} style={containerStyle}>
            {!loaded && (
                <div 
                    className="absolute inset-0 bg-surface-container animate-pulse" 
                    style={{ background: 'linear-gradient(90deg, var(--color-surface-container) 0%, var(--color-surface-container-high) 50%, var(--color-surface-container) 100%)', backgroundSize: '200% 100%' }}
                />
            )}
            <img
                src={currentSrc}
                alt={alt || ''}
                className={`lazy-image ${loaded ? 'loaded' : ''} ${className}`}
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                fetchPriority={priority ? 'high' : 'auto'}
                onLoad={() => setLoaded(true)}
                onError={() => { setError(true); setCurrentSrc(fallback); }}
                style={imageStyle}
            />
            {error && !loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-container text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                </div>
            )}
        </div>
    );
}

export function ImageWithFallback({ 
    src, 
    alt, 
    className = '', 
    fallback = DEFAULT_FALLBACK,
    ...props 
}) {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImageSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImageSrc(fallback);
        }
    };

    return (
        <img
            src={imageSrc}
            alt={alt || ''}
            className={className}
            loading="lazy"
            onError={handleError}
            {...props}
        />
    );
}

export function Avatar({ 
    src, 
    alt, 
    size = 'md',
    className = '',
    fallback = null 
}) {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg'
    };

    const [imageSrc, setImageSrc] = useState(src);
    const [error, setError] = useState(false);

    useEffect(() => {
        setImageSrc(src);
        setError(false);
    }, [src]);

    const handleError = () => setError(true);

    if (error || !src) {
        return (
            <div className={`${sizes[size]} rounded-full bg-primary flex items-center justify-center text-white font-bold ${className}`}>
                {fallback ? (
                    <span className="material-symbols-outlined">{fallback}</span>
                ) : (
                    <span className="material-symbols-outlined">person</span>
                )}
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt || 'Avatar'}
            className={`${sizes[size]} rounded-full object-cover ${className}`}
            loading="lazy"
            onError={handleError}
        />
    );
}

export function ResponsiveImage({ 
    src, 
    srcSet,
    alt,
    className = '',
    fallback = DEFAULT_FALLBACK,
    ...props 
}) {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [error, setError] = useState(false);

    useEffect(() => {
        setCurrentSrc(src);
        setError(false);
    }, [src]);

    const handleError = () => {
        if (!error) {
            setError(true);
            setCurrentSrc(fallback);
        }
    };

    return (
        <picture>
            {!error && srcSet && <source srcSet={srcSet} type="image/webp" />}
            <img
                src={currentSrc}
                alt={alt || ''}
                className={className}
                loading="lazy"
                onError={handleError}
                {...props}
            />
        </picture>
    );
}

export default LazyImage;
