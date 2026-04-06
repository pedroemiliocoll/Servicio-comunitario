
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = 'c:\\Users\\samue\\Documents\\UNETI clases\\Trayecto 2 modulo 2\\Servicio comunitario\\server\\data\\liceo.db';
const db = new Database(DB_PATH);

console.log('--- ai_config ---');
console.log(JSON.stringify(db.prepare('SELECT * FROM ai_config').all(), null, 2));

console.log('\n--- ai_custom_responses ---');
console.log(JSON.stringify(db.prepare('SELECT * FROM ai_custom_responses').all(), null, 2));

console.log('\n--- settings ---');
console.log(JSON.stringify(db.prepare('SELECT * FROM settings').all(), null, 2));
