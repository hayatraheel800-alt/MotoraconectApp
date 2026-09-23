# Phase 12 — Admin & Analytics

## Status

**Implementation complete.** Comprehensive verification is intentionally deferred to the final verification/hardening phase.

## Delivered

- Separate `apps/admin` Next.js application.
- Supabase SSR auth using cookies and signed JWT claims.
- Admin login surface using the existing Supabase Auth system.
- Admin role gate based on `user_roles` + `roles` data.
- Private `is_admin()` authorization helper.
- Admin-only moderation access to all vehicle records.
- Admin-only vehicle status moderation from PENDING_REVIEW to ACTIVE, REJECTED, or SUSPENDED.
- Admin-only visibility into consultation workload.
- Admin operational metrics for users, active listings, pending listings, and open consultations.
- `admin_actions` and `audit_logs` tables.
- Audit records for vehicle moderation actions.
- Consultation and vehicle admin RLS policies.
- Session-refresh Proxy for the admin app.
- Root workspace scripts for admin development/build/typecheck.

## Security model

The admin client never receives a service-role key. Authorization is enforced in Supabase RLS and repeated in the admin server action. Admin role membership is stored in the database rather than trusted from browser metadata.

## Deferred / later enhancements

- Consultant assignment workflow and scheduling operations.
- Rich analytics dashboards and charts.
- User reports/review moderation screens.
- Bulk moderation.
- Native audit log search/export.
- Comprehensive automated, runtime, security, and cross-platform verification.

## Exit criteria

The MVP admin surface, role boundary, moderation flow, audit foundation, consultation visibility, and operational metrics are implemented. Final verification remains in the hardening phase.
