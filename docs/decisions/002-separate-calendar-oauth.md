# ADR 002: Separate Calendar OAuth from Login

**Status:** Accepted  
**Date:** 2026-08 (Auth overhaul)

## Context

Google login failed during signup because Calendar API scopes were requested as part of the initial OAuth flow. Google's verification requirements for sensitive scopes blocked basic sign-in.

Calendly separates "create account" from "connect calendar."

## Decision

Use **two distinct OAuth flows** with the same Google OAuth client:

1. **Login** — Supabase Auth Google provider, scopes: `openid`, `email`, `profile` only
2. **Calendar connect** — Meetly-owned OAuth in Settings, scopes: `calendar.readonly`, `calendar.events`

Calendar tokens stored in `google_tokens` table via service role, not in Supabase Auth session.

## Consequences

**Positive**

- Google login works without Calendar verification at signup
- Hosts can use Meetly without connecting Calendar
- Calendar permission prompt only when host opts in

**Negative**

- Two redirect URIs to maintain in Google Cloud
- Hosts must explicitly connect Calendar for busy blocking and event sync
- Same Google client used for both flows (consent screen lists all scopes)

## Related files

- `src/components/auth/GoogleSignInButton.tsx`
- `src/lib/google-oauth.ts`
- `src/app/auth/callback/google-calendar/route.ts`
- [architecture/auth.md](../architecture/auth.md)
