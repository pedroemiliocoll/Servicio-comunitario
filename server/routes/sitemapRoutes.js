// server/routes/sitemapRoutes.js - Sitemap XML dinámico mejorado
import { Router } from 'express';
import { db } from '../config/database.js';
import { news, events, gallery } from '../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';

const router = Router();

const BASE_URL = process.env.BASE_URL || 'https://uenpedroemiliocoll.edu.ve';
const SITEMAP_CACHE_TIME = 3600000;

let cachedSitemap = null;
let cacheTimestamp = 0;

const STATIC_PAGES = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/noticias', changefreq: 'daily', priority: '0.9' },
    { loc: '/calendario', changefreq: 'weekly', priority: '0.8' },
    { loc: '/academico', changefreq: 'monthly', priority: '0.9' },
    { loc: '/instalaciones', changefreq: 'monthly', priority: '0.7' },
    { loc: '/galeria', changefreq: 'weekly', priority: '0.8' },
    { loc: '/eponimo', changefreq: 'monthly', priority: '0.6' },
    { loc: '/contacto', changefreq: 'monthly', priority: '0.7' },
];

function generateUrlElement(loc, changefreq, priority, lastmod = null) {
    let xml = `  <url>\n    <loc>${BASE_URL}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>`;
    if (lastmod) xml += `\n    <lastmod>${lastmod}</lastmod>`;
    xml += '\n  </url>';
    return xml;
}

function generateImageElement(url, title) {
    return `    <image:image>\n      <image:loc>${url}</image:loc>\n      <image:title>${title}</image:title>\n    </image:image>`;
}

function generateSitemap(pages, newsList, eventList, galleryList) {
    const now = new Date().toISOString().split('T')[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;
    
    for (const page of pages) {
        xml += generateUrlElement(page.loc, page.changefreq, page.priority, now) + '\n';
    }

    for (const item of newsList) {
        const date = item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : now;
        xml += generateUrlElement(`/noticias/${item.id}`, 'weekly', '0.7', date);
        if (item.image_url) {
            xml += `\n${generateImageElement(item.image_url, item.titulo)}\n  </url>\n`;
        } else {
            xml += '\n';
        }
    }

    for (const item of eventList) {
        const date = item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : now;
        xml += generateUrlElement(`/calendario`, 'weekly', '0.6', date) + '\n';
    }

    for (const item of galleryList) {
        const date = item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : now;
        xml += generateUrlElement(`/galeria`, 'monthly', '0.6', date);
        if (item.image_url) {
            xml += `\n${generateImageElement(item.image_url, item.titulo || 'Galería')}\n  </url>\n`;
        } else {
            xml += '\n';
        }
    }

    xml += '</urlset>';
    return xml;
}

async function getCachedSitemap() {
    const now = Date.now();
    if (cachedSitemap && (now - cacheTimestamp) < SITEMAP_CACHE_TIME) return cachedSitemap;
    
    try {
        const newsList = await db.select().from(news).where(eq(news.status, 'published')).orderBy(desc(news.fecha)).limit(500);
        const eventList = await db.select().from(events).orderBy(desc(events.fecha)).limit(100);
        const galleryList = await db.select().from(gallery).orderBy(desc(gallery.createdAt)).limit(200);
        
        cachedSitemap = generateSitemap(STATIC_PAGES, newsList, eventList, galleryList);
        cacheTimestamp = now;
        return cachedSitemap;
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return generateSitemap(STATIC_PAGES, [], [], []);
    }
}

router.get('/sitemap.xml', async (_req, res) => {
    try {
        const xml = await getCachedSitemap();
        res.type('application/xml');
        res.send(xml);
    } catch (error) {
        res.status(500).send('Error generating sitemap');
    }
});

router.get('/sitemap-index.xml', (_req, res) => {
    const now = new Date().toISOString();
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${BASE_URL}/api/sitemap/sitemap.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>\n</sitemapindex>`);
});

router.get('/robots.txt', (_req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/api/sitemap/sitemap.xml`);
});

router.get('/sitemap-news.xml', async (_req, res) => {
    const now = new Date().toISOString();
    const newsList = await db.select().from(news).where(eq(news.status, 'published')).orderBy(desc(news.fecha)).limit(100);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;
    
    for (const item of newsList) {
        const date = item.fecha ? new Date(item.fecha).toISOString() : now;
        xml += `  <url>\n    <loc>${BASE_URL}/noticias/${item.id}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>U.E.N. Pedro Emilio Coll</news:name>\n        <news:language>es</news:language>\n      </news:publication>\n      <news:publication_date>${date}</news:publication_date>\n      <news:title>${item.titulo}</news:title>\n    </news:news>\n  </url>\n`;
    }
    
    xml += '</urlset>';
    res.type('application/xml');
    res.send(xml);
});

export default router;
