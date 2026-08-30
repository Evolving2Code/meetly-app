# Development Workflow

Meetly is built for **cloud-first development** — especially from mobile via Cursor Cloud and the Vercel PWA.

## Daily loop

```
Edit in Cursor → push branch → Vercel preview deploy → test on phone → merge → production
```

No local database. No SQLite. Preview URLs exercise the same Supabase project as production (or a dedicated staging project if you add one later).

## Branch naming

Cloud Agent branches use:

```
cursor/<descriptive-name>-f16c
```

Examples: `cursor/mobile-first-ui-f16c`, `cursor/project-docs-f16c`

## Pull requests

1. Push branch: `git push -u origin cursor/your-branch-f16c`
2. Open PR against `main` (draft is fine while iterating)
3. Test the Vercel preview URL on your phone
4. Merge when green

## Vercel previews

Every PR gets a preview deployment. Use it to verify:

- Auth redirects (add `https://*.vercel.app/**` in Supabase redirect URLs)
- Mobile layout (bottom nav, booking flow, touch targets)
- API routes

## Environment variables

Set on Vercel for **Production** and **Preview**. Preview deploys need the same Supabase/Google credentials unless you maintain separate projects.

See [setup.md](./setup.md).

## Schema changes

1. Add SQL to `supabase/migrations/` (numbered file)
2. Run manually in Supabase SQL Editor
3. Update `src/lib/supabase/types.ts` if columns changed
4. Document in [architecture/database.md](../architecture/database.md)

## Before merging auth or infra changes

- [ ] `npm run build` passes
- [ ] Test signup, login, and (if touched) Calendar connect on preview URL
- [ ] Update docs if behavior changed

## Related

- [local-dev.md](./local-dev.md) — optional local `npm run dev`
- [product/roadmap.md](../product/roadmap.md) — phase checklist
