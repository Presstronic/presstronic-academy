## Why

Academy workflows will eventually need notifications for Delivery review, learner support, admin operations, billing events, and long-running job status. Notification delivery should have an accepted boundary before provider-specific behavior or background workflows are implemented.

## What Changes

- Define `services/notifications` as the future owner for notification delivery and provider integration.
- Specify notification sources, channels, templates, preferences, delivery states, retries, and observability.
- Keep real provider wiring, marketing automation, and broad lifecycle messaging deferred.

## Capabilities

### New Capabilities

- `academy-notifications-service`: Notification delivery service boundary, source events, channels, preferences, templates, delivery lifecycle, retries, and observability.

### Modified Capabilities

- `academy-monorepo-structure`: Activates `services/notifications` only after delivery and provider boundaries are accepted.

## Impact

- Affects future files under `services/notifications`, worker orchestration, and API contracts.
- May add email/provider dependencies in a later implementation step.
- Does not implement provider credentials, marketing campaigns, or production notification sending.
