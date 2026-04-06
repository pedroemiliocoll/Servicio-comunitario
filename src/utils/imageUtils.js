const CDN_BASE = '';

export function optimizeImageUrl(url, options = {}) {
    if (!url) return null;
    
    if (url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    const {
        width,
        height,
        format = 'webp',
        quality = 80
    } = options;

    if (CDN_BASE) {
        const params = new URLSearchParams();
        if (width) params.set('w', width);
        if (height) params.set('h', height);
        if (format) params.set('f', format);
        if (quality) params.set('q', quality);
        
        return `${CDN_BASE}/${url}${params.toString() ? '?' + params.toString() : ''}`;
    }

    return url;
}

export function generateSrcSet(url, widths = [320, 640, 960, 1280]) {
    if (!url || !CDN_BASE) return null;
    
    return widths
        .map(w => `${optimizeImageUrl(url, { width: w })} ${w}w`)
        .join(', ');
}

export function getImageDimensions(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = () => {
            resolve({ width: 0, height: 0 });
            URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(file);
    });
}

export function compressImage(file, options = {}) {
    const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.8,
        type = 'image/jpeg'
    } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Error compressing image'));
                    }
                },
                type,
                quality
            );
        };
        img.onerror = () => reject(new Error('Error loading image'));
        img.src = URL.createObjectURL(file);
    });
}

export const IMAGE_MIME_TYPES = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml'
};

export function validateImageType(file) {
    const validTypes = Object.values(IMAGE_MIME_TYPES);
    return validTypes.includes(file.type);
}

export function validateImageSize(file, maxSizeMB = 5) {
    return file.size <= maxSizeMB * 1024 * 1024;
}

export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const PLACEHOLDER_IMAGES = {
    news: '/assets/images/news-fallback.jpg',
    gallery: '/assets/images/gallery-fallback.jpg',
    profile: '/assets/images/profile-fallback.jpg',
    school: '/assets/images/hero-facade.png',
    logo: '/assets/images/logo.png'
};
