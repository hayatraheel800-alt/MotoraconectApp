# Motoraconect

**BUY. SELL. VERIFY. IMPORT. UNDERSTAND.**

An international automotive platform: vehicle marketplace, auction-sheet intelligence,
import-cost estimation, guides, AI assistance, human consultation, and (in later phases)
dealer tools and a parts marketplace.

## Status

Phase 1 — Project Foundation. See `docs/phase-reports/PHASE_1_REPORT.md` for exactly
what exists today and what does not. See `docs/architecture/MOTORACONECT_PHASE0_ARCHITECTURE.md`
for the full system design.

**Nothing beyond the foundation (navigation shell, design system, Supabase client wiring)
has been built yet.** There is no live marketplace, auth flow, AI, or payments in this
codebase — those are later phases.

## Structure

```
apps/mobile      Expo + React Native + TypeScript + Expo Router (the customer-facing app)
apps/web         (not yet created — later phase)
apps/admin       (not yet created — Phase 12)
packages/types   Shared TypeScript types
packages/config  Shared constants (roles, statuses, currencies — reference only)
packages/ui      Shared design tokens
supabase/        Migrations and Edge Functions (empty until Phase 2)
docs/            Architecture docs and per-phase completion reports
```

## Getting started (mobile app)

Requires Node 18+, npm, and the Expo CLI (`npx expo`).

```bash
npm install
cp apps/mobile/.env.example apps/mobile/.env
# fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
# (create a free project at https://supabase.com if you don't have one yet)
npm run mobile
```

This code was written in a sandbox with no network access, so `npm install` and
`expo start` could not be run or verified here. Run the two commands above locally
before treating Phase 1 as done — see Known Issues in the Phase 1 report.

## Contributing / working on this repo

Read `docs/architecture/MOTORACONECT_PHASE0_ARCHITECTURE.md` before adding anything.
Do not add marketplace, payment, or AI logic until the corresponding phase begins —
see the roadmap in that document.
