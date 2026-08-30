# Meetly Documentation

**Start here.** This folder is the onboarding spine for the project — product context, architecture, development workflow, and operations.

## Quick links

| I want to… | Read |
|------------|------|
| Understand what we're building | [product/overview.md](./product/overview.md) |
| See what's done and what's next | [product/roadmap.md](./product/roadmap.md) |
| Understand the system at a glance | [architecture/overview.md](./architecture/overview.md) |
| Understand auth (email, Google, Calendar) | [architecture/auth.md](./architecture/auth.md) |
| Understand the database and RLS | [architecture/database.md](./architecture/database.md) |
| Understand slot calculation | [architecture/scheduling.md](./architecture/scheduling.md) |
| Set up Supabase, Google, and Vercel | [development/setup.md](./development/setup.md) |
| Run the app locally | [development/local-dev.md](./development/local-dev.md) |
| Branch → preview → merge workflow | [development/workflow.md](./development/workflow.md) |
| Look up API routes | [api/routes.md](./api/routes.md) |
| Fix a production issue | [operations/troubleshooting.md](./operations/troubleshooting.md) |
| Understand past technical choices | [decisions/](./decisions/) |
| Match UI branding and patterns | [design/system.md](./design/system.md) |

## Live app

- **Production:** https://meetly-evolving.vercel.app
- **Repo:** https://github.com/Evolving2Code/meetly-app

## Stack (one line)

Next.js (App Router) + TypeScript + Tailwind · Supabase (Postgres, Auth, RLS) · Vercel · Google Calendar API

## Source layout

```
src/app/              Pages and API routes
src/components/       UI (auth, booking, dashboard)
src/lib/supabase/     Supabase clients (browser, server, admin)
src/lib/scheduling/   Slot calculation
src/lib/auth/         Session helpers and onboarding
src/lib/google-*.ts   Calendar OAuth and API
supabase/migrations/  SQL schema (run in Supabase dashboard)
```

## Conventions

- **Schema source of truth:** `supabase/migrations/001_initial.sql`
- **Env vars:** `.env.example` at repo root
- **Agent/IDE rules:** `AGENTS.md` (Next.js auto-generated)
