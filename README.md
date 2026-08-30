# Meetly

Calendly-style scheduling app with **Option 5** branding (navy + lime), built for cloud-first development from any device.

**Live app:** https://meetly-evolving.vercel.app

**Full documentation → [`docs/README.md`](docs/README.md)**

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres + Auth + RLS)
- **Vercel** (hosting + preview deploys)
- **Google Calendar API** (optional integration — busy blocking + event sync)

## MVP features

- Email signup and login
- Google login (profile/email only — no Calendar at signup)
- Optional Google Calendar connect in Settings
- Event types with booking links (`/book/{username}/{slug}`)
- Weekly availability editor
- Guest booking flow (date → time → details → confirmation)
- Buffer times, minimum notice, and booking window limits
- Timezone support
- Booking cancellation
- Mobile-first host dashboard

## Quick start

1. Read [`docs/product/overview.md`](docs/product/overview.md) for context
2. Follow [`docs/development/setup.md`](docs/development/setup.md) to configure Supabase, Google, and Vercel
3. Copy `.env.example` → `.env.local` if running locally (see [`docs/development/local-dev.md`](docs/development/local-dev.md))

## Daily workflow

```
Push branch → Vercel preview deploy → test on your phone → merge → production
```

Details: [`docs/development/workflow.md`](docs/development/workflow.md)

## Project structure

```
docs/                 Documentation (start at docs/README.md)
src/app/              Pages and API routes
src/components/       UI components
src/lib/supabase/     Supabase clients (browser, server, admin)
src/lib/scheduling/   Slot calculation logic
supabase/migrations/  SQL schema
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
