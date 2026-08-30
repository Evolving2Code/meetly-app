# Product Overview

## What is Meetly?

Meetly is a **Calendly-style scheduling app** for hosts who want to share a booking link and let guests pick a time. Hosts manage availability, event types, and bookings from a dashboard. Guests book without creating an account.

## Who is it for?

**Primary user:** A solo host (consultant, freelancer, coach) who schedules meetings from a phone and wants a simple, mobile-friendly workflow.

**Secondary user:** A guest who receives a booking link and completes a short flow: pick date → pick time → enter details → confirmation.

## Core user journeys

### Host: get started

1. Visit `/signup` or `/login`
2. Create account with **email + password** or **Google** (basic login only)
3. Land on dashboard with a default event type and Mon–Fri 9–5 availability
4. Optionally connect Google Calendar in **Settings**
5. Copy booking link (`/book/{username}/{slug}`) and share it

### Guest: book a meeting

1. Open host's booking link
2. Choose a date and available time slot
3. Enter name, email, optional notes
4. Receive confirmation (Google Calendar event created if host connected Calendar)

### Host: manage schedule

- **Overview** — upcoming bookings, quick stats, share link
- **Event Types** — duration, buffers, min notice, booking window
- **Availability** — weekly hours editor
- **Settings** — profile, timezone, Google Calendar connect/disconnect

## MVP scope (in)

| Feature | Status |
|---------|--------|
| Email signup and login | ✅ |
| Google login (profile/email only) | ✅ |
| Google Calendar connect (optional, in Settings) | ✅ |
| Event types with booking links | ✅ |
| Weekly availability editor | ✅ |
| Guest booking flow | ✅ |
| Buffer times, min notice, max days ahead | ✅ |
| Timezone support | ✅ |
| Booking cancellation (guest token) | ✅ |
| Host dashboard (mobile-first) | ✅ |
| Google Calendar busy blocking + event create/delete | ✅ (when connected) |

## Explicitly out of scope (for now)

- Team accounts / multi-user organizations
- Payment collection (Stripe)
- Custom domains
- Email reminders / notifications beyond Calendar invites
- Date overrides UI (schema exists; UI not built)
- Recurring availability rules beyond weekly slots
- Native mobile apps

## Branding

**Option 5:** Navy (`#0F172A`) + lime (`#84CC16`), bold typography, split booking layout. See [design/system.md](../design/system.md).

## Key URLs

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing |
| `/signup` | Create account |
| `/login` | Sign in |
| `/dashboard` | Host home |
| `/dashboard/event-types` | Manage event types |
| `/dashboard/availability` | Weekly hours |
| `/dashboard/settings` | Profile + Calendar |
| `/book/{username}/{slug}` | Public booking page |
