# Phase 7 — Messaging & Notifications

## Status

**Implementation complete.** Comprehensive verification is intentionally deferred to the final verification/hardening phase.

## Delivered

- `conversations` table with optional vehicle context.
- `conversation_participants` table with unique membership.
- `messages` table with sender ownership and 1–4000 character message constraint.
- `notifications` table with recipient ownership and read state.
- RLS policies restricting conversations/messages to participants and notifications to recipients.
- Conversation creation by authenticated users.
- Buyer-to-seller conversation entry from vehicle detail.
- Mobile message center.
- Mobile conversation detail screen.
- Supabase Realtime subscription for new messages.
- Database trigger that creates in-app notification records for other conversation participants.
- Database trigger that refreshes conversation `updated_at`.
- Message and notification tables added to `supabase_realtime`.

## Security model

A user can only send/read messages in a conversation where they have a participant row. Participant reads are restricted to the user's own membership to avoid recursive RLS policies. Notification records can only be read or marked read by their recipient.

No service-role key is exposed to the mobile client.

## Deferred / later enhancements

- Native OS push notification delivery.
- Attachments, images, voice notes, and message reactions.
- Read receipts and typing indicators.
- Conversation search/archive.
- Moderation tooling and message reporting in the admin phase.
- Comprehensive automated, runtime, security, and cross-platform verification.

## Exit criteria

The MVP conversation/notification data model, authorization, realtime messaging, mobile screens, vehicle-to-seller entry point, and documentation are implemented. Final system verification remains in the hardening phase.
