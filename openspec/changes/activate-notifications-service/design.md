## Context

Notifications cut across learner, admin, content, billing, and operations workflows. Without a service boundary, notification behavior can become scattered across product features and provider-specific APIs.

## Goals / Non-Goals

**Goals:**

- Define notification ownership and delivery lifecycle.
- Separate product event sources from delivery provider concerns.
- Support future email, in-app, and operational channels.
- Require preferences, retries, idempotency, and observability before production sending.

**Non-Goals:**

- Do not choose or wire a production provider.
- Do not define marketing campaigns or broad lifecycle messaging.
- Do not implement notification UI.
- Do not activate billing or code-runner service behavior.

## Decisions

### Decision: Centralize delivery in `services/notifications`

Notification delivery has provider, retry, template, preference, and observability concerns that should not be duplicated across feature modules.

Alternative considered: send notifications directly from `apps/api`. That is acceptable for early prototypes but does not scale across delivery guarantees and provider failure modes.

### Decision: Product events remain source-owned

Feature areas should own whether an event matters; the notification service owns how accepted messages are delivered.

Alternative considered: let the notification service infer product meaning. That would couple delivery infrastructure to product workflows.

### Decision: Transactional email ships first, driven by authentication

Passwordless sign-in makes email a required sign-in path, so the first channel is transactional email for sign-in links and codes, re-verification codes, and account security notices. These messages bypass marketing preferences but respect hard suppression (bounces, complaints). Production launch requires a reputable transactional provider and SPF, DKIM, and DMARC on the sending domain; sign-in messages must be delivered within seconds and their delivery latency is monitored.

Alternative considered: in-app first. In-app cannot reach a signed-out user, which is exactly when sign-in email is needed.

### Decision: Authenticate every internal request

`services/notifications` accepts requests only from named internal callers presenting a short-lived signed service token (audience = this service, issuer = the caller, minutes-long expiry) or an equivalent mutual-TLS identity. Learner and staff cookies are never forwarded to or accepted by the service. Each caller is allowed only the operations it needs.

Alternative considered: trust the private network. A single compromised pod or misconfigured ingress would then reach every service.

## Risks / Trade-offs

- Overbuilding before message volume exists -> start with service boundaries and minimal delivery contracts.
- Provider lock-in -> keep provider-specific configuration behind service-owned adapters.
- Duplicate notifications -> require idempotency keys and delivery state.
- User trust issues -> require preference and suppression boundaries.

## Migration Plan

1. Accept this proposal.
2. Define message and delivery contracts.
3. Scaffold notification service without production provider credentials.
4. Add provider integration only when first notification workflow is accepted.

## Open Questions

- Should notification preferences live in the primary API data model or notification service data model?
- Should templates be source-owned files, database records, or admin-managed content?
