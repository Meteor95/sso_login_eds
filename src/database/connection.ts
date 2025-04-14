import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index';
const pool = new Pool({
  connectionString: process.env.MAIN_DATABASE_URL
});
export const db = drizzle(pool, { schema });