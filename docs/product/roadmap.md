# Roadmap

Phases for building Meetly as a cloud-first MVP, developed primarily from mobile via Cursor Cloud + Vercel previews.

## Phase status

| Phase | Focus | Status |
|-------|-------|--------|
| **0** | Cloud setup (Supabase, Google, Vercel) | ✅ Done |
| **1–4** | Supabase migration (Postgres, Auth, RLS), remove Prisma/SQLite/NextAuth | ✅ Done |
| **5** | Mobile-first UI (bottom nav, touch targets, share API) | ✅ Done |
| **Auth overhaul** | Calendly-style: email + Google login, separate Calendar connect | ✅ Done |
| **6** | Hardening & MVP sign-off | 🔲 Next |

## Phase 6 — Hardening (next)

Suggested checklist before calling MVP "done":

- [ ] Verify all auth flows on production (email signup, email login, Google login)
- [ ] Verify Google Calendar connect in Settings
- [ ] End-to-end guest booking on production URL
- [ ] RLS spot-check (users cannot read/write each other's private data)
- [ ] Confirm Supabase Email provider enabled
- [ ] Rotate any secrets exposed in chat/logs
- [ ] Google OAuth app: test users or publish consent screen for Calendar scopes

## Future (post-MVP)

Not committed — ideas only:

- Date overrides UI
- Email confirmation UX polish
- Booking confirmation emails to guest
- Multiple calendars / calendar picker
- Custom branding per host
- Analytics (views, conversion)
- Team scheduling

## How to update this doc

When a phase ships, move it to ✅ Done and add a line to [CHANGELOG.md](../../CHANGELOG.md) at the repo root.
