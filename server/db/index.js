import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_PATH || join(__dirname, 'balloon_crm.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Helper to run queries with better error handling
export const query = (sql, params = []) => {
    try {
        return db.prepare(sql).all(params);
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

export const queryOne = (sql, params = []) => {
    try {
        return db.prepare(sql).get(params);
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

export const run = (sql, params = []) => {
    try {
        return db.prepare(sql).run(params);
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

export default db;
