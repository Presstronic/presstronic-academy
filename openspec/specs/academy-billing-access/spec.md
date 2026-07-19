# Academy Billing Access Specification

## Purpose

Define Presstronic Academy plan selection, checkout handoff, subscription state, and entitlement enforcement.

This specification captures intended access behavior for Recruit and Operative plans, including plan intent from public pricing, account creation handoff, checkout state, entitlement checks, downgrade behavior, and user-facing billing errors. It does not specify payment-provider internals, tax calculation rules, or accounting implementation details.

## Requirements

### Requirement: Plan Intent Capture
WHEN a public pricing action starts enrollment,
the system SHALL carry the selected plan intent into authentication and account creation.

#### Scenario: Recruit plan selected
GIVEN the learner activates `Start free` from the landing pricing section
WHEN the authentication screen opens
THEN the system opens enrollment mode
AND associates the Recruit plan intent with the enrollment flow.

#### Scenario: Operative plan selected
GIVEN the learner activates `Enroll now` from the landing pricing section
WHEN the authentication screen opens
THEN the system opens enrollment mode
AND associates the Operative plan intent with the enrollment flow.

#### Scenario: Plan intent is preserved after sign in
GIVEN an existing user starts from a plan-specific pricing action
WHEN the user signs in instead of creating a new account
THEN the system preserves the selected plan intent
AND continues to the appropriate access or checkout flow.

### Requirement: Recruit Access
WHERE a learner has Recruit access,
the system SHALL permit free-path access and block paid entitlements with a clear upgrade path.

#### Scenario: Recruit can start free content
GIVEN the learner has Recruit access
WHEN the learner starts an offering included in free access
THEN the system permits enrollment
AND starts or resumes the offering.

#### Scenario: Recruit blocked from paid content
GIVEN the learner has Recruit access
AND an offering requires Operative access
WHEN the learner attempts to start the offering
THEN the system prevents access
AND displays an upgrade action explaining that Operative access is required.

### Requirement: Operative Checkout
WHEN a learner chooses paid Operative access,
the system SHALL complete checkout before granting paid entitlements.

#### Scenario: New paid enrollment requires checkout
GIVEN the learner selected Operative access
AND the learner account has been created
WHEN the enrollment flow reaches plan activation
THEN the system starts checkout or payment confirmation
AND does not grant Operative entitlements until payment succeeds.

#### Scenario: Checkout succeeds
GIVEN the learner completes checkout successfully
WHEN payment confirmation is received
THEN the system grants Operative access
AND returns the learner to the intended Academy destination.

#### Scenario: Checkout canceled
GIVEN the learner is in checkout
WHEN the learner cancels checkout
THEN the system keeps the learner on their previous access level
AND provides a path back to catalog or pricing.

#### Scenario: Checkout fails
GIVEN checkout cannot be completed
WHEN the failure is returned
THEN the system displays a recoverable billing error
AND does not grant paid entitlements.

### Requirement: Entitlement Enforcement
WHERE Academy content, challenges, certificates, or progression features require a plan,
the system SHALL enforce access using the learner's current entitlement state.

#### Scenario: Entitlement checked before protected content
GIVEN a learner requests protected content
WHEN the content requires a plan or clearance level
THEN the system checks both entitlement and clearance
AND permits access only when both requirements are satisfied.

#### Scenario: Entitlement changes while active
GIVEN the learner's subscription or entitlement changes
WHEN the learner requests new protected content
THEN the system uses the latest entitlement state
AND does not rely only on stale client-side access state.

#### Scenario: Locked offering explains requirements
GIVEN an offering is locked by plan or entitlement
WHEN the offering card renders
THEN the system identifies the required plan
AND provides the appropriate upgrade, manage billing, or contact support action.

### Requirement: Subscription Lifecycle
WHERE a learner has paid access,
the system SHALL represent active, trialing, past-due, canceled, and expired subscription states.

#### Scenario: Active subscription
GIVEN the learner has an active Operative subscription
WHEN entitlement state is evaluated
THEN the learner has Operative access.

#### Scenario: Past-due subscription
GIVEN the learner's Operative subscription is past due
WHEN the learner requests paid content
THEN the system follows the configured grace-period policy
AND displays billing-recovery messaging when access is at risk or blocked.

#### Scenario: Canceled subscription with remaining term
GIVEN the learner cancels Operative access
AND the paid term has not ended
WHEN entitlement state is evaluated
THEN the learner keeps Operative access until the term end.

#### Scenario: Expired subscription
GIVEN the learner's paid term has ended
WHEN entitlement state is evaluated
THEN the learner no longer has Operative access
AND previously earned progression remains visible subject to product policy.

### Requirement: Billing Management
WHERE an authenticated learner manages subscription or payment state,
the system SHALL provide a route to billing management without exposing payment details directly in Academy screens.

#### Scenario: Manage billing
GIVEN the learner has billing history or an active paid subscription
WHEN the learner activates a manage-billing action
THEN the system opens the billing management flow
AND returns the learner to the Academy when the flow completes or is canceled.

#### Scenario: Billing unavailable
GIVEN billing management cannot be opened
WHEN the learner activates a manage-billing action
THEN the system displays a retryable error
AND provides a support path.

### Requirement: Billing Access Responsibility Boundary
The billing-access capability SHALL own plan intent, checkout, entitlement enforcement, subscription lifecycle, and billing management while delegating authentication screen fields, session lifecycle, and general route rendering to auth-entry and shell.

#### Scenario: Authentication owns account entry fields
- **GIVEN** a billing flow requires the user to sign in or enroll
- **WHEN** the authentication screen opens
- **THEN** billing-access passes plan intent
- **AND** auth-entry owns form fields, validation, submission state, and session creation.

#### Scenario: Entitlements are authoritative for protected paid content
- **GIVEN** a learner attempts to access paid content
- **WHEN** access is evaluated
- **THEN** billing-access owns subscription and entitlement state
- **AND** content surfaces only display the resulting allowed or locked state.

#### Scenario: Billing management stays outside content screens
- **GIVEN** a learner opens billing management
- **WHEN** billing account details or payment operations are required
- **THEN** billing-access owns the billing management flow
- **AND** Academy content screens do not expose payment details directly.
