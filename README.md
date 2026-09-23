# Motoraconect

**BUY. SELL. VERIFY. IMPORT. UNDERSTAND.**

Motoraconect is an international automotive platform planned around vehicle marketplace features, auction-sheet intelligence, import-cost estimation, guides, AI assistance, human consultation, and later dealer/parts/commerce capabilities.

## Current status

**Phase 3 — Vehicle Marketplace: IN PROGRESS**

- Phase 0 architecture is preserved in `docs/architecture/MOTORACONECT_PHASE0_ARCHITECTURE.md`.
- Phase 1 foundation is in the repository.
- Phase 2 identity, profiles, roles, RLS, and mobile auth integration are implemented and its CI/database verification scope is complete.
- Phase 3 now has the vehicle schema, ownership RLS, private image storage, shared API layer, search foundation, listing/detail screens, create/edit draft flow, and the initial Supabase Auth Google OAuth flow.
- Runtime/device acceptance and the remaining marketplace workflow are still required before Phase 3 is marked complete.
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
| Authentication | Supabase Auth + Google Sign-In |

## Repository structure

```
apps/mobile      Expo + React Native customer app
apps/web         Planned later
apps/admin       Planned later
packages/api     Shared typed data/service layer
packages/types   Shared TypeScript/database types
packages/config  Shared constants and feature flags
packages/ui      Shared design tokens/components
supabase/        Version-controlled database migrations/tests
docs/            Architecture, plans, database, API, security, and phase reports
.github/         CI and repository automation
```

## Documentation

Start with `docs/MASTER_PLAN.md` for the current roadmap and working rules.

Use `docs/DOCS_INDEX.md` to find the correct reference document for architecture, database, security, deployment, decisions, and phase status.

- `docs/architecture/MOTORACONECT_PHASE0_ARCHITECTURE.md` — original Phase 0 architecture source.
- `docs/phase-reports/PHASE_1_REPORT.md` — Phase 1 source/status report.
- `docs/phase-reports/PHASE_2_STATUS.md` — Phase 2 verification record.
- `docs/phase-reports/PHASE_3_STATUS.md` — current Phase 3 implementation status.
- `docs/database/PHASE_3_VEHICLE_SCHEMA.md` — vehicle schema and storage architecture.
- `docs/api/PHASE_3_VEHICLE_API.md` — shared vehicle service contract.
- `docs/security/PHASE_3_VEHICLE_RLS.md` — vehicle/storage authorization matrix.
- `docs/architecture/CURRENT_ARCHITECTURE.md` — living architecture snapshot.
- `docs/decisions/DECISIONS.md` — decisions, assumptions, and unresolved choices.

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
- New Storage buckets must have explicit access policies and remain private unless a documented product requirement makes them public.
- Secrets must never be committed.

## License

License has not yet been selected. Do not assume an open-source license until a decision is recorded.
