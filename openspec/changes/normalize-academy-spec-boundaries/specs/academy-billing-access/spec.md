## ADDED Requirements

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
