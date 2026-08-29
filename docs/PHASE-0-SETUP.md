# Phase 0 Setup (Option A)

Complete these steps from your Android browser, then paste the values back to Cursor.

## 1. Supabase

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Name: `meetly`, choose a strong DB password, pick a region close to you
3. After creation, open **Project Settings → API** and copy:

| Variable | Where to find |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (keep secret) |

4. Open **Authentication → Providers → Google**:
   - Enable Google
   - Paste Google Client ID + Secret (from step 2 below)
5. Open **Authentication → URL Configuration**:
   - Site URL: `https://meetly-evolving.vercel.app` (no trailing slash)
   - Redirect URLs (add all):
     - `https://meetly-evolving.vercel.app/**`
     - `https://*.vercel.app/**`
6. Open **SQL Editor** → run the migration:
   - Copy all of `supabase/migrations/001_initial.sql` from this repo
   - Click **Run**

## 2. Google Cloud

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create/select a project → **APIs & Services → Library** → enable **Google Calendar API**
3. **OAuth consent screen** → External → add scopes:
   - `.../auth/calendar.events`
   - `.../auth/calendar.readonly`
4. **Credentials → Create OAuth client → Web application**
5. Authorized redirect URIs — add **only**:
   - `https://xrahnomkkduqkupltnop.supabase.co/auth/v1/callback`
   - (Always use the callback URL shown in Supabase → Auth → Google)
6. Copy **Client ID** and **Client Secret** into Supabase Google provider settings

## 3. Vercel

1. Go to [vercel.com](https://vercel.com) → your **meetly-evolving** project
2. **Settings → General → Root Directory** must be **empty** (repo root) — not `web`
3. **Settings → Environment Variables** (Production + Preview):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xrahnomkkduqkupltnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://meetly-evolving.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Important:** `NEXT_PUBLIC_SITE_URL` must NOT have a trailing slash.

4. **Deployments → Redeploy** the latest production deployment

## 4. Verify on Android

1. Open https://meetly-evolving.vercel.app
2. Tap **Sign in with Google**
3. Land on dashboard with default event type
4. Copy booking link and test a guest booking

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Vercel 404 | Root Directory must be empty (app is at repo root). Redeploy after merge. |
| Auth redirect error | Check Supabase Site URL + Redirect URLs match Vercel domain |
| Google sign-in fails | Client ID/Secret must be in Supabase Google provider, not just Vercel |
| Booking fails | Confirm SQL migration was run in Supabase SQL Editor |
