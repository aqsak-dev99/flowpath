import { safely, sessionCookie } from '../_http.js'

/** POST /api/admin/logout: ends the session. */
export default safely(async (_req, res) => {
  res.setHeader('Set-Cookie', sessionCookie('', 0))
  res.status(200).json({ ok: true })
})
