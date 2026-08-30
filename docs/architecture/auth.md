# Authentication

Meetly uses a **Calendly-style split**: account creation/login is separate from Google Calendar integration.

## Two OAuth flows, one Google client

The same Google OAuth Client ID/Secret is used in two places, but **different scopes are requested at different times**.

| Flow | Trigger | Handler | Scopes |
|------|---------|---------|--------|
| **Login** | `/signup`, `/login` → "Continue with Google" | Supabase Auth | `openid`, `email`, `profile` |
| **Calendar connect** | Settings → Connect Google Calendar | Meetly (`src/lib/google-oauth.ts`) | `calendar.readonly`, `calendar.events` |

## Email auth

**Pages:** `/signup`, `/login`  
**Component:** `src/components/auth/EmailAuthForm.tsx`

- Signup: `supabase.auth.signUp()` with `full_name` in user metadata
- Login: `supabase.auth.signInWithPassword()`
- Email confirm redirect: `{SITE_URL}/auth/callback` (if Supabase requires confirmation)
- Requires **Email provider enabled** in Supabase Auth settings

## Google login (basic)

**Component:** `src/components/auth/GoogleSignInButton.tsx`

```typescript
supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: `${siteUrl}/auth/callback` },
});
```

No custom scopes in app code — Supabase requests standard OIDC scopes only. **Do not** add Calendar scopes to the Supabase Google provider.

**Callback:** `src/app/auth/callback/route.ts`

1. Exchange code for session
2. Run `ensureUserOnboarded()` (username, default event type, availability)
3. Redirect to `/dashboard`

## Google Calendar connect (integration)

**Trigger:** Settings → `ConnectGoogleCalendarButton` → `GET /api/integrations/google/connect`  
**OAuth logic:** `src/lib/google-oauth.ts`  
**Callback:** `src/app/auth/callback/google-calendar/route.ts`

Scopes requested:

```
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/calendar.events
```

Tokens stored in `google_tokens` table (service role upsert). Used by `src/lib/google-calendar.ts` for:

- `freebusy.query` — block busy times in slot picker
- `events.insert` — create booking with Google Meet
- `events.delete` — cancel booking

**Disconnect:** `DELETE /api/integrations/google/connect` removes row from `google_tokens`.

## Onboarding

**File:** `src/lib/auth/onboarding.ts`

Runs after OAuth callback and on every dashboard layout load (idempotent):

1. Assign unique `username` from email prefix if missing
2. Create default event type ("30 Minute Meeting", slug `30-min`) if none
3. Create Mon–Fri 9:00–17:00 availability if none

## Session protection

| Mechanism | Location |
|-----------|----------|
| Middleware session refresh | `src/middleware.ts`, `src/lib/supabase/middleware.ts` |
| Server session read | `src/lib/auth/session.ts` |
| API auth guard | `src/lib/api-utils.ts` → `requireAuth()` |
| Dashboard guard | `requireUser()` in dashboard layout |

Unauthenticated access to `/dashboard/*` redirects to `/login`.

## Google Cloud Console setup

On **OAuth consent screen**, register all scopes the app may request:

**Non-sensitive (login via Supabase):**

- `openid`
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`

**Sensitive (Calendar connect only):**

- `.../auth/calendar.readonly`
- `.../auth/calendar.events`

**Redirect URIs** (same OAuth client):

| URI | Purpose |
|-----|---------|
| `https://{project-ref}.supabase.co/auth/v1/callback` | Supabase Google login |
| `https://{your-domain}/auth/callback/google-calendar` | Calendar integration |

## Supabase URL configuration

- **Site URL:** `NEXT_PUBLIC_SITE_URL` (no trailing slash)
- **Redirect URLs:** production domain + `https://*.vercel.app/**` for previews

## Security notes

- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — only used server-side for guest booking, onboarding, and token storage
- Never expose service role or Google client secret to the browser
- Calendar tokens are host-only via RLS on `google_tokens`

## Related

- [development/setup.md](../development/setup.md) — step-by-step provider config
- [operations/troubleshooting.md](../operations/troubleshooting.md) — auth error fixes
- [decisions/002-separate-calendar-oauth.md](../decisions/002-separate-calendar-oauth.md) — why login and Calendar are split
