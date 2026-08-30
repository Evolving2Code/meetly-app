# Troubleshooting

Common production issues and fixes for Meetly.

## Deployment

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Vercel 404 on all routes | Root Directory set to subdirectory | Vercel → Settings → General → Root Directory = **empty**. Redeploy. |
| Stale behavior after merge | Old deployment cached | Vercel → Deployments → Redeploy latest |
| Env vars not applied | Added vars without redeploy | Redeploy after changing env vars |

## Authentication

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Auth redirect error / `?error=auth` | Supabase URL config mismatch | Set Site URL = `NEXT_PUBLIC_SITE_URL` (no trailing slash). Add redirect URLs for prod + `https://*.vercel.app/**` |
| Email signup fails | Email provider disabled | Supabase → Auth → Providers → enable Email |
| "Check your email" but no mail | Supabase email not configured | Use Supabase default mail or configure SMTP; check spam |
| Google sign-in fails | Wrong client ID/secret in Supabase | Match Google Cloud OAuth client credentials in Supabase Google provider |
| Google sign-in fails (Testing mode) | User not a test user | Google Cloud → OAuth consent screen → add Test users |
| Google asks for Calendar at login | Calendar scopes on Supabase provider | Remove custom scopes from Supabase Google provider; Calendar is Settings-only |
| Session lost on navigation | Cookie / middleware issue | Confirm middleware runs; check `NEXT_PUBLIC_SITE_URL` matches domain |

## Google Calendar

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Connect button fails | Missing redirect URI | Add `{SITE_URL}/auth/callback/google-calendar` to Google OAuth redirect URIs |
| Connect succeeds but no busy blocking | No refresh token | Disconnect and reconnect (prompt=consent). Ensure `access_type=offline` in oauth URL |
| Events not created on book | Calendar not connected or API error | Connect in Settings; check Vercel logs; confirm Calendar API enabled |
| Consent screen error | Scopes not on OAuth consent screen | Add `calendar.events` and `calendar.readonly` to consent screen scopes |

## Booking

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| No slots shown | No availability / username wrong | Set weekly hours; confirm username on profile |
| Booking fails 500 | Migration not run | Run `supabase/migrations/001_initial.sql` in SQL Editor |
| Booking fails 409 | Slot taken between pick and submit | Expected — guest should pick another time |
| Cancel fails | Past booking | Cancellation only allowed before start time |

## Database / RLS

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Host can't see own data | Session not attached to Supabase client | Check server client cookie handling |
| Guest booking insert fails | Missing service role key | Set `SUPABASE_SERVICE_ROLE_KEY` on Vercel |
| Profile missing after signup | Trigger not created | Re-run migration (includes `handle_new_user` trigger) |

## Build

| Problem | Fix |
|---------|-----|
| `npm run build` fails locally | Run from repo root; `npm install` first |
| Type errors after schema change | Update `src/lib/supabase/types.ts` |

## Getting more detail

- Vercel → Project → Deployments → Function logs
- Supabase → Logs → Auth / Postgres
- Browser devtools → Network tab on failed auth redirect

## Related

- [development/setup.md](../development/setup.md) — full configuration checklist
- [architecture/auth.md](../architecture/auth.md) — OAuth flows and scopes
