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
   - Leave Client ID/Secret empty until step 2 below
5. Open **Authentication → URL Configuration**:
   - Site URL: `https://YOUR-APP.vercel.app` (update after Vercel step)
   - Redirect URLs (add all):
     - `https://YOUR-APP.vercel.app/**`
     - `https://*.vercel.app/**`
     - `http://localhost:3000/**` (optional fallback)

6. Open **SQL Editor** → run the migration file:
   - Copy contents of `web/supabase/migrations/001_initial.sql`
   - Click **Run**

## 2. Google Cloud

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create/select a project → **APIs & Services → Library** → enable **Google Calendar API**
3. **OAuth consent screen** → External → add scopes:
   - `.../auth/calendar.events`
   - `.../auth/calendar.readonly`
4. **Credentials → Create OAuth client → Web application**
5. Authorized redirect URIs — add **only**:
   - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
   - (Find exact URL in Supabase → Auth → Providers → Google)
6. Copy **Client ID** and **Client Secret** into Supabase Google provider settings

## 3. Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → import `meetly-app` from GitHub
2. **Root Directory:** `web`
3. **Environment Variables** (Production + Preview):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://YOUR-APP.vercel.app
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

4. Deploy
5. Copy your live URL (e.g. `https://meetly-app.vercel.app`)
6. Go back to Supabase → **Authentication → URL Configuration**:
   - Set Site URL to your Vercel URL
   - Confirm redirect URLs include `https://*.vercel.app/**`

## 4. Paste back to Cursor

Reply with:

```
SUPABASE_URL: ...
SUPABASE_ANON_KEY: ...
SUPABASE_SERVICE_ROLE_KEY: ...
VERCEL_URL: https://....vercel.app
GOOGLE_CLIENT_ID: ...
GOOGLE_CLIENT_SECRET: ...
```

(Cursor Cloud env can store these so agents don't need local `.env` files.)

## 5. Verify on Android

1. Open your Vercel URL on your phone
2. Tap **Sign in with Google**
3. Land on dashboard with default event type
4. Copy booking link and test a guest booking
