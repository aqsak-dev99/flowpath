import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { BUDGETS, SITE } from './data'

export const pad = 'px-5 sm:px-6 md:px-12 lg:px-16'
export const whiteBtn =
  'inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-white/90'
export const glassBtn =
  'inline-flex items-center justify-center px-6 py-3 liquid-glass rounded-full text-white text-sm font-semibold hover:bg-white/10'
export const card = 'rounded-3xl bg-white/[0.04] border border-white/10'

/** Golden Hour accent: used sparingly for labels, numbers and data lines. */
export const GOLD = '#F2B632'
export const eyebrowCls = 'text-xs font-semibold tracking-[0.14em] uppercase text-[#F2B632]'

/* ---------- hooks ---------- */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** True once the element has scrolled into view. */
export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

/** Sets the browser tab title for a page. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : `${SITE.name}, a digital marketing studio`
  }, [title])
}

/* ---------- small pieces ---------- */

export function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M11 4l8 10-8 10-8-10z" fill="white" fillOpacity="0.9" />
      <path d="M17 4l8 10-8 10-8-10z" fill="white" fillOpacity="0.5" />
    </svg>
  )
}

/** The background film, playing only while it is on screen. */
export function Film({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  return <video ref={ref} src={SITE.video} loop muted playsInline preload="metadata" aria-hidden="true" className={className} />
}

export function Section({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`${pad} py-20 md:py-28 scroll-mt-20 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

/** Two-tone heading, the same device as the hero headline. */
export function Heading({ lead, rest, lede, action, eyebrow }: { lead: string; rest?: string; lede?: string; action?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-12 md:mb-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className={`${eyebrowCls} mb-4`}>{eyebrow}</p>}
        <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.06] tracking-[-0.025em] max-w-[22ch]">
          {lead} {rest && <span className="text-[#b9afa6]">{rest}</span>}
        </h2>
      </div>
      {lede && <p className="text-[#b9afa6] text-base md:text-[17px] leading-relaxed max-w-[42ch]">{lede}</p>}
      {action}
    </div>
  )
}

/** The title block at the top of every inner page. */
export function PageHeader({ lead, rest, lede, children }: { lead: string; rest?: string; lede?: string; children?: ReactNode }) {
  return (
    <header className={`${pad} pt-36 md:pt-44 pb-12 md:pb-16`}>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] leading-[1.03] tracking-[-0.025em] max-w-[18ch]">
          {lead} {rest && <span className="text-[#b9afa6]">{rest}</span>}
        </h1>
        {lede && <p className="mt-7 text-white/75 text-base md:text-lg leading-relaxed max-w-[52ch]">{lede}</p>}
        {children}
      </div>
    </header>
  )
}

/** A number that counts up the first time it is seen. */
export function Count({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.6)
  const [value, setValue] = useState(prefersReducedMotion() ? to : 0)
  useEffect(() => {
    if (!seen || prefersReducedMotion()) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1600)
      setValue(to * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref}>{value.toFixed(decimals)}</span>
}

export function Metrics({ items }: { items: { to: number; decimals: number; suffix: string; label: string }[] }) {
  return (
    <dl className="grid gap-8">
      {items.map((metric) => (
        <div key={metric.label} className="border-t border-white/20 pt-5">
          <dd className="text-6xl md:text-7xl tracking-[-0.03em] leading-none">
            <Count to={metric.to} decimals={metric.decimals} />
            <span className="text-[#F2B632]">{metric.suffix}</span>
          </dd>
          <dt className="mt-3 text-base text-white/70">{metric.label}</dt>
        </div>
      ))}
    </dl>
  )
}

/* ---------- Chart that draws itself when seen ---------- */

export function LineChart({ title, unit, labels, values }: { title: string; unit: string; labels: string[]; values: number[] }) {
  const [ref, seen] = useInView<HTMLElement>(0.35)
  const gradient = useId()
  const box = { w: 800, h: 360, left: 24, right: 24, top: 40, bottom: 50 }
  const max = Math.max(...values) * 1.08 || 1
  const points = values.map((value, i) => ({
    x: box.left + (i * (box.w - box.left - box.right)) / (values.length - 1),
    y: box.top + (1 - value / max) * (box.h - box.top - box.bottom),
    value,
  }))
  const line = points
    .map((p, i) => {
      if (i === 0) return `M${p.x} ${p.y}`
      const prev = points[i - 1]
      const mid = (prev.x + p.x) / 2
      return `C${mid} ${prev.y} ${mid} ${p.y} ${p.x} ${p.y}`
    })
    .join(' ')
  const area = `${line} L${points[points.length - 1].x} ${box.h - box.bottom} L${points[0].x} ${box.h - box.bottom} Z`
  const anchor = (i: number) => (i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle')
  const summary = `${title} in ${unit}: ${labels.map((label, i) => `${label} ${values[i]}`).join(', ')}`

  return (
    <figure ref={ref} className={`${card} p-5 md:p-8`}>
      <figcaption className="flex items-baseline justify-between gap-4 mb-2">
        <span className="text-base font-medium">{title}</span>
        <span className="text-sm text-white/60">{unit}</span>
      </figcaption>
      <svg viewBox={`0 0 ${box.w} ${box.h}`} className="block w-full h-auto" role="img" aria-label={summary}>
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={GOLD} stopOpacity="0.3" />
            <stop offset="1" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => {
          const y = box.top + (i * (box.h - box.top - box.bottom)) / 3
          return <line key={i} x1={box.left} x2={box.w - box.right} y1={y} y2={y} stroke="white" strokeOpacity="0.1" />
        })}
        <path d={area} fill={`url(#${gradient})`} style={{ opacity: seen ? 1 : 0, transition: 'opacity 0.8s 1.2s' }} />
        <path
          d={line}
          pathLength={1}
          fill="none"
          stroke={GOLD}
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{ strokeDasharray: 1, strokeDashoffset: seen ? 0 : 1, transition: 'stroke-dashoffset 1.8s ease-out' }}
        />
        {points.map((p, i) => (
          <g key={labels[i]}>
            <g style={{ opacity: seen ? 1 : 0, transition: `opacity 0.3s ${0.3 + i * 0.28}s` }}>
              <circle cx={p.x} cy={p.y} r="6" fill="#17110E" stroke="white" strokeWidth="3" />
              <text x={p.x} y={p.y - 16} textAnchor={anchor(i)} fill="white" fontSize="17" fontWeight="500">
                {p.value.toLocaleString('en')}
              </text>
            </g>
            <text x={p.x} y={box.h - 16} textAnchor={anchor(i)} fill="white" fillOpacity="0.6" fontSize="16">
              {labels[i]}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}

/* ---------- Abstract covers for case studies (no photos needed) ---------- */

const COVER_COLORS = [
  ['#E8A04C', '#D9644A'],
  ['#D9644A', '#7A2E2A'],
  ['#8FA98B', '#3F5B4A'],
  ['#D8C3A5', '#B07A4F'],
]

export function Cover({ index, className = '' }: { index: number; className?: string }) {
  const [a, b] = COVER_COLORS[index % COVER_COLORS.length]
  const id = useId()
  return (
    <div className={`overflow-hidden bg-[#221915] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="block w-full h-full">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="#221915" />
        {index % 4 === 0 &&
          [0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx="560" cy="250" r={60 + i * 62} fill="none" stroke={`url(#${id})`} strokeWidth={26 - i * 3} opacity={1 - i * 0.13} />
          ))}
        {index % 4 === 1 &&
          [0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={90 + i * 96} y={420 - (70 + i * 48)} width="60" height={70 + i * 48} rx="30" fill={`url(#${id})`} opacity={0.35 + i * 0.1} />
          ))}
        {index % 4 === 2 &&
          [0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M-20 ${120 + i * 70} C 180 ${40 + i * 70}, 320 ${220 + i * 70}, 520 ${130 + i * 70} S 760 ${60 + i * 70}, 840 ${150 + i * 70}`}
              fill="none"
              stroke={`url(#${id})`}
              strokeWidth={22 - i * 3}
              strokeLinecap="round"
              opacity={1 - i * 0.16}
            />
          ))}
        {index % 4 === 3 &&
          Array.from({ length: 40 }, (_, i) => {
            const col = i % 8
            const row = Math.floor(i / 8)
            return <circle key={i} cx={130 + col * 78} cy={95 + row * 78} r={10 + ((col + row) % 4) * 7} fill={`url(#${id})`} opacity={0.3 + ((col * 3 + row) % 5) * 0.16} />
          })}
      </svg>
    </div>
  )
}

/* ---------- Small live visuals for the services ---------- */

function BarsVisual() {
  const [ref, seen] = useInView<HTMLDivElement>()
  const bars = [28, 36, 33, 52, 61, 74, 96]
  return (
    <div ref={ref} className="h-40 flex items-end gap-2" aria-hidden="true">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-lg transition-all duration-700 ease-out ${i === bars.length - 1 ? 'bg-[#F2B632]' : 'bg-white'}`}
          style={{ height: seen ? `${height}%` : '4%', opacity: i === bars.length - 1 ? 1 : 0.2 + (i / bars.length) * 0.6, transitionDelay: `${i * 70}ms` }}
        />
      ))}
    </div>
  )
}

function LineVisual() {
  const [ref, seen] = useInView<SVGSVGElement>()
  return (
    <svg ref={ref} viewBox="0 0 300 160" className="block w-full h-40" aria-hidden="true">
      {[40, 80, 120].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="white" strokeOpacity="0.1" />
      ))}
      <path
        d="M4 30 C 60 34, 80 70, 120 78 S 190 118, 230 126 S 280 138, 296 140"
        pathLength={1}
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ strokeDasharray: 1, strokeDashoffset: seen ? 0 : 1, transition: 'stroke-dashoffset 1.6s ease-out' }}
      />
      <circle cx="296" cy="140" r="6" fill="white" style={{ opacity: seen ? 1 : 0, transition: 'opacity 0.3s 1.5s' }} />
    </svg>
  )
}

function RankVisual() {
  const [ref, seen] = useInView<HTMLDivElement>()
  const rows = ['Your brand', 'A competitor', 'Another competitor']
  return (
    <div ref={ref} className="h-40 flex flex-col justify-end gap-2" aria-hidden="true">
      <div className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm text-white/70">
        <Search className="w-4 h-4" />
        best skincare in lahore
      </div>
      {rows.map((row, i) => (
        <div
          key={row}
          className={`flex items-center justify-between rounded-xl px-4 py-2 text-sm transition-all duration-700 ${
            i === 0 ? 'bg-white text-[#17110E] font-semibold' : 'bg-white/[0.06] text-white/60'
          }`}
          style={{ transform: seen ? 'none' : `translateY(${i === 0 ? 84 : -42}px)`, transitionDelay: '200ms' }}
        >
          <span>{row}</span>
          <span>{i + 1}</span>
        </div>
      ))}
    </div>
  )
}

export function ServiceVisual({ kind, caption }: { kind: 'bars' | 'line' | 'rank'; caption: string }) {
  return (
    <div className="rounded-2xl bg-black/25 p-5">
      {kind === 'bars' ? <BarsVisual /> : kind === 'line' ? <LineVisual /> : <RankVisual />}
      <p className="mt-4 text-xs text-white/60">{caption}</p>
    </div>
  )
}

/* ---------- FAQ ---------- */

export function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState(0)
  const base = useId()
  return (
    <div className="border-b border-white/20">
      {items.map(([question, answer], i) => {
        const isOpen = open === i
        return (
          <div key={question} className="border-t border-white/20">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${base}-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left text-lg md:text-xl"
              >
                {question}
                <Plus className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${base}-${i}`} hidden={!isOpen}>
              <p className="pb-7 pr-10 text-white/70 leading-relaxed max-w-[60ch]">{answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Closing band over the film ---------- */

export function CtaBand() {
  return (
    <section className={`relative overflow-hidden ${pad} py-24 md:py-32 text-center`}>
      <Film className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_50%,rgba(15,11,9,0.88)_0%,rgba(15,11,9,0.5)_70%,rgba(15,11,9,0.25)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d0a08] to-transparent" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl">
        <h2 className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.025em]">
          Tell us what <span className="text-[#c9bfb5]">you're launching.</span>
        </h2>
        <p className="mt-6 mx-auto max-w-[44ch] text-white/85 leading-relaxed">
          We reply to every message within one working day, usually with a few questions and a time to talk.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/contact" className={whiteBtn}>
            Start a project
          </Link>
          <a href={SITE.whatsapp} target="_blank" rel="noopener" className={glassBtn}>
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------- Contact form ---------- */

/** The form posts to /api/contact, which saves the enquiry in the database (see api/contact.ts).
 *  It also hands a copy to AutoHub, flowpath's AI assistant (a separate app), which drafts and
 *  fact-checks a reply that visitors can watch arrive on AutoHub's public demo. */

/** Where AutoHub runs. Override with VITE_AUTOHUB_URL in Vercel's environment variables. */
export const AUTOHUB_URL = (import.meta.env.VITE_AUTOHUB_URL as string | undefined) || 'https://autohub-0igb.onrender.com'

/** Sample enquiries for people trying the demo, in AutoHub's four languages. */
const SAMPLES = [
  { name: 'Sana', company: 'Libas by Sana', budget: 1,
    message: "Hi! We sell clothes online and want Instagram and Meta ads to grow sales. We'd like to start next month. Can we get on a call?" },
  { name: 'Bilal', company: 'Lakeview Bakery', budget: 0,
    message: 'Salam, hamari bakery ke liye Instagram content aur ads chahiye. Budget lagbhag 1 lakh mahana hai. Kab start kar sakte hain?' },
  { name: 'Ayesha', company: 'Koel Beauty', budget: 2,
    message: 'السلام علیکم، ہمیں اپنے اسکن کیئر برانڈ کے لیے گوگل اشتہارات اور ایس ای او چاہیے۔ آپ کی فیس کیا ہے؟' },
  { name: 'Khalid', company: 'Oud House', budget: 2,
    message: 'مرحبا، نحن متجر عطور في لاهور ونرغب في إعلانات على إنستغرام. ما هي تكلفة خدماتكم؟' },
]

/** Send the enquiry on to AutoHub. Best effort: it must never slow down or break flowpath's own form. */
function sendToAutoHub(data: FormData) {
  const budget = String(data.get('budget') || '')
  const message = String(data.get('message') || '').trim()
  fetch(`${AUTOHUB_URL}/api/forms/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true, // still delivered if the visitor leaves the page
    body: JSON.stringify({
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      company: String(data.get('company') || '').trim() || undefined,
      message: budget ? `${message}\n\nMonthly budget: ${budget}` : message,
      website: String(data.get('website') || ''), // the honeypot, passed through so AutoHub ignores bots too
    }),
  }).catch(() => {
    /* AutoHub asleep or down: flowpath has already saved the enquiry, so nothing is lost */
  })
}

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const [failure, setFailure] = useState('')
  const [name, setName] = useState('')
  const sentRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  /** Fill the form with a sample enquiry and a fresh made-up address (example.com never reaches an inbox). */
  const fillSample = () => {
    const form = formRef.current
    if (!form) return
    const sample = SAMPLES[Math.floor(Math.random() * SAMPLES.length)]
    const id = Math.random().toString(36).slice(2, 8)
    const set = (field: string, value: string) => {
      const el = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
      if (el) el.value = value
    }
    set('name', `${sample.name} (sample)`)
    set('email', `sample-${id}@example.com`)
    set('company', sample.company)
    set('budget', BUDGETS[sample.budget])
    set('message', sample.message)
    setErrors({})
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const next: Record<string, string> = {}
    const who = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()
    if (who.length < 2) next.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter an email address like you@company.com.'
    if (message.length < 10) next.message = 'Tell us a little about the project, in a sentence or two.'
    setErrors(next)
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus()
      return
    }
    setName(who)
    setState('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      })
      const reply = await response.json().catch(() => ({}))
      if (response.status === 400 && reply.errors) {
        setErrors(reply.errors)
        setState('idle')
        return
      }
      if (!response.ok) {
        setFailure(response.status === 429 && reply.error ? reply.error : `The message didn't send. Try again, or email ${SITE.email}.`)
        setState('failed')
        return
      }
      sendToAutoHub(data)
      setState('sent')
      requestAnimationFrame(() => sentRef.current?.focus())
    } catch {
      setFailure(`The message didn't send. Check your connection and try again, or email ${SITE.email}.`)
      setState('failed')
    }
  }

  const label = 'block text-sm font-medium mb-2'
  const error = 'mt-1.5 text-sm text-[#ffc9c0] min-h-[1.25rem]'

  if (state === 'sent') {
    return (
      <div ref={sentRef} tabIndex={-1} className="py-10 outline-none">
        <h3 className="text-4xl tracking-[-0.02em]">Message sent</h3>
        <p className="mt-4 text-white/85 max-w-[36ch]">Thank you, {name}. We'll reply within one working day.</p>
        <a href={AUTOHUB_URL} target="_blank" rel="noreferrer" className={`${glassBtn} mt-7`}>
          Watch AutoHub answer it →
        </a>
        <p className="mt-3 text-sm text-white/60 max-w-[44ch]">
          Choose "Explore the demo", then open Conversations. AutoHub's free server may take up to a minute to wake up.
        </p>
        <button type="button" className="mt-7 block text-sm underline underline-offset-4" onClick={() => setState('idle')}>
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
      <div className="sm:col-span-2 mb-2 rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-sm text-white/80">
        <p>
          <b className="text-white">This is a demo.</b> Your message is also answered by AutoHub, flowpath's AI assistant,
          and shown on its public dashboard (email addresses are hidden). Don't include anything private.
        </p>
        <button type="button" onClick={fillSample} className="mt-3 underline underline-offset-4 text-white">
          Try a sample enquiry
        </button>
      </div>
      <div>
        <label className={label} htmlFor="c-name">Your name</label>
        <input id="c-name" name="name" className="field" autoComplete="name" aria-invalid={!!errors.name} />
        <p className={error}>{errors.name}</p>
      </div>
      <div>
        <label className={label} htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" className="field" autoComplete="email" placeholder="you@company.com" aria-invalid={!!errors.email} />
        <p className={error}>{errors.email}</p>
      </div>
      <div>
        <label className={label} htmlFor="c-company">Company (optional)</label>
        <input id="c-company" name="company" className="field" autoComplete="organization" />
        <p className={error} />
      </div>
      <div>
        <label className={label} htmlFor="c-budget">Monthly budget</label>
        <select id="c-budget" name="budget" className="field" defaultValue={BUDGETS[1]}>
          {BUDGETS.map((budget) => (
            <option key={budget}>{budget}</option>
          ))}
        </select>
        <p className={error} />
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="c-message">What are you working on?</label>
        <textarea id="c-message" name="message" rows={5} className="field resize-y" placeholder="A launch, a slow quarter, a new market" aria-invalid={!!errors.message} />
        <p className={error}>{errors.message}</p>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-website">Leave this empty</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === 'sending'} className={`${whiteBtn} w-full sm:w-auto disabled:opacity-70`}>
          {state === 'sending' ? 'Sending your message' : 'Send message'}
        </button>
        {state === 'failed' && (
          <p role="alert" className="text-sm text-[#ffc9c0]">
            {failure}
          </p>
        )}
      </div>
    </form>
  )
}