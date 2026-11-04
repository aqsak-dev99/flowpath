/*
 * Runs every test question through the full assistant and scores it.
 *   With a real model:   LLM_API_KEY=your-key npm run eval
 *   Without one:         npm run eval   (uses the offline stand-in, which only tests the plumbing)
 * It uses an in-memory database, so nothing real is touched.
 */
import { newDb } from 'pg-mem'
import { ensureSchema, listLeads, type Query } from '../api/_lib.ts'
import { LIMITS, runChat } from '../api/_chat.ts'
import { DEFAULT_MODEL, offlineComplete, realComplete, type Complete, type Completion } from '../api/_ai.ts'
import { CASES } from './cases.ts'

const real = !!process.env.LLM_API_KEY && process.env.LLM_API_KEY !== 'offline'
const PAUSE_MS = Number(process.env.EVAL_PAUSE_MS || 7000) // gap between questions, to stay under free-tier limits
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Remembers exactly what the model said, and waits and retries when the provider says "too many requests".
let last: Completion | undefined
const complete: Complete = async (messages, tools) => {
  for (let attempt = 0; ; attempt++) {
    try {
      last = await (real ? realComplete : offlineComplete)(messages, tools)
      return last
    } catch (error) {
      const text = (error as Error).message
      if (!text.includes('429') || attempt >= 5) throw error
      const hinted = Number(text.match(/try again in ([\d.]+)s/i)?.[1])
      const wait = Math.ceil((hinted || 20) + 2)
      process.stdout.write(`      (rate limited, waiting ${wait}s)\n`)
      await sleep(wait * 1000)
    }
  }
}

const { Pool } = newDb().adapters.createPg()
const pool = new Pool()
const query: Query = (text, params) => pool.query(text, params)
await ensureSchema(query)
LIMITS.perVisitor = 10_000
LIMITS.perDay = 10_000

const leadCount = async () => ((await listLeads(query)).body as any).leads.length
const totals: Record<string, [number, number]> = {}
const failures: string[] = []

console.log(`Model: ${real ? process.env.LLM_MODEL || DEFAULT_MODEL : 'offline stand-in (not a real model)'}`)
if (real) console.log(`About ${Math.ceil((CASES.length * (PAUSE_MS + 3000)) / 60000)} minutes, with a ${PAUSE_MS / 1000}s pause between questions.\n`)

for (const [i, item] of CASES.entries()) {
  const before = await leadCount()
  let pass = false
  let detail = ''
  last = undefined
  try {
    const result = await runChat({ query, complete, secret: 'eval-secret-0123456789' }, { message: item.q, history: [], ip: `10.0.0.${i}` })
    const body = result.body as any
    const created = (await leadCount()) > before
    const urls: string[] = (body.sources || []).map((source: any) => source.url)
    if (item.expect === 'answer') {
      pass = body.answered === true && urls.some((url) => item.urls!.includes(url)) && !created
      detail = `answered=${body.answered} cited=${urls.join(',') || 'nothing'} wanted=${item.urls!.join(' or ')}`
    } else if (item.expect === 'refuse') {
      pass = body.answered === false && !created
      detail = `answered=${body.answered} enquiry=${created}`
    } else if (item.expect === 'lead') {
      pass = created
      detail = `enquiry=${created}`
    } else {
      pass = !created
      detail = `enquiry=${created}`
    }
    if (!pass) {
      // Show exactly what the model wrote, so the cause is visible.
      const said = last as Completion | undefined
      const raw = said?.toolCall ? `TOOL ${said.toolCall.name} ${JSON.stringify(said.toolCall.args)}` : (said?.text ?? '')
      detail += `\n      model wrote: ${JSON.stringify(raw)}`
    }
  } catch (error) {
    detail = `error: ${(error as Error).message.slice(0, 200)}`
  }
  totals[item.expect] ??= [0, 0]
  totals[item.expect][1]++
  if (pass) totals[item.expect][0]++
  else failures.push(`${item.q}\n      ${detail}`)
  console.log(`${pass ? 'ok  ' : 'FAIL'}  [${item.expect}] ${item.q}`)
  if (real && i < CASES.length - 1) await sleep(PAUSE_MS)
}

const used = await query('SELECT COALESCE(SUM(tokens), 0)::int AS total FROM chats')
const label: Record<string, string> = {
  answer: 'Answered and cited the right page',
  refuse: 'Declined what it should decline',
  lead: 'Created an enquiry when given details',
  ask: 'Held back when details were missing',
}
console.log('\nResults')
let passedAll = 0
for (const [kind, [ok, of]] of Object.entries(totals)) {
  passedAll += ok
  console.log(`  ${label[kind].padEnd(40)} ${ok} of ${of}`)
}
console.log(`  ${'Overall'.padEnd(40)} ${passedAll} of ${CASES.length}`)
if (real) console.log(`  ${'Tokens used'.padEnd(40)} ${used.rows[0].total}`)
if (failures.length) console.log('\nFailed\n' + failures.map((line) => '  - ' + line).join('\n'))
if (!real) console.log('\nThis run used the offline stand-in. Set LLM_API_KEY to measure a real model.')