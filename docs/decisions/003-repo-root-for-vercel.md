# ADR 003: App at Repo Root for Vercel

**Status:** Accepted  
**Date:** 2026-08

## Context

The Next.js app initially lived in a `web/` subdirectory. Vercel deployed the repo root, which had no app — resulting in 404 on all routes.

## Decision

Move the entire Next.js application to the **repository root**. Vercel Root Directory setting remains empty.

## Consequences

**Positive**

- Default Vercel Next.js detection works
- Simpler paths for Cloud Agent and documentation

**Negative**

- None significant; monorepo structure deferred until needed

## Related

- [operations/troubleshooting.md](../operations/troubleshooting.md) — 404 fix
