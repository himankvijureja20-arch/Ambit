import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ambit',
});

export const db = {
  async connect() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      console.log('Database connected:', result.rows[0]);
    } finally {
      client.release();
    }
  },

  async query(text: string, params?: any[]) {
    return pool.query(text, params);
  },

  async getClient() {
    return pool.connect();
  },

  async close() {
    await pool.end();
  },
};
