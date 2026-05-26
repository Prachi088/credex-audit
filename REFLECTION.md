# REFLECTION.md

## 1. The hardest bug I hit this week

The hardest bug was the Supabase Row Level Security (RLS) error blocking all inserts. When I first wired up the `/api/save-audit` route, every POST returned a 500 error. The frontend showed no share button and no error message — it just silently failed.

My debugging process:
- First hypothesis: wrong API keys. Checked `.env.local` — keys were correct.
- Second hypothesis: wrong folder structure. The `api` folder was inside `results/` instead of `app/`. Moved it — still failing.
- Third hypothesis: Supabase schema issue. Opened terminal logs and finally saw the error code `42501` with message "new row violates row-level security policy". 

I had never worked with Supabase RLS before. Googled the error code, found that Supabase enables RLS by default on all tables which blocks inserts from the anon key. Fix was one SQL command: `ALTER TABLE audits DISABLE ROW LEVEL SECURITY`. In production I would add proper RLS policies instead of disabling it entirely, but for this MVP it was the right tradeoff.

The lesson: always check terminal logs before assuming the problem is in the frontend.

## 2. A decision I reversed mid-week

I started with the Anthropic API for the AI summary feature — it was the assignment's recommended choice. I set up the API key, installed the SDK, wrote the route, and tested it. It worked in terms of code but failed at runtime with "Your credit balance is too low."

My initial reaction was to add $5 credits and move on. But I reversed this decision after thinking about it: the assignment evaluates engineering decisions, and switching to Groq (free, OpenAI-compatible, comparable quality) was the smarter call for a week-long project with no budget. It also demonstrates that I know when not to spend money unnecessarily.

What made me reverse it: realizing that paying for API credits just to pass a test is the wrong instinct. The better instinct is finding the free alternative that works just as well — which is exactly the mindset this product is built around.

## 3. What I would build in week 2

**Week 2 priorities:**

1. **Benchmark mode** — "Your AI spend per developer is $X. Companies your size average $Y." This requires collecting aggregate data from audits (anonymized) and building a comparison engine. It's the feature most likely to go viral because people love knowing where they stand vs peers.

2. **PDF export** — A downloadable report the user can share with their CFO or board. Removes friction from the "get approval to switch tools" step which is the real blocker for most engineering managers.

3. **Embeddable widget** — A `<script>` tag version bloggers and newsletters could embed. Every embed is distribution. A newsletter with 10,000 subscribers embedding the audit widget = thousands of new users in one send.

4. **Proper RLS policies** — Replace the disabled RLS with proper row-level security so the database is production-safe.

5. **Rate limiting** — Add Upstash Redis rate limiting to all API routes to prevent abuse.

## 4. How I used AI tools

**Tools used:** Claude (this conversation), Windsurf (code editor with AI)

**What I used Claude for:**
- Step-by-step guidance on Next.js App Router concepts I hadn't used before
- Debugging errors (sharing terminal output and getting diagnosis)
- Writing boilerplate code for API routes and components
- Writing the markdown documentation files

**What I used Windsurf for:**
- Autocomplete while writing TypeScript
- Quick inline suggestions for Tailwind classes

**What I didn't trust AI with:**
- The audit engine pricing logic — I verified every number against official pricing pages myself
- The ECONOMICS.md math — I did the unit economics calculations myself and used AI only to format them
- Git commits — wrote every commit message myself to ensure they were meaningful

**One specific time AI was wrong:**
Claude suggested using `params.id` directly in the Next.js 15+ dynamic route handler. This caused a TypeScript error because in Next.js 16, `params` is now a Promise and must be awaited: `const { id } = await params`. Claude's training data had the older pattern. I caught it because the TypeScript error was clear and I understood what `Promise<{id: string}>` meant from my Java background.

## 5. Self-rating

| Dimension | Rating | Reason |
|---|---|---|
| Discipline | 7/10 | Committed every day but Day 3 was shorter than planned due to API credit issues |
| Code quality | 7/10 | Code is readable and typed but some `any` types remain and RLS is disabled |
| Design sense | 6/10 | UI is clean and functional but not polished enough to screenshot-share without embarrassment |
| Problem solving | 8/10 | Debugged RLS, wrong folder structure, and CI lint errors systematically without giving up |
| Entrepreneurial thinking | 7/10 | GTM and economics are specific and realistic; user interviews were the weakest part |