import { runChat } from './_chat.js'
import { getComplete } from './_ai.js'
import { getQuery, secret } from './_db.js'
import { safely } from './_http.js'

/** POST /api/chat: one message to the site assistant. */
export default safely(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' })
  const complete = getComplete()
  if (!complete) return res.status(503).json({ error: 'The assistant is not switched on yet. The contact page reaches the team.' })
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  try {
    const result = await runChat({ query: await getQuery(), complete, secret: secret() }, { message: req.body?.message, history: req.body?.history, ip })
    res.status(result.status).json(result.body)
  } catch (error) {
    console.error(error)
    res.status(502).json({ error: 'The assistant could not answer just now. Try again, or use the contact page.' })
  }
})
