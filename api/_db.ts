import pg from 'pg'
import { ensureSchema, type Query } from './_lib.js'

let pool: pg.Pool | undefined
let ready: Promise<void> | undefined

/** One shared connection pool, and the table is created the first time it is needed. */
export async function getQuery(): Promise<Query> {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
  if (!pool) {
    if (process.env.DATABASE_URL === 'memory') {
      // Local development only: a throwaway in-memory database, so no setup is needed.
      const name = 'pg-' + 'mem'
      const { newDb } = await import(name)
      const { Pool } = newDb().adapters.createPg()
      pool = new Pool()
    } else {
      pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 3 })
    }
  }
  const query: Query = (text, params) => pool!.query(text, params as any[])
  ready ??= ensureSchema(query)
  await ready
  return query
}

export const secret = () => {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 16) throw new Error('SESSION_SECRET is not set (use at least 16 characters)')
  return value
}
