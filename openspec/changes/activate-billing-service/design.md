## Context

The MVP can use limited invite or billing/access gating, while full billing lifecycle work remains broader than the first learner loop. A billing service boundary should define when provider isolation and entitlement synchronization justify service activation.

## Goals / Non-Goals

**Goals:**

- Define `services/billing` ownership for billing provider integration.
- Separate access gating decisions from provider-specific webhook handling.
- Define entitlement synchronization and failure visibility.
- Preserve future compliance and audit boundaries.

**Non-Goals:**

- Do not select a provider or implement checkout.
- Do not define final pricing.
- Do not implement subscription lifecycle, invoices, refunds, or tax behavior.
- Do not make billing service required for invite-only MVP access.

## Decisions

### Decision: Keep billing service future-oriented until provider complexity exists

Billing service extraction is justified by provider isolation, compliance, webhooks, and entitlement synchronization. Basic access gating can remain in the primary app boundary until those needs are accepted.

Alternative considered: activate billing service immediately. That would add operational complexity before the learner loop proves value.

### Decision: Entitlements are the integration contract

Application access should depend on normalized entitlements rather than direct provider status checks scattered across features.

Alternative considered: let feature code query provider state directly. That couples product behavior to provider APIs and failure modes.

## Risks / Trade-offs

- Premature extraction can slow MVP -> keep service future/B2B or launch-gating scoped until needed.
- Provider webhook failures can desync access -> require idempotency, replay, and audit trails.
- Entitlement bugs can block learners -> define safe failure and support visibility.
- Compliance scope can expand -> keep sensitive provider data isolated.

## Migration Plan

1. Accept this proposal.
2. Define entitlement and provider webhook contracts.
3. Implement service scaffold only when billing provider integration is accepted.
4. Wire access checks through normalized entitlements rather than provider-specific calls.

## Open Questions

- Which billing provider should be used first?
- Does MVP launch require paid access, invite-only access, or both?
- Where should entitlement records live before a dedicated billing service is active?
