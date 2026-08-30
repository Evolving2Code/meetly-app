# Phase 6 — Hardening Checklist

MVP sign-off verification for Meetly. Run through this before calling the MVP done.

**Last updated:** 2026-08-30  
**Production URL:** https://meetly-evolving.vercel.app

---

## Automated checks (CI / local)

| Check | Status | Notes |
|-------|--------|-------|
| `npm run build` passes | ✅ | Verified 2026-08-30 |
| `npm run lint` passes | ✅ | Verified 2026-08-30 |
| `npm test` passes | ✅ | Username validation unit tests |
| Guest booking API returns camelCase fields | ✅ | Fixed `cancelToken` / `startTime` mismatch |
| Username validation on profile update | ✅ | Lowercase, length, charset enforced |
| Double-booking DB guard | ✅ | Migration `002_prevent_double_booking.sql` |

---

## Auth flows (manual — production)

Test on https://meetly-evolving.vercel.app from a phone and desktop browser.

| Flow | Status | Notes |
|------|--------|-------|
| Email signup | ⬜ | Supabase → Auth → Providers → Email must be enabled |
| Email login | ⬜ | |
| Google login (profile/email only) | ⬜ | No Calendar scopes at login |
| Session persists across dashboard navigation | ⬜ | Middleware refreshes cookies |
| Logged-out user redirected from `/dashboard` | ✅ | Returns 307 → `/login` |
| Logged-in user redirected from `/login` | ⬜ | |
| Email confirmation flow (if enabled) | ⬜ | Shows "Check your email" message on signup |

**Supabase URL config**

- Site URL = `NEXT_PUBLIC_SITE_URL` (no trailing slash)
- Redirect URLs include production + `https://*.vercel.app/**`

---

## Google Calendar (manual — production)

| Flow | Status | Notes |
|------|--------|-------|
| Connect from Settings | ⬜ | Redirect URI: `{SITE_URL}/auth/callback/google-calendar` |
| Disconnect from Settings | ⬜ | |
| Busy times block availability | ⬜ | Requires refresh token (`prompt=consent`) |
| Booking creates Calendar event + Meet link | ⬜ | |
| Cancellation removes Calendar event | ⬜ | |

**Google Cloud**

- Calendar API enabled
- OAuth consent screen includes `calendar.events` + `calendar.readonly`
- Test users added (if app is in Testing mode) or consent screen published

---

## Guest booking (manual — production)

| Flow | Status | Notes |
|------|--------|-------|
| Open `/book/{username}/{slug}` | ⬜ | Requires a host with username + active event type |
| Slots load for guest timezone | ⬜ | `GET /api/slots` |
| Book a slot end-to-end | ⬜ | `POST /api/bookings` |
| Confirmation shows correct time | ⬜ | |
| Cancel via token works | ⬜ | `DELETE /api/bookings?token=` |
| Past booking cannot be cancelled | ⬜ | Returns 400 |
| Slot conflict returns 409 | ⬜ | Pick taken slot or race condition |

---

## RLS spot-check (manual — Supabase SQL Editor)

Run as two different test users. Confirm cross-tenant access is blocked.

| Query | Expected |
|-------|----------|
| Host A reads own `bookings` | ✅ Rows returned |
| Host A reads Host B `bookings` | ❌ Empty (RLS) |
| Host A updates Host B `event_types` | ❌ No rows updated |
| Host A reads Host B `google_tokens` | ❌ Empty (RLS) |
| Anon reads `bookings` | ❌ Empty (no public policy) |
| Anon reads `profiles` with username | ✅ Public profiles only |
| Anon reads `availability_slots` | ✅ Intentional (needed for booking) |

Guest booking insert/update uses the **service role** server-side only — never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

---

## Security & ops

| Item | Status | Notes |
|------|--------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` only on server | ✅ | Used in admin client only |
| `google_tokens` RLS — host only | ✅ | Policy in `001_initial.sql` |
| OAuth state cookie for Calendar connect | ✅ | HttpOnly, 10 min TTL |
| Secrets not in repo | ✅ | `.env.example` has placeholders only |
| Rotate secrets if exposed in chat/logs | ⬜ | Manual — do if credentials were shared |
| Run migration `002_prevent_double_booking.sql` on Supabase | ⬜ | Apply in SQL Editor |

---

## Code fixes shipped in Phase 6

1. **Guest cancel token bug** — API returned `cancel_token` (snake_case) but UI expected `cancelToken`. Booking POST now returns normalized camelCase; UI also accepts both.
2. **Username validation** — Profile PATCH rejects invalid usernames before hitting the DB.
3. **Double-booking guard** — Unique partial index on `(host_id, start_time)` for confirmed bookings.
4. **Lint cleanup** — Removed unused imports, fixed React effect warnings.

---

## Sign-off

When all ⬜ items above are checked:

- [ ] Update this doc — mark items ✅
- [ ] Update [roadmap.md](./roadmap.md) — Phase 6 → Done
- [ ] Add entry to [CHANGELOG.md](../../CHANGELOG.md)
- [ ] Tag release `v0.2.0` (optional)
