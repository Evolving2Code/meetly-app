# Meetly

Calendly-style scheduling app with **Option 5** branding (navy + lime), built for cloud-first development from any device.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres + Auth + RLS)
- **Vercel** (hosting + preview deploys)
- **Google Calendar API** (busy-time blocking + event creation)

## MVP features

- Google OAuth sign-in (via Supabase Auth)
- Google Calendar sync
- Event types with booking links
- Weekly availability editor
- Guest booking flow (date → time → details → confirmation)
- Buffer times, minimum notice, and booking window limits
- Timezone support
- Booking cancellation
- Host dashboard

## First-time setup (Option A)

Follow the step-by-step guide: [`docs/PHASE-0-SETUP.md`](docs/PHASE-0-SETUP.md)

Quick summary:

1. Create a **Supabase** project and run `supabase/migrations/001_initial.sql` in the SQL Editor
2. Enable **Google provider** in Supabase Auth
3. Create **Google OAuth** credentials (Calendar API enabled)
4. Import this repo to **Vercel** (no subdirectory — app is at repo root)
5. Add environment variables in Vercel (Production + Preview):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Daily workflow (Android-friendly)

```
Push branch → Vercel preview deploy → test on your phone → merge → production
```

No local database. No SQLite.

## Usage

1. Open your Vercel URL on your phone
2. **Sign up** with email/password or Google (basic login — no Calendar scopes)
3. Optionally **Connect Google Calendar** in Settings
4. Copy your booking link from the dashboard
5. Share `/book/{username}/{slug}` with guests

## Project structure

```
src/app/              # Pages and API routes
src/components/       # UI components
src/lib/supabase/     # Supabase clients (browser, server, admin)
src/lib/scheduling/   # Slot calculation logic
supabase/migrations/  # SQL schema (run in Supabase dashboard)
```

## Phase 5 (upcoming)

Mobile-first UI redesign: bottom nav dashboard, stacked booking layout, touch-optimized controls.
