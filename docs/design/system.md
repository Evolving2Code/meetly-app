# Design System — Option 5

Meetly uses **Option 5** branding: navy + lime, bold typography, high contrast, mobile-first touch targets.

## Colors

Defined in `src/app/globals.css`:

| Token | Hex | Usage |
|-------|-----|-------|
| `--navy` | `#0F172A` | Primary dark, sidebar, landing background |
| `--navy-light` | `#1E293B` | Cards on dark backgrounds |
| `--lime` | `#84CC16` | Primary CTA, accents, badges |
| `--lime-dark` | `#65A30D` | Hover states, link emphasis |
| `--surface` | `#F8FAFC` | Page background (dashboard) |
| `--muted` | `#64748B` | Secondary text |
| `--border` | `#E2E8F0` | Borders, dividers |

Tailwind classes: `bg-navy`, `text-lime`, `bg-lime`, `text-lime-dark`, etc.

## Typography

- **Font:** Geist Sans (via `next/font`), system-ui fallback
- **Headings:** `font-black` or `font-bold`, tight tracking on hero
- **Labels:** `text-sm font-medium`

## Components (utility classes)

| Class | Purpose |
|-------|---------|
| `.btn-primary` | Lime CTA, min height 44px |
| `.btn-secondary` | White/outline button |
| `.card` | White rounded panel with border |
| `.input` | Form fields, lime focus ring |
| `.label` | Form labels |
| `.badge-lime` | Lime tinted pill badge |
| `.badge-navy` | Navy pill badge |

## Layout patterns

### Landing (`/`)

- Full-width navy hero
- Split layout on `lg+`: copy left, dashboard preview right
- CTAs: primary lime "Get started", secondary "Sign in"

### Auth (`/signup`, `/login`)

- `AuthShell` centered card
- Email form first, divider "or", Google button below
- Copy clarifies Calendar is connected later in Settings

### Host dashboard

- **Desktop (`lg+`):** Fixed navy sidebar + white content area
- **Mobile:** Sticky top bar + bottom nav (Home, Events, Hours, Settings)
- Safe area padding for notched phones: `env(safe-area-inset-bottom)`

### Guest booking (`/book/...`)

- Stacked mobile-first flow: date → time → details → confirmation
- Large touch targets on slot buttons

## Mobile conventions

- Minimum interactive height: **44px** (`min-h-[44px]` on buttons)
- Bottom navigation on dashboard (hidden on `lg+`)
- Web Share API for copying booking links (`CopyLinkButton`)

## Logo mark

Square lime tile with navy "M" — used in header and sidebar.

## Related

- [product/overview.md](../product/overview.md) — user-facing feature context
