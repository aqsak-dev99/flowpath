import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageCircle, Send, X } from 'lucide-react'

type Source = { title: string; url: string }
type Turn = { role: 'user' | 'assistant'; content: string; sources?: Source[]; failed?: boolean }

const STARTERS = ['What services do you offer?', 'Have you worked with restaurants?', 'How much does it cost?']
const MAX = 600

/** Turns [1] in an answer into a link to that source's page. */
function withCitations(text: string, sources: Source[] = []): ReactNode[] {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    const source = match && sources[Number(match[1]) - 1]
    if (!source) return part
    return (
      <Link key={i} to={source.url} className="align-super text-[11px] font-semibold underline underline-offset-2 hover:text-white" aria-label={`Source ${match![1]}: ${source.title}`}>
        {match![1]}
      </Link>
    )
  })
}

/** The chat assistant: a button in the corner that opens a small conversation panel. */
export function Assistant() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [turns, busy])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (pathname.startsWith('/admin')) return null

  const ask = async (text: string) => {
    const message = text.trim()
    if (!message || busy) return
    const history = turns.filter((turn) => !turn.failed).map(({ role, content }) => ({ role, content }))
    setTurns((list) => [...list, { role: 'user', content: message }])
    setDraft('')
    setBusy(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      })
      const reply = await response.json().catch(() => ({}))
      if (response.ok) setTurns((list) => [...list, { role: 'assistant', content: reply.answer, sources: reply.sources }])
      else setTurns((list) => [...list, { role: 'assistant', content: reply.error || 'The assistant could not answer just now.', failed: true }])
    } catch {
      setTurns((list) => [...list, { role: 'assistant', content: 'The assistant could not be reached. Check your connection and try again.', failed: true }])
    }
    setBusy(false)
    inputRef.current?.focus()
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    ask(draft)
  }

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Ask flowpath"
          className="fixed z-[55] inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[400px] max-h-[min(640px,calc(100dvh-1.5rem))] flex flex-col rounded-3xl bg-[#221915] border border-white/15 shadow-2xl overflow-hidden"
        >
          <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-medium">Ask flowpath</h2>
              <p className="text-xs text-white/60">An AI assistant. It answers from this site and can be wrong.</p>
            </div>
            <button
              type="button"
              aria-label="Close the assistant"
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
              }}
              className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div ref={logRef} className="flex-1 overflow-y-auto px-5 py-4 grid gap-3 content-start" aria-live="polite">
            {turns.length === 0 && (
              <div>
                <p className="text-[15px] text-white/80 leading-relaxed">
                  Ask about our services, past work or how we charge. If you'd like the team to contact you, say so and I'll take your details.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {STARTERS.map((starter) => (
                    <button key={starter} type="button" onClick={() => ask(starter)} className="rounded-full border border-white/25 px-3.5 py-2 text-sm text-left hover:border-white/60">
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {turns.map((turn, i) =>
              turn.role === 'user' ? (
                <p key={i} className="justify-self-end max-w-[85%] rounded-2xl rounded-br-md bg-white text-[#17110E] px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {turn.content}
                </p>
              ) : (
                <div key={i} className={`justify-self-start max-w-[92%] rounded-2xl rounded-bl-md px-4 py-3 text-[15px] leading-relaxed ${turn.failed ? 'bg-[#4a2620] text-[#ffd9d2]' : 'bg-white/[0.08]'}`}>
                  <p className="whitespace-pre-wrap break-words">{withCitations(turn.content, turn.sources)}</p>
                  {turn.sources && turn.sources.length > 0 && (
                    <ol className="mt-3 pt-3 border-t border-white/10 grid gap-1 text-[13px] text-white/75">
                      {turn.sources.map((source, n) => (
                        <li key={source.url}>
                          {n + 1}.{' '}
                          <Link to={source.url} className="underline underline-offset-2 hover:text-white">
                            {source.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                  {turn.failed && (
                    <Link to="/contact" className="mt-2 inline-block underline underline-offset-2">
                      Go to the contact page
                    </Link>
                  )}
                </div>
              ),
            )}
            {busy && <p className="justify-self-start rounded-2xl rounded-bl-md bg-white/[0.08] px-4 py-2.5 text-[15px] text-white/70">Looking that up</p>}
          </div>

          <form onSubmit={submit} className="p-3 border-t border-white/10 flex items-end gap-2">
            <label htmlFor="assistant-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="assistant-input"
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={MAX}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  ask(draft)
                }
              }}
              placeholder="Type your question"
              className="field flex-1 resize-none !min-h-[48px] max-h-32"
            />
            <button
              type="submit"
              disabled={busy || !draft.trim()}
              aria-label="Send"
              className="w-12 h-12 shrink-0 inline-flex items-center justify-center rounded-full bg-white text-[#17110E] disabled:opacity-40"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </section>
      )}

      {!open && (
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-[55] right-4 bottom-4 sm:right-5 sm:bottom-5 inline-flex items-center gap-2 rounded-full bg-white text-[#17110E] pl-4 pr-5 py-3 text-sm font-semibold shadow-xl hover:bg-white/90"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          Ask flowpath
        </button>
      )}
    </>
  )
}
