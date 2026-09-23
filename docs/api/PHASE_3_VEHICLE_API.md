# Phase 3 Vehicle API Contract

## Client service
The shared `@motoraconect/api` package owns vehicle data access. Mobile screens should call these functions rather than embedding database queries.

## Functions
- `listVehicles(client, filters)`: active marketplace search with pagination and optional full-text/structured filters.
- `getVehicle(client, id)`: fetch one listing subject to RLS.
- `listVehicleImages(client, vehicleId)`: fetch ordered image metadata subject to RLS.
- `createVehicle(client, input)`: derives `seller_id` from the authenticated session and creates a draft.
- `updateVehicle(client, id, input)`: updates an owner listing within the database RLS rules.
- `submitVehicle(client, id)`: changes a draft to `PENDING_REVIEW`.
- `deleteVehicle(client, id)`: deletes owner drafts/pending-review listings.
- `createVehicleImage(client, input)`: stores image metadata after a successful Storage upload.
- `createVehicleImageSignedUrl(client, path)`: obtains a temporary URL for private vehicle media.

## Error contract
All service functions return `{ data, error }`. Errors include a stable code, technical message, and user-facing message.

## Search filters
- text query `q`
- make/model/city
- minimum/maximum price
- minimum/maximum year
- status
- limit/offset pagination

The default marketplace query is restricted to `ACTIVE` listings by the database policy and service default.
