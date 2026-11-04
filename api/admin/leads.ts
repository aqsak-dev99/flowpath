import { listLeads, updateLead } from '../_lib.js'
import { getQuery } from '../_db.js'
import { requireAdmin, safely } from '../_http.js'

/** GET /api/admin/leads lists enquiries. PATCH changes one enquiry's status or notes. Both need a session. */
export default safely(async (req, res) => {
  if (!requireAdmin(req, res)) return
  const query = await getQuery()
  const result =
    req.method === 'GET' ? await listLeads(query)
    : req.method === 'PATCH' ? await updateLead(query, req.body)
    : { status: 405, body: { error: 'Use GET or PATCH.' } }
  res.status(result.status).json(result.body)
})
