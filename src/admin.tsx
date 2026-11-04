import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { PageHeader, Section, card, glassBtn, pad, usePageTitle, whiteBtn } from './ui'

type Lead = {
  id: number
  name: string
  email: string
  company: string
  budget: string
  message: string
  status: string
  notes: string
  source: string
  created_at: string
}

type Chat = { id: number; question: string; answer: string; answered: boolean; sources: string; lead_id: number | null; created_at: string }
type ChatStats = { total: number; today: number; answered: number; leads: number; tokens: number }

const STATUSES = ['new', 'contacted', 'won', 'lost']
const label = (status: string) => status[0].toUpperCase() + status.slice(1)
const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/** /admin: sign in with the admin password, then read and manage enquiries. */
export function AdminPage() {
  usePageTitle('Admin')
  const [view, setView] = useState<'loading' | 'signin' | 'ready' | 'error'>('loading')
  const [leads, setLeads] = useState<Lead[]>([])
  const [filter, setFilter] = useState('all')
  const [problem, setProblem] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState<number | null>(null)
  const [tab, setTab] = useState<'enquiries' | 'assistant'>('enquiries')
  const [chats, setChats] = useState<Chat[]>([])
  const [stats, setStats] = useState<ChatStats | null>(null)

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/leads')
      if (response.status === 401) return setView('signin')
      if (!response.ok) throw new Error()
      setLeads((await response.json()).leads)
      setView('ready')
      // Assistant activity is extra: if it fails, enquiries still show.
      fetch('/api/admin/chats')
        .then((reply) => (reply.ok ? reply.json() : null))
        .then((data) => {
          if (data) {
            setChats(data.chats)
            setStats(data.stats)
          }
        })
        .catch(() => {})
    } catch {
      setView('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setProblem('')
    const password = new FormData(event.currentTarget).get('password')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (response.ok) await load()
      else setProblem(response.status === 401 ? 'That password is not right.' : 'Sign-in is not working at the moment. Try again shortly.')
    } catch {
      setProblem('Could not reach the server. Check your connection and try again.')
    }
    setBusy(false)
  }

  const signOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setLeads([])
    setView('signin')
  }

  const update = async (id: number, patch: Partial<Pick<Lead, 'status' | 'notes'>>) => {
    const before = leads
    setLeads((list) => list.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)))
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      })
      if (response.status === 401) return setView('signin')
      if (!response.ok) throw new Error()
      setSaved(id)
      setTimeout(() => setSaved((current) => (current === id ? null : current)), 1800)
    } catch {
      setLeads(before)
      setProblem('That change was not saved. Try again.')
    }
  }

  if (view === 'loading') {
    return <PageHeader lead="Enquiries." lede="Loading your enquiries." />
  }

  if (view === 'error') {
    return (
      <PageHeader lead="Enquiries." lede="The enquiries could not be loaded. The server or database may not be set up yet.">
        <button type="button" className={`${glassBtn} mt-8 mb-24`} onClick={load}>
          Try again
        </button>
      </PageHeader>
    )
  }

  if (view === 'signin') {
    return (
      <>
        <PageHeader lead="Admin." rest="Sign in to see enquiries." />
        <Section className="!pt-0">
          <form onSubmit={signIn} className={`${card} p-6 md:p-9 max-w-md`}>
            <label className="block text-sm font-medium mb-2" htmlFor="a-password">
              Admin password
            </label>
            <input id="a-password" name="password" type="password" className="field" autoComplete="current-password" required />
            <p role="alert" className="mt-2 text-sm text-[#ffc9c0] min-h-[1.25rem]">
              {problem}
            </p>
            <button type="submit" disabled={busy} className={`${whiteBtn} mt-3 disabled:opacity-70`}>
              {busy ? 'Signing in' : 'Sign in'}
            </button>
          </form>
        </Section>
      </>
    )
  }

  const shown = filter === 'all' ? leads : leads.filter((lead) => lead.status === filter)
  const count = (status: string) => leads.filter((lead) => lead.status === status).length

  return (
    <>
      <header className={`${pad} pt-32 md:pt-36 pb-8`}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <h1 className="text-3xl md:text-5xl leading-[1.05] tracking-[-0.02em]">
              {tab === 'enquiries' ? 'Enquiries' : 'Assistant'}{' '}
              <span className="text-white/50">{tab === 'enquiries' ? `${leads.length} in total` : `${stats?.total ?? 0} messages`}</span>
            </h1>
            <button type="button" onClick={signOut} className="text-sm underline underline-offset-4 text-white/80 hover:text-white pb-1">
              Sign out
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div role="tablist" aria-label="Admin sections" className="inline-flex rounded-full bg-white/[0.06] p-1">
              {(['enquiries', 'assistant'] as const).map((name) => (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={tab === name}
                  onClick={() => setTab(name)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${tab === name ? 'bg-white text-[#17110E]' : 'text-white/75 hover:text-white'}`}
                >
                  {label(name)}
                </button>
              ))}
            </div>
            {tab === 'enquiries' && (
              <div role="radiogroup" aria-label="Show" className="flex flex-wrap gap-2">
                {['all', ...STATUSES].map((status) => (
                  <button
                    key={status}
                    type="button"
                    role="radio"
                    aria-checked={filter === status}
                    onClick={() => setFilter(status)}
                    className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                      filter === status ? 'bg-white text-[#17110E] border-white' : 'border-white/25 text-white/80 hover:border-white/60'
                    }`}
                  >
                    {label(status)} {status === 'all' ? leads.length : count(status)}
                  </button>
                ))}
              </div>
            )}
          </div>
          {problem && (
            <p role="alert" className="mt-4 text-sm text-[#ffc9c0]">
              {problem}
            </p>
          )}
        </div>
      </header>

      {tab === 'assistant' && (
        <Section className="!pt-2 !pb-16">
          {!stats ? (
            <p className="text-white/70">Assistant activity could not be loaded.</p>
          ) : (
            <>
              <dl className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {[
                  ['Messages today', stats.today],
                  ['Messages in total', stats.total],
                  ['Answered from the site', stats.total ? `${Math.round((stats.answered / stats.total) * 100)}%` : '0%'],
                  ['Enquiries it created', stats.leads],
                ].map(([term, value]) => (
                  <div key={term} className={`${card} !rounded-2xl p-5 flex flex-col-reverse`}>
                    <dd className="mt-2 text-3xl md:text-4xl tracking-[-0.02em]">{value}</dd>
                    <dt className="text-sm text-white/65">{term}</dt>
                  </div>
                ))}
              </dl>
              {chats.length === 0 ? (
                <p className="text-white/70">No one has used the assistant yet.</p>
              ) : (
                <ul className="grid gap-3">
                  {chats.map((chat) => (
                    <li key={chat.id} className={`${card} p-5 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr_auto] gap-4`}>
                      <p className="font-medium break-words">{chat.question}</p>
                      <p className="text-white/75 text-[15px] leading-relaxed break-words">{chat.answer}</p>
                      <div className="text-sm text-white/60 lg:text-right">
                        <p>{when(chat.created_at)}</p>
                        <p className="mt-1">{chat.lead_id ? 'Created an enquiry' : chat.answered ? 'Answered' : 'Declined'}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </Section>
      )}

      <Section className={`!pt-2 !pb-16 ${tab === 'enquiries' ? '' : 'hidden'}`}>
        {shown.length === 0 ? (
          <p className="text-white/70">
            {leads.length === 0 ? 'No enquiries yet. They appear here as soon as someone sends the contact form.' : `No enquiries marked ${filter}.`}
          </p>
        ) : (
          <ul className="grid gap-4">
            {shown.map((lead) => (
              <li key={lead.id} className={`${card} p-5 md:p-7 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-6`}>
                <div>
                  <p className="text-xl">{lead.name}</p>
                  {lead.source === 'assistant' && (
                    <span className="mt-1 inline-block rounded-full border border-white/30 px-2.5 py-0.5 text-xs font-medium">From the assistant</span>
                  )}
                  <a href={`mailto:${lead.email}`} className="block mt-1 text-[15px] text-white/80 hover:underline break-words">
                    {lead.email}
                  </a>
                  {lead.company && <p className="mt-1 text-[15px] text-white/60">{lead.company}</p>}
                  <p className="mt-3 text-sm text-white/60">{lead.budget}</p>
                  <p className="mt-1 text-sm text-white/60">{when(lead.created_at)}</p>
                </div>
                <p className="text-white/85 leading-relaxed whitespace-pre-wrap break-words">{lead.message}</p>
                <div className="grid gap-3 content-start">
                  <label className="block text-sm font-medium" htmlFor={`status-${lead.id}`}>
                    Status
                  </label>
                  <select id={`status-${lead.id}`} className="field" value={lead.status} onChange={(event) => update(lead.id, { status: event.target.value })}>
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {label(status)}
                      </option>
                    ))}
                  </select>
                  <label className="block text-sm font-medium" htmlFor={`notes-${lead.id}`}>
                    Notes
                  </label>
                  <textarea
                    id={`notes-${lead.id}`}
                    className="field resize-y"
                    rows={3}
                    defaultValue={lead.notes}
                    placeholder="Saved when you click away"
                    onBlur={(event) => event.target.value !== lead.notes && update(lead.id, { notes: event.target.value })}
                  />
                  <p className="text-sm text-white/70 min-h-[1.25rem]" role="status">
                    {saved === lead.id ? 'Saved' : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}