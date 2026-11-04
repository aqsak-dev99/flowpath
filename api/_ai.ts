/*
 * The only file that talks to an AI provider.
 * It uses the OpenAI-compatible chat format, which Groq, OpenAI, Gemini and others accept,
 * so changing provider means changing three environment variables, not code.
 */
export type Message = { role: 'system' | 'user' | 'assistant'; content: string }
export type ToolCall = { name: string; args: Record<string, unknown> }
export type Completion = { text: string; toolCall?: ToolCall; tokens: number }
export type Complete = (messages: Message[], tools: unknown[]) => Promise<Completion>

export const DEFAULT_MODEL = 'openai/gpt-oss-120b'

export const realComplete: Complete = async (messages, tools) => {
  const base = (process.env.LLM_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/$/, '')
  const model = process.env.LLM_MODEL || DEFAULT_MODEL
  // Reasoning models think before they answer, and that thinking counts towards the token limit,
  // so the limit is generous and the effort is kept low. Set LLM_REASONING_EFFORT=off for models without it.
  const effort = process.env.LLM_REASONING_EFFORT || (model.includes('gpt-oss') ? 'low' : 'off')
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.LLM_API_KEY}` },
    body: JSON.stringify({
      model,
      messages,
      tools,
      tool_choice: 'auto',
      temperature: 0.2,
      max_tokens: Number(process.env.LLM_MAX_TOKENS || 1500),
      ...(effort === 'off' ? {} : { reasoning_effort: effort }),
    }),
    signal: AbortSignal.timeout(25_000),
  })
  if (!response.ok) throw new Error(`AI provider returned ${response.status}: ${(await response.text()).slice(0, 300)}`)
  const data: any = await response.json()
  const message = data.choices?.[0]?.message || {}
  const call = message.tool_calls?.[0]?.function
  let toolCall: ToolCall | undefined
  if (call?.name) {
    let args: Record<string, unknown> = {}
    try {
      args = JSON.parse(call.arguments || '{}')
    } catch {
      args = {}
    }
    toolCall = { name: call.name, args }
  }
  return { text: String(message.content || ''), toolCall, tokens: Number(data.usage?.total_tokens || 0) }
}

/**
 * A stand-in used only for local development and tests (LLM_API_KEY=offline).
 * It does not think: it quotes the best-matching passage, so you can try the whole
 * chat flow on your computer without an account or a key.
 */
export const offlineComplete: Complete = async (messages) => {
  const system = messages[0]?.content || ''
  const question = messages[messages.length - 1]?.content || ''
  const email = question.match(/[^\s@,]+@[^\s@,]+\.[^\s@,]+/)?.[0]
  if (email) {
    const name = question.match(/(?:i am|i'm|my name is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i)?.[1] || 'Website visitor'
    return { text: '', toolCall: { name: 'create_lead', args: { name, email: email.replace(/[.,]$/, ''), need: question } }, tokens: 0 }
  }
  if (/\b(contact me|get in touch|call me|reach me)\b/i.test(question)) {
    return { text: 'Happy to arrange that. What is your name, your email address, and what do you need help with?', tokens: 0 }
  }
  const listed = system.split('Sources:\n')[1] || ''
  const first = listed.match(/^\[1\] .*\n([\s\S]*?)(?:\n\n\[2\]|$)/)
  if (!first) return { text: '[[NO_ANSWER]] I can only help with questions about flowpath and its services.', tokens: 0 }
  const sentences = first[1].split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')
  return { text: `${sentences} [1]`, tokens: 0 }
}

export const getComplete = (): Complete | null =>
  process.env.LLM_API_KEY === 'offline' ? offlineComplete : process.env.LLM_API_KEY ? realComplete : null