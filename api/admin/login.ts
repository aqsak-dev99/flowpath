import { checkPassword, makeSession } from '../_lib.js'
import { secret } from '../_db.js'
import { safely, sessionCookie } from '../_http.js'

/** POST /api/admin/login: checks the admin password and starts a 12-hour session. */
export default safely(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' })
  if (!checkPassword(req.body?.password, process.env.ADMIN_PASSWORD || '')) {
    return res.status(401).json({ error: 'That password is not right.' })
  }
  res.setHeader('Set-Cookie', sessionCookie(makeSession(secret()), 12 * 3600))
  res.status(200).json({ ok: true })
})
