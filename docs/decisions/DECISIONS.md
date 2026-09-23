# MOTORACONECT — DECISIONS

Last updated: 2026-09-23

## Confirmed

| Decision | Current value |
|---|---|
| GitHub repository | hayatraheel800-alt/MotoraconectApp |
| Supabase project | kaxkzmrlaavgweqsfman |
| Railway project | Motoraconnect app |
| Mobile stack | Expo + React Native + TypeScript + Expo Router |
| Database | Supabase Postgres |
| Authorization | Supabase RLS + separate roles |
| Development method | Phased implementation with verification and incremental commits |
| Authentication | Supabase Auth remains the primary identity system; Google Sign-In is integrated through Supabase Auth |

## Still unresolved

1. AI provider and budget.
2. Payment provider(s).
3. Legal entity/jurisdiction.
4. Exchange-rate data source.
5. OCR/vision approach.
6. Initial launch countries.
7. Production domain and deployment topology.
8. Open-source/proprietary license.
9. Google OAuth client configuration in Google Cloud/Supabase Auth Providers.

## Authentication note

The Firebase project `motoraconnectapp` is not the primary authentication system for Motoraconect. The selected architecture is Supabase Auth + Google Sign-In. A Firebase project ID entered under Supabase Third-Party Auth configures Firebase Auth as an additional third-party authentication path; it is not the same thing as enabling Google as a Supabase Auth provider. For the selected architecture, Google OAuth credentials should be configured under Supabase Authentication → Providers → Google. Do not put Google client secrets or Firebase service credentials in the mobile app.

## Rule

Do not silently convert an assumption into a decision. Record material decisions with date, reason, and affected phase.