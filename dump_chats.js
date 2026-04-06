
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = 'c:\\Users\\samue\\Documents\\UNETI clases\\Trayecto 2 modulo 2\\Servicio comunitario\\server\\data\\liceo.db';
const db = new Database(DB_PATH);

try {
    const rows = db.prepare('SELECT id, session_id, role, content FROM chat_conversations ORDER BY id DESC LIMIT 20').all();
    console.log(JSON.stringify(rows, null, 2));
} catch (e) {
    console.error(e);
}
