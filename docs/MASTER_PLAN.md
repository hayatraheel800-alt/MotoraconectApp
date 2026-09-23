# MOTORACONECT — MASTER DEVELOPMENT PLAN

Last updated: 2026-09-23
Current phase: Phase 2 — Auth + Profiles + Roles
Status: In progress

## Workflow

1. Read relevant reference docs.
2. Implement one logical piece.
3. Verify it.
4. Commit it.
5. Update documentation.
6. Record blockers or assumptions.
7. Continue.

Never claim runtime, CI, or deployment success without evidence.

## Phase roadmap

| Phase | Scope | Status |
|---|---|---|
| 0 | Architecture & planning | Complete |
| 1 | Foundation | Code uploaded; runtime verification required |
| 2 | Auth, profiles, roles, RLS | **In progress** |
| 3 | Vehicle marketplace | Planned |
| 4 | Auction-sheet reader | Planned |
| 5 | Import calculator + guides | Planned |
| 6 | Ask Motoraconect AI | Planned |
| 7 | Messaging + notifications | Planned |
| 8 | Human consultation | Planned |
| 9 | Parts marketplace | Planned |
| 10 | Dealer platform | Planned |
| 11 | Payments + monetization | Planned |
| 12 | Admin dashboard + analytics | Planned |
| 13 | Internationalization | Planned |
| 14 | Security/performance/full testing/compliance | Planned |
| 15 | Production launch/app-store preparation | Planned |

No later phase is considered started merely because its folders or documentation exist.

## Phase 2 completion gates

- Signup, login, email verification, sign-out verified.
- Profile and default USER role are created automatically.
- Positive and negative RLS tests pass.
- Mobile session persistence works.
- Local app boot and typecheck pass.
- Phase 2 report contains actual verification evidence.
- All Phase 2 work is committed.

## Future docs

Create/update these before substantial work in each domain:
- docs/architecture/
- docs/decisions/
- docs/phase-reports/
- docs/database/
- docs/api/
- docs/security/
- docs/runbooks/
- docs/testing/
- docs/product/

## Unresolved decisions

AI provider, payment provider(s), legal entity/jurisdiction, exchange-rate source, OCR/vision approach, launch countries, production domain/deployment topology, and licensing must be explicitly decided and recorded rather than silently assumed.

## Definition of done

**code + database + tests + runtime verification + documentation + Git commit** must match the phase scope.