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

- Which channel should ship first: email, in-app, or operational webhook?
- Should notification preferences live in the primary API data model or notification service data model?
- Should templates be source-owned files, database records, or admin-managed content?
