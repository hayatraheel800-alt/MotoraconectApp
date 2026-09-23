# Phase 3 Vehicle Schema

## Scope
Phase 3 introduces the first marketplace data model: vehicle listings and vehicle images.

## Tables
- `public.vehicles`: seller-owned listing records and searchable vehicle attributes.
- `public.vehicle_images`: ordered image metadata linked to a vehicle.
- Supabase Storage bucket `vehicle-images`: private image objects; the first path segment is the vehicle UUID.

## Listing lifecycle
- `DRAFT`: editable by the seller and not visible to other users.
- `PENDING_REVIEW`: seller-submitted listing awaiting moderation.
- `ACTIVE`: visible to authenticated marketplace users; sellers cannot self-promote a listing to this state.
- `RESERVED`, `SOLD`, `EXPIRED`, `REJECTED`, `SUSPENDED`: reserved for later marketplace/moderation workflows.

## Security
- Every vehicle has a required `seller_id` referencing `auth.users`.
- RLS is enabled on both tables.
- Sellers can only create/update/delete their own draft or pending-review listings.
- Active listings are readable by authenticated users.
- Vehicle images inherit access from the vehicle ownership/status rules.
- Storage uploads are limited to authenticated owners of draft/pending-review vehicles.
- Storage is private and limited to image MIME types with a 10 MiB object limit.

## Search
A generated `tsvector` combines title, make, model, variant, and description. A GIN index provides the first full-text-search foundation. Structured indexes cover status, make/model, year, price, city, and seller.

## Deliberate non-goals
- Auction bidding
- Payments
- VIN/vehicle-history verification
- AI inspection
- Public anonymous marketplace access
- Moderation dashboards

Those belong to later phases.
