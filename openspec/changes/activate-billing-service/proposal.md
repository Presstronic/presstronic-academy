## Why

Billing and entitlement behavior is important for access control, but full billing service extraction should not happen accidentally inside the primary API. The service boundary needs a proposal before provider webhooks, entitlement synchronization, or compliance-sensitive billing workflows are implemented.

## What Changes

- Define `services/billing` as the future owner for provider integration, entitlement synchronization, billing webhooks, and billing observability.
- Clarify how billing service behavior relates to existing limited billing/access gating.
- Keep production provider selection, pricing, payment collection, and subscription lifecycle implementation deferred.

## Capabilities

### New Capabilities

- `academy-billing-service`: Billing service boundary, provider webhooks, entitlement synchronization, access gating integration, compliance boundaries, and observability.

### Modified Capabilities

- `academy-monorepo-structure`: Activates `services/billing` only after provider and entitlement boundaries are accepted.
- `academy-billing-access`: Clarifies the future split between basic access gating and extracted billing service behavior.

## Impact

- Affects future files under `services/billing`, API contracts, entitlement data, and billing provider integration.
- Does not implement production billing, pricing, checkout, subscription management, or provider webhooks.
