# MOTORACONECT — CURRENT ARCHITECTURE SNAPSHOT

Last updated: 2026-09-23

This is the living implementation snapshot. For the original planned architecture, see MOTORACONECT_PHASE0_ARCHITECTURE.md.

## Implemented

- Expo/React Native mobile app and shared packages.
- Shared types/config/UI tokens.
- Expo Router navigation shell.
- Supabase client wiring with secure mobile session storage.
- Supabase project: kaxkzmrlaavgweqsfman.
- Phase 2 identity tables: profiles, roles, user_roles.
- RLS enabled on Phase 2 identity tables.
- Signup trigger creates profile and default USER role.
- Mobile signup/login/sign-out integration.

## Not yet implemented

- Vehicle marketplace.
- Web app.
- Admin app.
- packages/api typed service layer.
- AI providers/real AI calls.
- Payments.
- Messaging/notifications.
- Production deployment topology.
- Full automated test suite.

## Invariants

- Supabase Postgres is the source of truth.
- RLS is the authorization boundary.
- Secrets/service-role credentials stay server-side.
- Privileged operations belong in Edge Functions/server-side code.
- User roles are separate from profile data.
- Database migrations are version-controlled.

## Key terminology

The Phase 0 source refers to the legacy Supabase anon client key. Current Supabase documentation is moving toward publishable keys for client applications and secret keys for server-side use. Follow the current Supabase project configuration when the environment is finalized; never place a secret key in the mobile app.