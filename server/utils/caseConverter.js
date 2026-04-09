/**
 * server/utils/caseConverter.js
 * Universal utility for recursive case conversion and SQLite date formatting.
 */

/**
 * Converts camelCase string to snake_case
 */
export function camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Formats SQLite date strings (Turso/Drizzle) to ISO
 */
export function formatSQLiteDate(value) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value)) {
        let iso = value.replace(' ', 'T');
        if (!iso.endsWith('Z')) {
            iso += 'Z';
        }
        return iso;
    }
    return value;
}

/**
 * Recursively converts an object's keys from camelCase to snake_case
 * Handles arrays, nested objects, and BigInts.
 */
export function toSnakeCase(obj) {
    if (obj === null || obj === undefined) return obj;
    
    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => toSnakeCase(item));
    }
    
    // Handle primitive types and Dates
    if (typeof obj !== 'object' || obj instanceof Date) {
        if (typeof obj === 'bigint') return Number(obj);
        return formatSQLiteDate(obj);
    }
    
    // Handle objects
    const result = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        const snakeKey = camelToSnake(key);
        
        // Recursive step
        result[snakeKey] = toSnakeCase(value);
    }
    
    return result;
}

export default { toSnakeCase, camelToSnake, formatSQLiteDate };
