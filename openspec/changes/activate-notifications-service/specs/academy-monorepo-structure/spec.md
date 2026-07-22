## ADDED Requirements

### Requirement: Notifications Service Activation
The monorepo structure capability SHALL allow `services/notifications` to become active only through an accepted proposal that defines delivery, provider, preference, retry, and observability boundaries.

#### Scenario: Notifications service becomes active
GIVEN `activate-notifications-service` is accepted and applied
WHEN notification delivery behavior is implemented
THEN `services/notifications` becomes the active owner for provider sending and delivery lifecycle
AND product features only request notifications through accepted contracts.
