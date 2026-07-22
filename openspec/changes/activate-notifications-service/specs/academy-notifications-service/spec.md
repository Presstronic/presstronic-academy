## ADDED Requirements

### Requirement: Notifications Service Boundary
The system SHALL treat `services/notifications` as the independently deployable boundary for notification delivery once the service is accepted.

#### Scenario: Service owns delivery
GIVEN notification behavior is implemented
WHEN delivery ownership is reviewed
THEN provider integration, delivery state, retries, templates, and channel-specific sending live under the notifications boundary
AND product features remain responsible for deciding which events require notification.

### Requirement: Notification Delivery Lifecycle
The notifications service SHALL track delivery lifecycle states and retry behavior for outbound notifications.

#### Scenario: Delivery state is observable
GIVEN a notification is requested
WHEN delivery is processed
THEN the system can distinguish pending, sent, failed, suppressed, and retryable states
AND failures are observable for operational review.

#### Scenario: Duplicate delivery is controlled
GIVEN the same product event is processed more than once
WHEN notification delivery is requested
THEN idempotency or deduplication prevents unintended duplicate sends where the notification contract requires it.

### Requirement: Notification Channels and Templates
The notifications service SHALL define supported channels and template ownership before production sending is enabled.

#### Scenario: Channel is accepted before use
GIVEN a workflow needs email, in-app, webhook, or other delivery
WHEN notification behavior is implemented
THEN the channel is explicitly supported by the service contract
AND unsupported channels are not used implicitly by feature code.

#### Scenario: Template ownership is clear
GIVEN a notification requires authored content
WHEN templates are implemented
THEN template source, variables, fallback behavior, and review ownership are documented.

### Requirement: Notification Preferences and Suppression
The notifications service SHALL respect user or account notification preferences and operational suppression rules where applicable.

#### Scenario: Preference check occurs before send
GIVEN a notification targets a learner, admin, instructor, candidate, or company user
WHEN delivery is attempted
THEN applicable preference and suppression rules are evaluated before provider sending.

### Requirement: Notification Observability
The notifications service SHALL provide visibility into delivery volume, provider errors, retries, suppressions, and latency.

#### Scenario: Delivery health is reviewed
GIVEN notification sending is active
WHEN operators inspect notification health
THEN delivery attempts, failures, retry counts, suppression counts, and provider error categories are visible or intentionally deferred with documented rationale.
