/*
 * The assistant's knowledge: the site's own content, cut into small passages,
 * and a keyword search (BM25) that finds the passages closest to a question.
 * With about twenty short passages a keyword search is accurate, free and instant,
 * so no embedding model or vector database is needed.
 */
import { CASES, FACTS, FAQS, ROLES, SERVICES, SITE, STEPS, VALUES } from '../src/data.js'

export type Passage = { id: string; title: string; label: string; url: string; text: string }

export const PASSAGES: Passage[] = [
  ...SERVICES.map((service) => ({
    id: `service-${service.id}`,
    title: `Service: ${service.name}`,
    label: service.name,
    url: `/services#${service.id}`,
    text: `${service.long} What you get each month: ${service.monthly.join('; ')}. Includes: ${service.items.join(', ')}.`,
  })),
  {
    id: 'services-overview',
    title: 'Services we offer',
    label: 'Our services',
    url: '/services',
    text: `flowpath offers three services: ${SERVICES.map((service) => service.name).join(', ')}. Clients can take one or all three, with one team, one plan and one report.`,
  },
  ...CASES.map((item) => ({
    id: `case-${item.slug}`,
    title: `Case study: ${item.client} (${item.sector})`,
    label: `${item.client} case study`,
    url: `/work/${item.slug}`,
    text: `${item.did}. Result: ${item.result}. The brief: ${item.brief} What we did: ${item.approach.join(' ')} Numbers: ${item.metrics
      .map((metric) => `${metric.to}${metric.suffix} ${metric.label}`)
      .join('; ')}. Length: ${item.duration}. Services used: ${item.services.join(', ')}.`,
  })),
  ...FAQS.map(([question, answer], i) => ({ id: `faq-${i}`, title: `Question: ${question}`, label: question, url: '/services#questions', text: answer })),
  {
    id: 'process',
    title: 'How we work: our process in four steps',
    label: 'How we work',
    url: '/about#process',
    text: STEPS.map(([name, body], i) => `Step ${i + 1}, ${name}: ${body}`).join(' '),
  },
  {
    id: 'about',
    title: 'About flowpath: who we are, where we are based, the team',
    label: 'About flowpath',
    url: '/about',
    text: `flowpath is a digital marketing studio started in 2019. ${FACTS.map(([term, detail]) => `${term}: ${detail}`).join('. ')}. ${VALUES.map(
      ([name, body]) => `${name}: ${body}`,
    ).join(' ')}`,
  },
  {
    id: 'roles',
    title: 'Open roles: jobs and careers at flowpath',
    label: 'Open roles',
    url: '/about#roles',
    text: `We are hiring for: ${ROLES.map(([title, where, body]) => `${title} (${where}): ${body}`).join(' ')} Apply by email to ${SITE.email}.`,
  },
  {
    id: 'contact',
    title: 'Contact flowpath: email, WhatsApp, phone, address, hours',
    label: 'Contact details',
    url: '/contact',
    text: `Email ${SITE.email}. WhatsApp or call ${SITE.phone}. The studio is at ${SITE.address}. Open Monday to Friday, 10 am to 6 pm. We reply to every message within one working day. You can also send the contact form.`,
  },
]

/* ---------- Turning text into comparable words ---------- */

const STOP = new Set(
  'a an and are as at be but by can could do does for from get had has have how i if in is it its me my of on or our so than that the their them then there these they this to us was we what when where which who will with would you your any some about am been did not tell more please know want need like give show explain detail thing also just really'.split(' '),
)

// Words a visitor might use, mapped to the words the site uses.
const SYNONYMS: Record<string, string[]> = {
  price: ['cost', 'fee', 'spend'], pricing: ['cost', 'fee', 'spend'], charge: ['cost', 'fee'], expensive: ['cost', 'fee'], rate: ['cost', 'fee'],
  ad: ['advertising', 'campaign'], ads: ['advertising', 'campaign'], advert: ['advertising'], facebook: ['meta'], insta: ['instagram', 'social'], instagram: ['social'], tiktok: ['social'],
  google: ['search'], rank: ['ranking', 'seo', 'search'], seo: ['search', 'ranking'],
  restaurant: ['food'], cafe: ['restaurant'], property: ['housing'], estate: ['housing'], fashion: ['clothing'], clothes: ['clothing'], beauty: ['skincare'],
  job: ['role', 'hiring'], career: ['role', 'hiring'], vacancy: ['role', 'hiring'], hire: ['hiring', 'role'],
  location: ['based', 'address', 'studio'], office: ['studio', 'address'], phone: ['call', 'whatsapp'], reach: ['contact', 'email'],
  process: ['step', 'work'], approach: ['step', 'process'], staff: ['team'], people: ['team'], employee: ['team'],
  long: ['soon', 'month', 'week'], fast: ['soon'], quickly: ['soon'], contract: ['minimum'], commitment: ['minimum', 'contract'],
  startup: ['small', 'business'], sme: ['small', 'business'],
}

function stem(word: string) {
  if (word.length > 4 && word.endsWith('ies')) return word.slice(0, -3) + 'y'
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3)
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2)
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1)
  return word
}

export function tokenize(text: string, expand = false) {
  const words = text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((word) => word && !STOP.has(word))
  const out: string[] = []
  for (const word of words) {
    out.push(stem(word))
    if (expand) for (const extra of SYNONYMS[word] || SYNONYMS[stem(word)] || []) out.push(stem(extra))
  }
  return out
}

/* ---------- BM25 search ---------- */

const K1 = 1.4
const B = 0.6
const docs = PASSAGES.map((passage) => {
  const tokens = [...tokenize(passage.title), ...tokenize(passage.title), ...tokenize(passage.text)] // the title counts double
  const counts = new Map<string, number>()
  for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1)
  return { passage, counts, length: tokens.length }
})
const averageLength = docs.reduce((sum, doc) => sum + doc.length, 0) / docs.length
const documentFrequency = new Map<string, number>()
for (const doc of docs) for (const token of doc.counts.keys()) documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1)

/** Returns the passages most relevant to the question, best first. */
export function retrieve(question: string, limit = 4): (Passage & { score: number })[] {
  const terms = [...new Set(tokenize(question, true))]
  return docs
    .map((doc) => {
      let score = 0
      for (const term of terms) {
        const tf = doc.counts.get(term)
        if (!tf) continue
        const df = documentFrequency.get(term) || 0
        const idf = Math.log(1 + (docs.length - df + 0.5) / (df + 0.5))
        score += (idf * tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * doc.length) / averageLength))
      }
      return { ...doc.passage, score }
    })
    .filter((hit) => hit.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
