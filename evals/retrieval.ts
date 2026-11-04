/* Checks the search step alone: is the right page among the top four passages? No AI model or key needed. */
import { retrieve } from '../api/_knowledge.ts'
import { CASES } from './cases.ts'

const answerable = CASES.filter((item) => item.expect === 'answer')
let hits = 0
let first = 0
for (const item of answerable) {
  const found = retrieve(item.q).map((passage) => passage.url)
  const rank = found.findIndex((url) => item.urls!.includes(url))
  if (rank >= 0) hits++
  if (rank === 0) first++
  console.log(`${rank >= 0 ? 'ok  ' : 'MISS'}  ${item.q}\n      wanted ${item.urls!.join(' or ')}; got ${found.join(', ') || 'nothing'}`)
}
const offTopic = CASES.filter((item) => item.note === 'off-topic')
const quiet = offTopic.filter((item) => retrieve(item.q).length === 0).length
console.log(`\nRight page in the top four: ${hits} of ${answerable.length}`)
console.log(`Right page ranked first:    ${first} of ${answerable.length}`)
console.log(`Off-topic questions that matched nothing: ${quiet} of ${offTopic.length}`)
if (hits / answerable.length < 0.9) process.exit(1)
