# Phase 4 — Auction Sheet Reader

## Status

**In progress.** Comprehensive verification is intentionally deferred to the final verification phase.

## Scope

- Private auction-sheet uploads in Supabase Storage.
- Auction report request and result persistence.
- Interface-first auction analysis.
- Mock analyzer until a real OCR/vision provider is approved and configured.
- Structured report fields with source classification and confidence.
- Mobile upload entry point and report detail screen.

## Source labels

Every report item uses one of:

- DETECTED
- INTERPRETED
- USER_PROVIDED
- ESTIMATED
- UNVERIFIED

Confidence is one of:

- HIGH
- MEDIUM
- LOW

## Current implementation

- `auction_reports` and `auction_report_items` tables are present.
- `auction-sheets` is a private Storage bucket with owner-scoped policies.
- `MockAuctionSheetAnalyzer` returns a visible `MOCKED FOR DEVELOPMENT` marker.
- Mobile upload flow creates a report, uploads the private document, runs the mock analyzer, persists structured items, and opens the report.
- Report detail presents source and confidence metadata.

## Deferred work

- Real OCR/vision provider selection and credentials.
- PDF/document picker support beyond image selection.
- Background/asynchronous analysis for production-scale workloads.
- Comprehensive automated, runtime, security, and cross-platform verification.

## Exit criteria

Phase 4 implementation is complete when the planned upload/report flow, provider interface, storage rules, shared types, and mobile presentation are implemented and documented. Final verification happens in the roadmap's final verification phase.
