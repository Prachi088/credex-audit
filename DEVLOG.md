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