# Phase 14 — Hardening, Security, Performance & Full Verification

## Status

**In progress.**

Full verification is active. Phase 15 production launch will not be marked complete until the verification gates below are supported by evidence.

## Completed hardening work

- Corrected npm workspace dependency specifiers so the repository installs with npm.
- Normalized malformed literal \n characters in shared TypeScript exports.
- Pinned the web/admin Next.js stack to current published versions.
- Pinned web/admin Supabase packages to current published versions.
- Updated CI to Node 24 because current Supabase JS no longer supports Node 20.
- Revoked EXECUTE for the exposed public.rls_auto_enable() security-definer RPC.
- Confirmed every public application table currently has RLS enabled.
- Added foreign-key indexes for the main new domain tables.
- Optimized auction report RLS policies to cache auth.uid() per policy evaluation.
- Confirmed main Storage buckets are private.
- Expanded CI to run TypeScript checks plus web/admin production builds.

## Verification findings

### CI

Earlier runs failed at:
1. npm install because of workspace:*.
2. TypeScript parsing because packages/types/src/index.ts contained literal \n characters.
3. Third-party type incompatibilities exposed by the older TypeScript/web toolchain.

Those issues have been patched. The latest verification run must still complete successfully before CI is considered green.

### Supabase security

The database security advisor no longer reports the exposed SECURITY DEFINER RPC. One remaining warning is that pgtap is installed in the public schema.

Reference: https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public

The pgtap warning is a test-infrastructure issue, not an application table authorization finding.

### Supabase performance

The database advisor reports remaining optimization notices, including multiple permissive policies and unused indexes. These are being treated as optimization work rather than evidence of an authorization bypass. Foreign-key indexes and the auction RLS init-plan warnings have already been addressed.

## Release gates still open

- Latest CI run must pass typecheck, web build, and admin build.
- Mobile runtime verification on an actual Expo target.
- Browser verification of web/admin routes.
- Comprehensive RLS/storage behavior tests across the major domains.
- Production environment variables and deployment configuration review.
- Final security/performance review.
- Real AI and payment providers remain intentionally disabled until separately configured.

## Current launch posture

The codebase is **not yet marked production-ready**. Phase 15 will only be advanced after the Phase 14 gates are evidenced.
