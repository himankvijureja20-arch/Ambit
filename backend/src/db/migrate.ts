import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './client.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function migrate() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const appliedResult = await db.query('SELECT name FROM schema_migrations');
    const applied = new Set(appliedResult.rows.map((r: { name: string }) => r.name));

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`Skipping already-applied migration: ${file}`);
        continue;
      }

      console.log(`Applying migration: ${file}`);
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
      await db.query(sql);
      await db.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
    }

    console.log('Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
