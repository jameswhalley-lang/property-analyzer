import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

export { getDb };
export type Database = ReturnType<typeof getDb>;
