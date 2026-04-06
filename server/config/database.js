// server/config/database.js
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  DATABASE ADAPTER LAYER: Turso (libSQL) + Drizzle ORM                   │
// └─────────────────────────────────────────────────────────────────────────┘

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../db/schema.js';

// Setup connection details
const isVercel = !!process.env.VERCEL;
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Hard-force URL for Vercel
const connectionUrl = (isVercel && url) ? url : (url || 'file:server/data/liceo.db');

if (isVercel && !url) {
    console.error('❌ CRITICAL: TURSO_DATABASE_URL is missing in Vercel environment!');
}

// Create libSQL client
const client = createClient({
    url: connectionUrl,
    authToken: authToken,
});

// Initialize Drizzle
export const db = drizzle(client, { schema });

// Export the client for direct access if needed (e.g., transactions)
export { client };

/**
 * En Turso, no necesitamos "inicializar" con CREATE TABLE manual si usamos drizzle-kit push/migrate.
 * Pero para desarrollo local, podemos llamar a esto si es necesario.
 */
export async function initializeDatabase() {
    console.log('📡 Database connection established via Turso/libSQL');
    // En producción con Turso, las migraciones se manejan vía CLI (drizzle-kit push)
    if (process.env.NODE_ENV !== 'production' && url.startsWith('file:')) {
        console.log('🏠 Local SQLite mode detected');
    }
}
