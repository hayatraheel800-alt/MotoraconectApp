# Phase 9 — Parts

## Status

**Implementation complete.** Comprehensive verification is intentionally deferred to the final verification/hardening phase.

## Delivered

- `parts` marketplace table with seller ownership.
- Part conditions: NEW, USED, REFURBISHED, OEM, AFTERMARKET.
- Part status lifecycle with draft/review/active/sold-out/rejected/suspended states.
- `part_images` metadata table.
- Private `part-images` Storage bucket.
- Seller-scoped upload/delete policy for part images.
- Buyer read access to images only for ACTIVE parts.
- Seller-owned draft creation/edit/delete rules.
- Mobile Parts Marketplace browse/search screen.
- Mobile Sell a Part screen.
- Optional part photo upload.
- Submit-for-review workflow.
- Admin moderation policies for Parts.
- Search index for title, part number, make, and model.

## Security model

Sellers can create and manage their own drafts but cannot publish directly to ACTIVE. Buyers only see ACTIVE parts. Part images are private at the bucket level and are readable by owners or when the related part is ACTIVE.

## Deferred / later enhancements

- Part detail page with full image gallery.
- Buyer-to-part seller messaging context.
- Stock reservation/order workflow.
- Shipping and fulfillment.
- Rich part taxonomy and compatibility fitment.
- Admin UI for dedicated parts moderation queue.
- Comprehensive automated, runtime, security, and cross-platform verification.

## Exit criteria

The MVP Parts marketplace data model, RLS/storage security, seller creation flow, buyer browse/search flow, photo upload, and review submission are implemented. Final verification remains in the hardening phase.
