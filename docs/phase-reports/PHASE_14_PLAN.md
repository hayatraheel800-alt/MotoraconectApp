# Phase 14 — Hardening, Security, Performance & Full Verification

## Status

**In progress.**

Phase 14 is the final verification gate before Phase 15 production launch.

## Completed hardening work

- Corrected npm workspace dependency specifiers.
- Normalized malformed literal \\n characters in shared TypeScript exports.
- Pinned the web/admin Next.js stack and Supabase packages.
- Updated CI to Node 24.
- Revoked EXECUTE for the exposed `public.rls_auto_enable()` security-definer RPC.
- Confirmed all public application tables have RLS enabled.
- Added foreign-key indexes for the main new domain tables.
- Optimized auction report RLS policies to cache `auth.uid()` per policy evaluation.
- Confirmed main Storage buckets are private.
- Expanded CI to typecheck plus web/admin production builds.
- Hardened identity, consultation, parts, dealers, and mock payment authorization rules.

## Verified gates

### GitHub CI

Latest run for commit `d23333f191c47863124355501206b9fae563d6b7` completed with **success**. The CI workflow now covers installation, TypeScript checks, web build, and admin build.

### Vercel

The existing Vercel project has a **READY production deployment** for commit `d23333f191c47863124355501206b9fae563d6b7`.

Important architecture finding: that Vercel project is the **admin application** rooted at `apps/admin`. The repository also contains the public application at `apps/web`, but a separate public-web Vercel project has not yet been provisioned.

### Supabase security

The database security advisor currently reports no security lints. Earlier findings were remediated by revoking execution of the exposed application SECURITY DEFINER RPC and moving pgTAP out of the public schema into the `extensions` schema.

### Supabase performance

Remaining advisor notices include multiple permissive policies and unused indexes. These are optimization findings rather than authorization-bypass findings. Foreign-key indexes and auction RLS init-plan warnings have already been addressed.

## Release gates still open

- [ ] Provision/deploy the public web application separately from admin.
- [ ] Verify production environment variables for web and admin.
- [ ] Browser verification of public web and admin routes.
- [ ] Mobile runtime verification on an Expo target.
- [ ] Comprehensive RLS/storage behavior tests across major domains.
- [ ] Final security/performance review.
- [ ] Production operational configuration and rollback review.
- [ ] Real AI/payment providers remain intentionally disabled until separately configured.

## Current launch posture

The codebase is **not yet marked production-ready**. Phase 15 can begin only after the open release gates are evidenced.
