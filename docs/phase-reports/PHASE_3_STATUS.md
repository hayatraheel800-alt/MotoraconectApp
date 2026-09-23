# MOTORACONECT — PHASE 3 STATUS

Phase: Vehicle Marketplace
Status: In progress
Last updated: 2026-09-23

## Completed in this milestone

- Vehicle and vehicle-image database schema applied to Supabase.
- RLS and ownership rules applied.
- Private `vehicle-images` Storage bucket created with MIME/size restrictions.
- Full-text search foundation and structured indexes added.
- Shared generated Supabase database types added.
- Shared vehicle API/service package added.
- Mobile vehicle listing/search screen added.
- Mobile vehicle detail screen added.
- Mobile create-draft flow added.
- Mobile edit-draft flow added.
- Vehicle RLS test file added for pgTAP execution.
- Supabase Auth Google OAuth client flow added to the mobile login screen.
- Expo deep-link/browser support added for the native OAuth callback.
- Vehicle photo picker added with multi-select support, client-side MIME/size validation, and private Storage upload.
- Signed vehicle image display added to the listing detail screen using time-limited Supabase Storage signed URLs.
- Vehicle image upload service now stores objects under the vehicle UUID and creates the corresponding `vehicle_images` record.
- Photo upload is available from the vehicle draft editor.

## Verification

- Supabase tables, RLS state, bucket configuration, and Storage policies were read back after migration.
- GitHub Actions typecheck passed after the mobile client typing fix.
- API/shared-types packages have now been added to the root typecheck workflow.

## Remaining Phase 3 work

- CI/typecheck verification for the photo upload and signed-image milestone is pending completion of the current GitHub Actions runs.
- Real device/emulator runtime verification.
- Photo picker/upload UI and signed-image display.
- Guided multi-step listing flow.
- Filter UI beyond text search.
- Seller "My Listings" management.
- Submit-for-review UI and moderation handoff.
- More complete automated RLS fixtures with authenticated test users.
- Product/UX refinement and loading/error/empty states.
- Final Phase 3 documentation and completion gate.

## Commit policy

Continue with small logical commits after each verified milestone.
