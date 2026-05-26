## Day 1 — 2026-05-21

**Hours worked:** 6

**What I did:** 
Set up Next.js with TypeScript, Tailwind, Shadcn/ui. Created Supabase project and audits table. Built the spend input form with all 8 tools, plan selector, spend and seats inputs. Added localStorage persistence. Deployed to Vercel.

**What I learned:** 
Next.js App Router file-based routing. Shadcn/ui component setup. Supabase client initialization.

**Blockers / what I'm stuck on:** 
Nothing blocking. Shadcn Select component needs "use client" directive — learned that Next.js server components can't use hooks.

**Plan for tomorrow:** 
Build the audit engine — pricing rules for all 8 tools, recommendation logic, savings calculation.

## Day 2 — 2026-05-22

**Hours worked:** 6

**What I did:**
Built the audit engine with pricing rules for all 8 tools. Created results page showing per-tool savings breakdown and hero savings number. Wired up Supabase to save each audit and generate a unique UUID-based shareable URL. Fixed RLS policy blocking inserts.

**What I learned:**
Next.js API routes live in app/api/ — wrong folder location causes 404. Supabase Row Level Security blocks inserts by default — need to disable RLS or add policies. Next.js 16 requires params to be awaited as a Promise in dynamic routes.

**Blockers / what I'm stuck on:**
RLS issue took time to debug — had to read terminal logs carefully to spot the 42501 error code.

**Plan for tomorrow:**
Add Anthropic API for AI-generated summary. Add email capture with Resend. Polish the UI.

## Day 3 — 2026-05-23

**Hours worked:** 5

**What I did:**
Added AI-generated audit summary using Groq (llama-3.3-70b). Built email capture modal component. Created lead capture API route that saves email to Supabase and sends transactional email via Resend. Switched from Anthropic API to Groq due to insufficient credits.

**What I learned:**
Groq is a free alternative to Anthropic API with OpenAI-compatible SDK. Resend makes transactional email dead simple — just one API call. Environment variables must be restarted to take effect in Next.js.

**Blockers / what I'm stuck on:**
Anthropic API had no credits — switched to Groq. Resend free tier only sends to verified emails initially.

**Plan for tomorrow:**
Add Open Graph tags for shareable URLs. Polish UI. Add abuse protection. Deploy to Vercel.

## Day 4 — 2026-05-24

**Hours worked:** 4

**What I did:**
Added Open Graph tags to layout and shareable audit page. Fixed shareable page TSX errors. Deployed to Vercel at credex-audit-pink.vercel.app. Full end-to-end flow working on live URL.

**What I learned:**
Next.js generateMetadata function adds OG tags for dynamic pages. Vercel deployment is seamless with GitHub — just add env variables and deploy. PowerShell uses different commands than CMD for file operations.

**Blockers / what I'm stuck on:**
TSX errors in audit/[id]/page.tsx took time — old code kept mixing with new. Fixed by deleting and recreating the file.

**Plan for tomorrow:**
Write 5 tests for audit engine. Set up GitHub Actions CI. Write all required docs (GTM, ECONOMICS, REFLECTION, ARCHITECTURE, PRICING_DATA, PROMPTS, TESTS, LANDING_COPY, METRICS).

## Day 5 — 2026-05-24

**Hours worked:** 7

**What I did:**
Set up Vitest and wrote 6 tests for the audit engine — all passing. Created GitHub Actions CI workflow. Fixed all ESLint errors (apostrophes, any types, wrong folder structure, missing router dependency). Wrote all required docs: TESTS.md, PRICING_DATA.md, PROMPTS.md, ARCHITECTURE.md, GTM.md, ECONOMICS.md, REFLECTION.md, LANDING_COPY.md, METRICS.md, USER_INTERVIEWS.md, README.md.

**What I learned:**
GitHub Actions requires workflow scope on PAT to push CI files. ESLint in Next.js is strict about apostrophes in JSX — must use &apos; instead of '. Supabase RLS must be disabled or properly configured for anon key inserts.

**Blockers / what I'm stuck on:**
CI took multiple attempts to go green due to lint errors. Each fix required a new push and wait cycle.

**Plan for tomorrow:**
Take screenshots for README. Do user interviews. Final polish on UI. Submit.

## Day 6 — 2026-05-26

**Hours worked:** 5

**What I did:**
Applied dark theme to all pages — homepage, results page, and shareable audit page. Conducted 4 real user interviews with SATI students and updated USER_INTERVIEWS.md with real quotes and insights. Added screenshots to README. Final commit and push.

**What I learned:**
Real user interviews reveal unexpected insights — students think about AI tool costs very differently from startups. Seasonal usage patterns and account sharing are behaviors the audit engine should account for.

**Blockers / what I'm stuck on:**
Nothing blocking. App is fully functional and deployed.

**Plan for tomorrow:**
Submit the Google Form with GitHub repo URL, live URL, and all required files.