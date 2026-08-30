# Design System — Option 1 + Option 3

Meetly marketing and app chrome use **Option 1** (clean SaaS: white, indigo primary, soft shadows) with **Option 3** touches (warm gradient hero, sky/orange accent hints, rounded-full buttons).

## Colors

Defined in `src/app/globals.css`:

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#4F46E5` | Primary CTA, links, focus rings |
| `--primary-dark` | `#4338CA` | Hover states |
| `--primary-light` | `#EEF2FF` | Soft backgrounds, badges |
| `--accent` | `#0EA5E9` | Gradient accents (Option 3) |
| `--accent-warm` | `#F97316` | Warm gradient hint (Option 3) |
| `--navy` | `#0F172A` | Dark sections, text |
| `--surface` | `#F8FAFC` | Page backgrounds |
| `--muted` | `#64748B` | Secondary text |

Legacy lime tokens remain for dashboard accents until fully migrated.

## Typography

- **Font:** Geist Sans
- **Marketing headings:** `section-heading` utility — bold, tight tracking
- **Body:** slate/navy on white; muted secondary text

## Components (utility classes)

| Class | Purpose |
|-------|---------|
| `.btn-primary` | Indigo pill CTA |
| `.btn-secondary` | White outline pill button |
| `.btn-oauth` | OAuth provider buttons |
| `.marketing-gradient` | Hero background mesh |
| `.card` | White panel with border |

## Marketing layout

- Sticky blurred nav
- `max-w-7xl` sections with generous vertical rhythm
- Unsplash imagery via `next/image`
- Inline hero signup (`HeroAuthPanel`)

## Related

- [product/overview.md](../product/overview.md)
