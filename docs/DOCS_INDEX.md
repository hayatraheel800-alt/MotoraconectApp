# MOTORACONECT — DOCUMENTATION INDEX

Use this page as the first stop when deciding which document to read.

## Core references

| Document | Purpose |
|---|---|
| docs/MASTER_PLAN.md | Current roadmap, phase gates, workflow |
| docs/architecture/MOTORACONECT_PHASE0_ARCHITECTURE.md | Original architecture/planning source |
| docs/architecture/CURRENT_ARCHITECTURE.md | Living implementation snapshot |
| docs/decisions/DECISIONS.md | Decisions, assumptions, unresolved choices |
| docs/phase-reports/PHASE_1_REPORT.md | Phase 1 source/status |
| docs/phase-reports/PHASE_2_STATUS.md | Phase 2 verification record |
| docs/phase-reports/PHASE_3_STATUS.md | Current Phase 3 status |
| docs/database/PHASE_3_VEHICLE_SCHEMA.md | Vehicle schema, lifecycle, search, storage |
| docs/api/PHASE_3_VEHICLE_API.md | Shared vehicle service contract |
| docs/security/PHASE_3_VEHICLE_RLS.md | Vehicle and Storage authorization matrix |

## Planned reference areas

- docs/database/ — schema, RLS, generated database type notes.
- docs/api/ — service contracts and API behavior.
- docs/security/ — threat model, secrets, storage, auth and authorization.
- docs/runbooks/ — local setup, migrations, deployment, rollback, incident procedures.
- docs/testing/ — test strategy and verification evidence.
- docs/product/ — product/domain requirements.

## Rules

1. Phase 0 is the historical architecture source.
2. CURRENT_ARCHITECTURE records what is actually implemented.
3. MASTER_PLAN controls phase sequencing and completion gates.
4. DECISIONS records material choices.
5. Phase reports record evidence, not assumptions.
6. Never put secrets or credentials in documentation.
7. Update stale docs in the same milestone as the code change.

## Future high-value docs

Before Phase 4: auction report schema, AI interface contract, confidence/provenance rules, test fixtures.

Before Phase 7: messaging model, notification rules, abuse/rate-limit policy.

Before Phase 11: payment provider decision, legal/compliance requirements, money/currency model, payment state machine.

Before Phase 14: security threat model, privacy/compliance docs, production runbooks, full test matrix.
