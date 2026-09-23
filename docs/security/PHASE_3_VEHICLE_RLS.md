# Phase 3 Vehicle Security / RLS Matrix

| Resource | Read | Create | Update | Delete |
|---|---|---|---|---|
| vehicles | Owner sees own; authenticated users see ACTIVE | Owner only; DRAFT/PENDING_REVIEW | Owner only; result must remain DRAFT/PENDING_REVIEW | Owner only; DRAFT/PENDING_REVIEW |
| vehicle_images | Owner sees own; authenticated users see images for ACTIVE vehicles | Owner of DRAFT/PENDING_REVIEW vehicle | Storage owner; metadata remains tied to owner vehicle | Storage owner / vehicle owner |

## Storage
Bucket: `vehicle-images`

- Private bucket.
- First path segment must be the vehicle UUID.
- Uploads require authenticated ownership of a DRAFT/PENDING_REVIEW vehicle.
- Maximum object size: 10 MiB.
- MIME types: JPEG, PNG, WebP, HEIC.

## Authorization invariants
1. `seller_id` comes from `auth.uid()` in the service layer and is enforced again by RLS.
2. Sellers cannot self-promote a listing to `ACTIVE`.
3. Public/anonymous marketplace access is intentionally not enabled in Phase 3.
4. Service-role credentials are not used by the mobile client.
5. Storage access is governed by Storage RLS rather than a public bucket.
