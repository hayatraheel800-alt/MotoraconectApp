# Phase 15 — Production Launch

## Status

**Planned.** Phase 15 starts only after Phase 14 release gates are evidenced.

## Launch architecture

Motoraconect has three application surfaces:

1. **Public web** — `apps/web`
2. **Mobile app** — `apps/mobile`
3. **Admin console** — `apps/admin`

The admin console must remain a separate protected deployment from the public web application.

## Launch gates

- [ ] Public web has its own Vercel project rooted at `apps/web`.
- [ ] Admin remains separately deployed and protected.
- [ ] Production Supabase environment variables are configured for each application.
- [ ] Database migrations are applied and verified in production.
- [ ] RLS and Storage behavior tests pass.
- [ ] Web routes are browser-verified.
- [ ] Mobile flows are verified on an Expo target.
- [ ] Authentication and admin authorization are verified.
- [ ] Marketplace, parts, dealers, consultation, messaging, notifications, AI, and payment mock flows are verified.
- [ ] Error monitoring/runtime logs show no release-blocking failures.
- [ ] Performance review is complete.
- [ ] Privacy, terms, data retention, and operational ownership are finalized.
- [ ] Real payment/AI providers are configured only when their credentials, webhooks, limits, and failure handling are ready.

## Deployment order

1. Supabase production schema/configuration
2. Public web
3. Admin console
4. Mobile release configuration
5. Final smoke test
6. Production announcement

## Rollback

Every production deployment must retain a known-good previous deployment. Database migrations must be backward-compatible where rollback of application code is required.

## Post-launch

- Monitor authentication, marketplace, Storage, messaging, and server errors.
- Review performance and database advisor findings.
- Track payment/AI provider usage once real providers are enabled.
- Keep README and phase documentation synchronized with operational changes.
