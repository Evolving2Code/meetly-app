# MeetLime

Calendly-style scheduling app with Option 5 branding (navy + lime).

The application lives in the [`web/`](./web) directory.

## Quick start

```bash
cd web
cp .env.example .env
# Add Google OAuth credentials and AUTH_SECRET (see web/README.md)
npm install
npx prisma migrate dev
npm run dev
```

See [web/README.md](./web/README.md) for full setup instructions.
