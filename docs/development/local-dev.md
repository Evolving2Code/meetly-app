# Local Development

Meetly is designed **cloud-first** (Supabase + Vercel), but you can run the Next.js app locally for faster UI iteration.

## Requirements

- Node.js 20+
- npm

## Setup

1. Clone the repo
2. Copy env template:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local` with the same values as Vercel (remote Supabase project — no local DB)

4. Install and run:

```bash
npm install
npm run dev
```

5. Open http://localhost:3000

## What works locally

| Feature | Notes |
|---------|-------|
| UI / dashboard | ✅ Full pages |
| Email auth | ✅ Requires Supabase Email provider + redirect URLs include `http://localhost:3000/**` |
| Google login | ⚠️ Add `http://localhost:3000/auth/callback` to Supabase redirect URLs; Google OAuth may need localhost redirect URI |
| Google Calendar connect | ⚠️ Add `http://localhost:3000/auth/callback/google-calendar` to Google redirect URIs |
| Guest booking | ✅ Uses admin client against remote Supabase |

## Supabase redirect URLs for local dev

Add to Supabase **Authentication → URL Configuration → Redirect URLs**:

```
http://localhost:3000/**
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build check |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |

## No local database

There is no SQLite or local Postgres. All data lives in your Supabase project. This matches production and avoids schema drift.

## Recommended workflow

For mobile-first development without local setup, see [workflow.md](./workflow.md) — push branch, test Vercel preview on your phone.
