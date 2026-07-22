## ADDED Requirements

### Requirement: Billing Service Boundary
The system SHALL treat `services/billing` as the independently deployable boundary for billing provider integration once provider isolation or entitlement synchronization requires service activation.

#### Scenario: Billing service owns provider integration
GIVEN billing service activation is implemented
WHEN billing provider behavior is reviewed
THEN provider webhooks, provider API calls, billing event normalization, and entitlement synchronization live under `services/billing`
AND product apps consume normalized access state rather than provider-specific payloads.

### Requirement: Entitlement Synchronization
The billing service SHALL synchronize provider billing state into Academy entitlement state used by access decisions.

#### Scenario: Entitlement state changes
GIVEN a billing provider event changes account access
WHEN the event is processed
THEN Academy entitlement state is updated through an idempotent flow
AND the resulting access state can be audited.

#### Scenario: Provider state is unavailable
GIVEN the billing provider is unavailable or returns an error
WHEN entitlement synchronization runs
THEN the failure is recorded
AND access behavior follows documented safe failure rules.

### Requirement: Billing Webhook Handling
The billing service SHALL define webhook validation, idempotency, replay, and failure behavior before production provider webhooks are enabled.

#### Scenario: Webhook is verified
GIVEN a provider webhook is received
WHEN the service processes the event
THEN authenticity is verified before side effects occur
AND duplicate events do not create duplicate entitlement changes.

### Requirement: Billing Observability
The billing service SHALL provide visibility into provider events, entitlement changes, failed synchronizations, and access-impacting errors.

#### Scenario: Billing health is reviewed
GIVEN billing integration is active
WHEN operators inspect billing health
THEN webhook failures, replay needs, provider API failures, and entitlement update outcomes are visible.
