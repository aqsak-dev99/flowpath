import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifySession } from './_lib.js'
import { secret } from './_db.js'

export const COOKIE = 'flowpath_admin'

export function readCookie(req: VercelRequest, name: string) {
  const header = req.headers.cookie || ''
  const found = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(name + '='))
  return found ? decodeURIComponent(found.slice(name.length + 1)) : undefined
}

export const sessionCookie = (value: string, maxAgeSeconds: number) =>
  `${COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}${process.env.VERCEL ? '; Secure' : ''}`

/** Sends 401 and returns false unless the request carries a valid admin session. */
export function requireAdmin(req: VercelRequest, res: VercelResponse) {
  if (verifySession(readCookie(req, COOKIE), secret())) return true
  res.status(401).json({ error: 'Sign in first.' })
  return false
}

/** Wraps a handler so an unexpected error becomes a clean 500 instead of a crash. */
export const safely = (handler: (req: VercelRequest, res: VercelResponse) => Promise<unknown>) =>
  async (req: VercelRequest, res: VercelResponse) => {
    try {
      await handler(req, res)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Something went wrong on our side.' })
    }
  }
