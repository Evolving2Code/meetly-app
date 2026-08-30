# Changelog

All notable changes to Meetly. Format loosely based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- Phase 6 hardening: guest booking response normalization, username validation, double-booking DB index, hardening checklist
- Project documentation spine under `docs/` (product, architecture, development, API, operations, decisions, design)

## [0.1.0] — 2026-08

### Added

- **Auth overhaul:** Calendly-style email signup/login + Google login (basic scopes); Google Calendar as optional Settings integration
- **Mobile-first UI:** Bottom nav dashboard, sticky top bar, safe-area padding, larger touch targets, Web Share API for booking links
- **Supabase migration:** Postgres schema, RLS, Supabase Auth; removed Prisma, SQLite, NextAuth
- **Core MVP:** Event types, availability, guest booking flow, buffers/min notice/max days ahead, timezone support, cancellation, host dashboard
- **Option 5 branding:** Navy + lime design system
- Vercel deployment from repo root (404 fix)

[Unreleased]: https://github.com/Evolving2Code/meetly-app/compare/main...HEAD
[0.1.0]: https://github.com/Evolving2Code/meetly-app/releases/tag/v0.1.0
