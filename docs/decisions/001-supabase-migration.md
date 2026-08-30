# ADR 001: Migrate to Supabase

**Status:** Accepted  
**Date:** 2026-08 (Phase 1–4)

## Context

Early MVP used Prisma + SQLite + NextAuth. Cloud Agent development from mobile required a hosted database and auth that work without local infrastructure.

## Decision

Replace Prisma/SQLite/NextAuth with:

- **Supabase Postgres** for data
- **Supabase Auth** for email + Google login
- **Row Level Security** for access control
- **Vercel** for hosting

## Consequences

**Positive**

- No local DB setup; preview deploys work immediately
- RLS enforces host data isolation at the database layer
- Supabase Auth handles OAuth token refresh for login

**Negative**

- Schema changes require manual SQL in Supabase dashboard (no Prisma migrate)
- TypeScript types maintained manually in `types.ts`
- Guest booking requires service role client (no guest session)

## Related files

- `supabase/migrations/001_initial.sql`
- `src/lib/supabase/`
