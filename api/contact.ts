import { createLead } from './_lib.js'
import { getQuery, secret } from './_db.js'
import { safely } from './_http.js'

/** POST /api/contact: saves an enquiry from the contact form. */
export default safely(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' })
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  const result = await createLead(await getQuery(), req.body, ip, secret())
  res.status(result.status).json(result.body)
})
