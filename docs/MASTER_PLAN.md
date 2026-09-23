# MOTORACONECT — MASTER DEVELOPMENT PLAN

Last updated: 2026-09-23
Current phase: Phase 3 — Vehicle Marketplace
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
| 2 | Auth, profiles, roles, RLS | Complete — CI/database verification scope |
| 3 | Vehicle marketplace | **In progress** |
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

## Phase 2 completion evidence

- GitHub Actions CI/typecheck passed on commit `e69138e426b8d01f2fc79ab54762b3a33dbfb58d`.
- Supabase Phase 2 tables are present with RLS enabled.
- Profile ownership policies, role read policy, own-role policy, signup trigger, and default USER role seed were read back from the connected project.
- The existing unrelated `public.rls_auto_enable()` security-definer advisor warning remains documented and was not changed.

A live device signup/email-verification/session acceptance test is still a manual runtime check; it is not claimed as automated evidence.

## Phase 3 completion gates

- Vehicle schema and RLS applied and verified.
- Private vehicle image storage and policies applied and verified.
- Shared vehicle API typechecks.
- Create/edit draft flow works at runtime.
- Vehicle listing/detail/search works at runtime.
- Photo upload and signed image display work.
- Submit-for-review flow works.
- Seller listing management is complete.
- RLS tests run with authenticated fixtures.
- Phase 3 report contains actual verification evidence.
- README/docs updated and all Phase 3 work committed.

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
