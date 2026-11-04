/*
 * All the backend logic lives here as plain functions.
 * Each one receives a `query` function, so the same code runs against
 * the real database on Vercel and an in-memory one in the tests.
 */
import crypto from 'node:crypto'

export type Query = (text: string, params?: unknown[]) => Promise<{ rows: any[] }>
export type Result = { status: number; body: unknown }

export const STATUSES = ['new', 'contacted', 'won', 'lost'] as const
const RATE_LIMIT = 5 // enquiries allowed from one address...
const RATE_WINDOW_MINUTES = 10 // ...within this many minutes

export async function ensureSchema(query: Query) {
  await query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      budget TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT NOT NULL DEFAULT '',
      ip_hash TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'form',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)
  // One row per message sent to the site assistant. Used for limits and for the admin page.
  await query(`
    CREATE TABLE IF NOT EXISTS chats (
      id SERIAL PRIMARY KEY,
      ip_hash TEXT NOT NULL DEFAULT '',
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      answered BOOLEAN NOT NULL DEFAULT true,
      sources TEXT NOT NULL DEFAULT '',
      lead_id INTEGER,
      tokens INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`)
  // Databases created before the assistant existed need the extra column.
  await query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'form'`).catch(() => {})
}

const clean = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max)

/** Checks an enquiry. Never trust the browser's own validation. */
export function validateLead(body: any) {
  const lead = {
    name: clean(body?.name, 120),
    email: clean(body?.email, 200),
    company: clean(body?.company, 160),
    budget: clean(body?.budget, 80),
    message: clean(body?.message, 4000),
  }
  const errors: Record<string, string> = {}
  if (lead.name.length < 2) errors.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.email = 'Enter an email address like you@company.com.'
  if (lead.message.length < 10) errors.message = 'Tell us a little about the project, in a sentence or two.'
  return { lead, errors, ok: Object.keys(errors).length === 0 }
}

/** The visitor's network address is stored only as a one-way hash, used to block spam. */
export const hashIp = (ip: string, secret: string) => crypto.createHmac('sha256', secret).update(ip).digest('hex').slice(0, 32)

export async function createLead(query: Query, body: any, ip: string, secret: string, now = new Date(), source: 'form' | 'assistant' = 'form'): Promise<Result> {
  // Honeypot: real visitors never see or fill the "website" field, bots do.
  if (clean(body?.website, 200)) return { status: 201, body: { ok: true } }

  const { lead, errors, ok } = validateLead(body)
  if (!ok) return { status: 400, body: { errors } }

  const ipHash = hashIp(ip, secret)
  const since = new Date(now.getTime() - RATE_WINDOW_MINUTES * 60_000)
  const recent = await query('SELECT COUNT(*)::int AS count FROM leads WHERE ip_hash = $1 AND created_at > $2', [ipHash, since])
  if (recent.rows[0].count >= RATE_LIMIT) {
    return { status: 429, body: { error: 'Too many messages from this connection. Try again in a few minutes.' } }
  }

  const saved = await query(
    'INSERT INTO leads (name, email, company, budget, message, ip_hash, created_at, source) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    [lead.name, lead.email, lead.company, lead.budget, lead.message, ipHash, now, source],
  )
  return { status: 201, body: { ok: true, id: saved.rows[0].id } }
}

export async function listLeads(query: Query): Promise<Result> {
  const found = await query(
    'SELECT id, name, email, company, budget, message, status, notes, source, created_at FROM leads ORDER BY created_at DESC, id DESC LIMIT 500',
  )
  return { status: 200, body: { leads: found.rows } }
}

export async function updateLead(query: Query, body: any): Promise<Result> {
  const id = Number(body?.id)
  if (!Number.isInteger(id) || id < 1) return { status: 400, body: { error: 'Missing enquiry id.' } }
  const status = body?.status === undefined ? null : String(body.status)
  const notes = body?.notes === undefined ? null : clean(body.notes, 4000)
  if (status !== null && !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { status: 400, body: { error: 'Unknown status.' } }
  }
  const updated = await query(
    'UPDATE leads SET status = COALESCE($2, status), notes = COALESCE($3, notes) WHERE id = $1 RETURNING id, status, notes',
    [id, status, notes],
  )
  if (!updated.rows.length) return { status: 404, body: { error: 'Enquiry not found.' } }
  return { status: 200, body: { lead: updated.rows[0] } }
}

/* ---------- Admin sign-in ---------- */

const sign = (value: string, secret: string) => crypto.createHmac('sha256', secret).update(value).digest('base64url')
const safeEqual = (a: string, b: string) => {
  const x = crypto.createHash('sha256').update(a).digest()
  const y = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(x, y)
}

export const checkPassword = (given: unknown, expected: string) => expected.length > 0 && safeEqual(String(given ?? ''), expected)

/** A session is just an expiry time plus a signature only the server can produce. */
export function makeSession(secret: string, now = new Date(), hours = 12) {
  const expires = String(now.getTime() + hours * 3_600_000)
  return `${expires}.${sign(expires, secret)}`
}

export function verifySession(token: string | undefined, secret: string, now = new Date()) {
  if (!token || !secret) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature) return false
  if (!safeEqual(signature, sign(expires, secret))) return false
  return Number(expires) > now.getTime()
}
