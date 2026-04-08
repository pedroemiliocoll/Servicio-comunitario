// server/routes/uploadRoutes.js — File upload with Vercel Blob + Sharp optimization
import { Router }      from 'express';
import { put, del }     from '@vercel/blob';
import sharp           from 'sharp';
import path            from 'path';
import { requireAuth } from '../middleware/auth.js';
import { nanoid }      from 'nanoid';

import multer          from 'multer';

const router = Router();

// Buffer limit for sharp processing (e.g., 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE_SIZE } });

/**
 * Optimiza una imagen antes de subirla a Vercel Blob.
 * Retorna un buffer con la imagen optimizada (WebP).
 */
async function optimizeImageBuffer(buffer) {
    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        // Siempre convertimos a WebP y redimensionamos a un máximo razonable (1920px)
        const optimizedBuffer = await image
            .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();

        return { buffer: optimizedBuffer, metadata };
    } catch (error) {
        console.error('Sharp optimization error:', error);
        throw error;
    }
}

/**
 * Versión simplificada para Vercel Blob:
 * Sube al Blob storage y retorna URL.
 */
export const uploadToBlob = async (fileBuffer, filename) => {
    const ext = path.extname(filename).toLowerCase();
    const uniqueName = `uploads/${nanoid()}${ext === '.webp' ? '.webp' : '.webp'}`; // Because we convert to webp
    
    const blob = await put(uniqueName, fileBuffer, {
        access: 'public',
        contentType: 'image/webp'
    });
    
    return blob.url;
};

/**
 * Endpoint de subida
 */
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se incluyó ninguna imagen.' });
        }

        const { buffer } = await optimizeImageBuffer(req.file.buffer);
        // Usamos el originalname para la base, aunque lo convertimos a webp.
        const url = await uploadToBlob(buffer, req.file.originalname);

        res.json({ url });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Fallo procesando y subiendo la imagen.' });
    }
});



// ... logic to delete blob
router.delete('/:filename', requireAuth, async (req, res) => {
    // Vercel Blob usa URLs completas para borrar
    const { url } = req.body; // El cliente debe enviar la URL
    if (!url) return res.status(400).json({ error: 'URL requerida para borrar' });
    
    try {
        await del(url);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
