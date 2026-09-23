# Motoraconect

**BUY. SELL. VERIFY. IMPORT. UNDERSTAND.**

Motoraconect is an international automotive platform planned around vehicle marketplace features, auction-sheet intelligence, import-cost estimation, guides, AI assistance, human consultation, and later dealer/parts/commerce capabilities.

## Current status

**Phase 2 — Auth + Profiles + Roles: IN PROGRESS**

- Phase 0 architecture is preserved in docs/architecture/MOTORACONECT_PHASE0_ARCHITECTURE.md.
- Phase 1 foundation code is in the repository.
- Phase 2 Supabase identity tables, RLS foundations, signup trigger, role seed data, and mobile auth integration have been started.
- Runtime verification is still required before Phase 2 can be marked complete.
- Work is committed incrementally after meaningful changes.

## Project infrastructure

| Resource | Current setup |
|---|---|
| GitHub | hayatraheel800-alt/MotoraconectApp |
| Supabase | kaxkzmrlaavgweqsfman |
| Railway | Motoraconnect app |
| Mobile | Expo + React Native + TypeScript + Expo Router |
| Database | Supabase Postgres + RLS |
| Web/Admin | Planned for later phases |

## Repository structure

```
apps/mobile      Expo + React Native customer app
apps/web         Planned later
apps/admin       Planned later
packages/types   Shared TypeScript types
packages/config  Shared constants and feature flags
packages/ui      Shared design tokens/components
supabase/        Version-controlled database migrations/functions
docs/            Architecture, plans, decisions, and phase reports
.github/         CI and repository automation
```

## Documentation

Start with docs/MASTER_PLAN.md for the current roadmap and working rules.

Use docs/DOCS_INDEX.md to find the correct reference document for architecture, database, security, deployment, decisions, and phase status.

- docs/architecture/MOTORACONECT_PHASE0_ARCHITECTURE.md — original Phase 0 architecture source.
- docs/phase-reports/PHASE_1_REPORT.md — Phase 1 source/status report.
- docs/phase-reports/PHASE_2_STATUS.md — current Phase 2 implementation status.
- docs/architecture/CURRENT_ARCHITECTURE.md — living architecture snapshot.
- docs/decisions/DECISIONS.md — decisions, assumptions, and unresolved choices.

## Getting started

Requires Node 18+, npm, and Expo.

```bash
npm install
cp apps/mobile/.env.example apps/mobile/.env
# Set the Supabase URL and client-side key in your local environment.
npm run mobile
```

Never commit .env files or Supabase secret/service-role credentials.

## Development workflow

plan → implement one logical piece → verify → commit → update docs → continue

Do not skip phases. Do not build future-domain functionality early unless the architecture explicitly requires a prerequisite.

## Security rules

- Supabase RLS is an authorization boundary.
- No secret/service-role key in client bundles.
- Privileged operations belong in Edge Functions/server-side code.
- User roles are stored separately from profiles.
- New user-writable tables must enable RLS in the same migration.
- Secrets must never be committed.

## License

License has not yet been selected. Do not assume an open-source license until a decision is recorded.