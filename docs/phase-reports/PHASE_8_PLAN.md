# Phase 8 — Consultation

## Status

**Implementation complete.** Comprehensive verification is intentionally deferred to the final verification/hardening phase.

## Delivered

- Consultation request records with service type, subject, details, optional vehicle, consultant assignment, status, and scheduling time.
- Status lifecycle: REQUESTED, ACCEPTED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED.
- Requester-scoped creation.
- Assigned-consultant-only consultation management.
- Consultation-specific message records.
- Participant-scoped message RLS.
- Realtime consultation messaging.
- Consultation message timestamp trigger.
- Mobile consultation request screen.
- Mobile consultation history screen.
- Mobile consultation detail + messaging screen.
- Services hub integration.

## Security model

Requesters may create and read their own consultation records. An assigned consultant may read and update the consultation. Messages are readable/sent only by the requester or assigned consultant, with sender ownership enforced for updates. No client-side role metadata is used for authorization.

## Deferred / later enhancements

- Consultant assignment/admin workflow in the Admin phase.
- Appointment availability/calendar management.
- Native push notifications.
- Payment/consultation billing in the Payments phase.
- Attachments.
- Ratings/reviews after consultation completion.
- Comprehensive automated, runtime, security, and cross-platform verification.

## Exit criteria

The MVP human consultation request, status model, secure conversation, realtime messaging, mobile presentation, and documentation are implemented. Final system verification remains in the hardening phase.
