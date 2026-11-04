import { listChats } from '../_chat.js'
import { getQuery } from '../_db.js'
import { requireAdmin, safely } from '../_http.js'

/** GET /api/admin/chats: assistant activity and totals. Needs a session. */
export default safely(async (req, res) => {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' })
  const result = await listChats(await getQuery())
  res.status(result.status).json(result.body)
})
