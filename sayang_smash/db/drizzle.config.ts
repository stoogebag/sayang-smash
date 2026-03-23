import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { entries, exercises } from './schema'

export const pool = new Pool({
  connectionString: process.env.SAYANG_SMASH_SUPABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export const db = drizzle(pool)
