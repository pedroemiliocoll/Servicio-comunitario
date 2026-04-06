// server/services/imageOptimizer.js
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

export async function optimizeImage(inputPath, outputName, options = {}) {
    const {
        width = null,
        height = null,
        quality = 80,
        format = 'webp'
    } = options;

    const outputPath = path.join(UPLOADS_DIR, `${outputName}.${format}`);
    
    let pipeline = sharp(inputPath);
    
    if (width || height) {
        pipeline = pipeline.resize(width, height, { fit: 'inside', withoutEnlargement: true });
    }
    
    if (format === 'webp') {
        pipeline = pipeline.webp({ quality });
    } else if (format === 'avif') {
        pipeline = pipeline.avif({ quality });
    } else if (format === 'jpeg') {
        pipeline = pipeline.jpeg({ quality });
    }
    
    await pipeline.toFile(outputPath);
    
    return {
        path: `/uploads/${outputName}.${format}`,
        size: fs.statSync(outputPath).size
    };
}

export async function generateResponsiveImages(inputPath, baseName) {
    const sizes = [
        { width: 320, suffix: 'sm' },
        { width: 640, suffix: 'md' },
        { width: 1024, suffix: 'lg' },
        { width: 1920, suffix: 'xl' }
    ];
    
    const results = [];
    
    for (const size of sizes) {
        const outputName = `${baseName}-${size.suffix}`;
        const result = await optimizeImage(inputPath, outputName, {
            width: size.width,
            quality: 75,
            format: 'webp'
        });
        results.push(result);
    }
    
    return results;
}

export async function getImageMetadata(inputPath) {
    const metadata = await sharp(inputPath).metadata();
    return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: fs.statSync(inputPath).size
    };
}
