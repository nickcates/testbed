import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_PATH || join(__dirname, 'balloon_crm.db');
const db = new Database(dbPath);

console.log('Running database migrations...');
console.log('Database path:', dbPath);

// Read and execute schema
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

try {
    db.exec(schema);
    console.log('✅ Database schema created successfully!');

    // Show table info
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
    console.log('\nCreated tables:');
    tables.forEach(table => {
        console.log(`  - ${table.name}`);
    });
} catch (error) {
    console.error('❌ Error creating database schema:', error.message);
    process.exit(1);
} finally {
    db.close();
}
