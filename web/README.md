# Meetly

A Calendly-style scheduling app with **Option 5** branding (navy + lime), Google login, and Google Calendar sync.

## MVP features

- Google OAuth sign-in
- Google Calendar busy-time blocking and event creation
- Event types with booking links
- Weekly availability editor
- Guest booking flow (date → time → details → confirmation)
- Buffer times, minimum notice, and booking window limits
- Timezone support
- Booking cancellation
- Host dashboard

## Setup

1. Install dependencies:

```bash
cd web
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Configure Google OAuth in [Google Cloud Console](https://console.cloud.google.com/):

- Create an OAuth 2.0 Client ID (Web application)
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Enable the **Google Calendar API**
- Add scopes used by the app:
  - `openid`
  - `email`
  - `profile`
  - `https://www.googleapis.com/auth/calendar.events`
  - `https://www.googleapis.com/auth/calendar.readonly`

4. Set these values in `.env`:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-random-secret"
AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

5. Initialize the database:

```bash
npx prisma migrate dev --name init
```

6. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Sign in with Google.
2. Review your default event type and availability in the dashboard.
3. Copy your booking link from the dashboard or event types page.
4. Share `/book/{username}/{slug}` with guests.

## Tech stack

- Next.js App Router
- NextAuth.js (Google provider)
- Prisma + SQLite
- Google Calendar API
- Tailwind CSS
