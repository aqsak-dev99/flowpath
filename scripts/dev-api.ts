/*
 * Local stand-in for Vercel's functions. Run `npm run dev:api` in one terminal and
 * `npm run dev` in another. Enquiries are kept in memory and vanish when this stops.
 * Local admin password: admin12345
 * The assistant uses an offline stand-in unless you start this with LLM_API_KEY=your-key.
 */
import http from 'node:http'
import contact from '../api/contact.ts'
import login from '../api/admin/login.ts'
import logout from '../api/admin/logout.ts'
import leads from '../api/admin/leads.ts'
import chats from '../api/admin/chats.ts'
import chat from '../api/chat.ts'

const routes: Record<string, (req: any, res: any) => unknown> = {
  '/api/contact': contact,
  '/api/admin/login': login,
  '/api/admin/logout': logout,
  '/api/admin/leads': leads,
  '/api/admin/chats': chats,
  '/api/chat': chat,
}

http
  .createServer(async (req, res) => {
    const handler = routes[(req.url || '').split('?')[0]]
    const reply = res as any
    reply.status = (code: number) => ((res.statusCode = code), reply)
    reply.json = (data: unknown) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    }
    if (!handler) return reply.status(404).json({ error: 'Not found' })
    let raw = ''
    for await (const chunk of req) raw += chunk
    try {
      ;(req as any).body = raw ? JSON.parse(raw) : {}
    } catch {
      return reply.status(400).json({ error: 'Send JSON.' })
    }
    await handler(req, reply)
  })
  .listen(3001, () => console.log('API ready on http://localhost:3001 (local admin password: admin12345)'))
