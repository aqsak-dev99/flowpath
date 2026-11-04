# flowpath

A multi-page website for a digital marketing studio, with a backend that saves enquiries, an admin page to manage them, and an AI assistant that answers visitors from the site content.

**Stack:** React, TypeScript, Tailwind CSS, React Router, Vite. Backend: Vercel serverless functions (Node.js), PostgreSQL, and any AI model with an OpenAI-compatible API.

## What it does

**The website**
- Eight pages: home, services, work, a page per case study, about, contact, privacy, not found.

**The backend**
- The contact form posts to `/api/contact`, which checks the fields again on the server and saves the enquiry to PostgreSQL.
- Spam protection: a hidden field that only bots fill, and a limit of five enquiries per address in ten minutes.
- `/admin` is protected by a password. After signing in you can read enquiries, mark them new, contacted, won or lost, and add notes.
- The admin session is a signed, HttpOnly cookie that expires after 12 hours.
- Visitor network addresses are stored only as a one-way hash.

**The AI assistant**
- A chat button on every page. It answers visitors' questions from the site's own content and links each answer to the page it came from.
- It declines questions that are off-topic or that the site does not answer, and it is told to treat instructions inside messages as off-topic.
- It can take one action: passing a visitor's name, email and need to the team as an enquiry. The server checks those details the same way it checks the contact form.
- Limits protect the cost: 600 characters per message, 20 messages per visitor in ten minutes, and a daily cap across the whole site.
- The admin page shows how many messages it handled, how many it answered, and how many enquiries it created.

## How the assistant works

1. **Search.** The site content in `src/data.ts` is cut into about twenty short passages. A keyword search (BM25) picks the four closest to the question. With this little content a keyword search is accurate and free, so there is no embedding model or vector database.
2. **Answer.** The passages are numbered and given to the model with strict rules: use only these sources, cite them as `[1]`, and start with a fixed marker if the answer is not there.
3. **Check.** The server, not the model, turns `[1]` into a real link. A citation number that does not match a source is deleted, so a link can never be invented.
4. **Act.** The model has one tool, `create_lead`. Its arguments go through the same validation as the contact form, and the confirmation message is written by the server.
5. **Record.** Every message is stored with whether it was answered, what it cited and how many tokens it used.

One file, `api/_ai.ts`, talks to the AI provider. It uses the OpenAI-compatible format, so Groq, OpenAI, Gemini and others work by changing three environment variables.

## Evaluation

`evals/cases.ts` holds 29 test questions in four groups: questions it should answer and cite, questions it should decline (including two prompt-injection attempts), a visitor who gives their details, and a visitor who has not yet.

```bash
npm run eval:retrieval            # the search step alone, no AI model needed
LLM_API_KEY=your-key npm run eval # the whole assistant against a real model
```

| Check | Result |
|---|---|
| Search: right page in the top four passages | 20 of 20 |
| Search: right page ranked first | 20 of 20 |
| Full assistant with a real model | Not measured yet. Run `npm run eval` with a key and record the numbers here |

The search score is measured on questions written alongside the search itself, so treat it as an upper bound. Add questions from real visitors (the admin page lists them) to make it a fair test.

Running `npm run eval` without a key uses an offline stand-in that only quotes the top passage. It checks that the plumbing works. It cannot decline anything, so its score says nothing about a real model.

## Run it on your computer

Use two terminals.

```bash
npm install
npm run dev:api     # terminal 1: the API, with a throwaway in-memory database
npm run dev         # terminal 2: the website
```

Open the address the second terminal prints. The local admin password is `admin12345`. Enquiries and chats disappear when you stop the API, because the local database lives in memory.

Locally the assistant uses the offline stand-in. To try a real model, start the API with a key:

```bash
LLM_API_KEY=your-key npm run dev:api
```

## Run the tests

```bash
npm test
```

23 tests cover the backend and the assistant's logic, followed by the search check.

## Deploy to Vercel with a real database

1. Create a free PostgreSQL database (for example at neon.tech) and copy its connection string.
2. Get an API key from an AI provider with an OpenAI-compatible API (Groq has a free tier).
3. In the Vercel project, open Settings > Environment Variables and add the values listed in `.env.example`.
4. Run `vercel --prod`.

The tables are created automatically the first time the API runs. If `LLM_API_KEY` is not set, the site works as normal and the assistant tells visitors to use the contact page.

## Where things are

| Path | What it holds |
|---|---|
| `src/data.ts` | All the site's content, which is also the assistant's knowledge |
| `src/App.tsx` | Header, footer and the list of pages |
| `src/pages.tsx` | Each public page |
| `src/assistant.tsx` | The chat widget |
| `src/admin.tsx` | The admin page |
| `src/ui.tsx` | Shared pieces, including the contact form |
| `api/_lib.ts` | Enquiries: validation, saving, rate limit, sessions |
| `api/_knowledge.ts` | The passages and the keyword search |
| `api/_chat.ts` | The assistant: limits, prompt, citations, the lead tool |
| `api/_ai.ts` | The only file that talks to the AI provider |
| `api/_db.ts` | The database connection |
| `api/*.ts`, `api/admin/*.ts` | The API addresses listed below |
| `tests/api.test.ts` | Tests |
| `evals/` | The evaluation questions and runners |
| `scripts/dev-api.ts` | Local stand-in for Vercel's functions |

## API

| Method and address | Needs sign-in | What it does |
|---|---|---|
| `POST /api/contact` | No | Saves an enquiry. Returns 400 with field errors, or 429 when rate limited |
| `POST /api/chat` | No | One message to the assistant. Returns the answer, its sources and whether an enquiry was created |
| `POST /api/admin/login` | No | Checks the password and sets the session cookie |
| `POST /api/admin/logout` | No | Clears the session cookie |
| `GET /api/admin/leads` | Yes | Lists enquiries, newest first |
| `PATCH /api/admin/leads` | Yes | Changes one enquiry's status or notes |
| `GET /api/admin/chats` | Yes | Assistant totals and the latest 50 messages |

## Known limits

- The browser sends the earlier turns of a conversation, so a visitor could fake them. Faked system messages are dropped, and the worst outcome is a strange answer in their own chat.
- The search is keyword-based. It handles the wording in `SYNONYMS` in `api/_knowledge.ts` and will miss unusual phrasings. If the content grows past a few hundred passages, switch to embeddings.
- The rate limits count by network address, so many visitors behind one shared connection share a limit.

## Before a client uses it

The studio, clients, numbers, team and contact details are placeholders. The background video and the font load from other people's servers, so replace them with ones you own (`SITE.video` in `src/data.ts`, and the `@import` at the top of `src/index.css`).
