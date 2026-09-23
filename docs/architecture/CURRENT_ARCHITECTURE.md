# MOTORACONECT — CURRENT ARCHITECTURE SNAPSHOT

Last updated: 2026-09-23

This is the living implementation snapshot. For the original planned architecture, see MOTORACONECT_PHASE0_ARCHITECTURE.md.

## Implemented

- Expo/React Native mobile app and shared packages.
- Shared types/config/UI tokens.
- Expo Router navigation shell.
- Supabase client wiring with secure mobile session storage.
- Supabase project: kaxkzmrlaavgweqsfman.
- Phase 2 identity tables and RLS.
- Mobile signup/login/sign-out integration.
- Phase 3 vehicle and vehicle_images tables with RLS.
- Phase 3 private vehicle-images Storage bucket and policies.
- Generated Supabase database types.
- packages/api shared vehicle service layer.
- Mobile vehicle listing, detail, create/edit draft, guided listing, filters, My Listings, seller draft management, submit-for-review, photo upload, and signed-image flows.
- Authenticated RLS fixture test source.

## Pending verification

- Full pgTAP execution in the project test environment.
- Real Expo emulator/device runtime verification.
- Production Google OAuth URL/deep-link configuration.
- Web app and admin app.
- Production deployment topology.

## Invariants

- Supabase Postgres is the source of truth.
- RLS is the authorization boundary.
- Secrets/service-role credentials stay server-side.
- Privileged operations belong in Edge Functions/server-side code.
- User roles are separate from profile data.
- Database migrations are version-controlled.
- Private Storage is the default for user-uploaded marketplace media.
