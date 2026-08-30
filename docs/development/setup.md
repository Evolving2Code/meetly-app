# Setup Guide

Complete these steps to configure Supabase, Google Cloud, and Vercel for Meetly.

## Prerequisites

- GitHub repo imported to Vercel
- Supabase project created
- Google Cloud project with OAuth client

## 1. Supabase

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → create or open project
2. **Project Settings → API** — copy:

| Variable | Where to find |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (keep secret) |

3. **Authentication → Providers**
   - **Email:** enable (email + password signup)
   - **Google:** enable with Client ID + Secret (profile/email login only — no Calendar scopes here)

4. **Authentication → URL Configuration**
   - Site URL: your production URL, e.g. `https://meetly-evolving.vercel.app` (no trailing slash)
   - Redirect URLs:
     - `https://your-domain.vercel.app/**`
     - `https://*.vercel.app/**`

5. **SQL Editor** — run migration:
   - Copy all of `supabase/migrations/001_initial.sql`
   - Click **Run**

## 2. Google Cloud

1. [console.cloud.google.com](https://console.cloud.google.com) → create/select project
2. **APIs & Services → Library** → enable **Google Calendar API**
3. **OAuth consent screen → Scopes** — add:

**Login (non-sensitive):**

- `openid`
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`

**Calendar connect (sensitive):**

- `.../auth/calendar.events`
- `.../auth/calendar.readonly`

4. **Credentials → OAuth client → Web application**
5. **Authorized redirect URIs** — add both:

| URI | Purpose |
|-----|---------|
| `https://{project-ref}.supabase.co/auth/v1/callback` | Supabase Google login |
| `https://{your-domain}/auth/callback/google-calendar` | Calendar integration |

6. Copy Client ID + Secret to:
   - Supabase → Auth → Google provider
   - Vercel env vars (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)

If app is in **Testing** mode, add your Google account under OAuth consent screen → **Test users**.

## 3. Vercel

1. Project **Settings → General → Root Directory** must be **empty** (app is at repo root)
2. **Settings → Environment Variables** (Production + Preview):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Important:** `NEXT_PUBLIC_SITE_URL` must NOT have a trailing slash.

3. **Deployments → Redeploy** after env changes

## 4. Verify

1. Open `{SITE_URL}/signup`
2. Create account with email **or** Google
3. Land on dashboard with default event type
4. **Settings → Connect Google Calendar** (optional)
5. Copy booking link and test guest booking

See [operations/troubleshooting.md](../operations/troubleshooting.md) if anything fails.

## Related

- [local-dev.md](./local-dev.md) — running locally with same env vars
- [architecture/auth.md](../architecture/auth.md) — OAuth flow details
- `.env.example` at repo root — variable template
