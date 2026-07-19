# Academy Auth Entry Specification

## Purpose

Define the Presstronic Academy authentication entry experience.

This specification covers the public authentication screen reached from the landing page. It captures UI state, field presentation, account-entry mode switching, credential validation, account creation, authenticated session creation, session recovery entry points, and safe error handling. It does not specify low-level cryptographic implementation details.

## Requirements

### Requirement: Auth Screen Presentation
WHEN the authentication screen is displayed,
the system SHALL render a centered authentication panel over the Academy grid and glow background without the in-app shell.

#### Scenario: Auth renders outside shell
GIVEN the current screen is `auth`
WHEN the application renders
THEN the authentication screen is displayed
AND the sidebar is not displayed
AND the in-app top bar is not displayed.

#### Scenario: Academy lockup is visible
GIVEN the authentication screen is displayed
WHEN the user views the top of the authentication panel
THEN the Academy brand lockup is displayed above the panel
AND the lockup is interactive.

#### Scenario: Security footer is visible
GIVEN the authentication screen is displayed
WHEN the user views the area below the panel
THEN the system displays the security footer text `PROTECTED BY RATE LIMITING · JWT + REFRESH · TLS 1.3`.

### Requirement: Auth Visual Design
WHERE the authentication screen is displayed,
the system SHALL use the Academy visual design contract for the public auth surface.

#### Scenario: Auth background treatment
GIVEN the authentication screen is displayed
WHEN background styling is applied
THEN the system may use the approved 48px grid
AND may use one soft cyan radial glow
AND does not stack additional decorative background effects.

#### Scenario: Auth brand lockup
GIVEN the authentication screen is displayed
WHEN the Academy brand lockup renders
THEN the lockup uses the approved type-lockup treatment until a real mark is provided
AND does not use emoji, decorative script, or unapproved SVG artwork.

#### Scenario: Auth panel geometry
GIVEN the authentication panel renders
WHEN geometry is applied
THEN the panel uses zero-radius square geometry
AND may use the signature notch only if no other element class on the screen uses it.

### Requirement: Auth Mode Tabs
WHERE the authentication screen is displayed,
the system SHALL provide Sign in and Enroll tabs for switching between login and registration modes.

#### Scenario: Default login mode
GIVEN the user navigates to the authentication screen
WHEN the authentication screen initializes
THEN Sign in mode is selected
AND the Sign in tab is visually active
AND the Enroll tab is visually inactive.

#### Scenario: Switch to enrollment mode
GIVEN the authentication screen is in Sign in mode
WHEN the user activates the Enroll tab
THEN the system switches to enrollment mode
AND the Enroll tab is visually active
AND the Sign in tab is visually inactive.

#### Scenario: Switch back to login mode
GIVEN the authentication screen is in enrollment mode
WHEN the user activates the Sign in tab
THEN the system switches to login mode
AND the Sign in tab is visually active
AND the Enroll tab is visually inactive.

### Requirement: Login Form Fields
WHERE the authentication screen is in Sign in mode,
the system SHALL collect email and access key values and offer remembered-terminal and lost-key affordances.

#### Scenario: Login fields displayed
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the form displays an Email input
AND displays an Access key password input
AND does not display a Callsign input.

#### Scenario: Remember terminal option
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the form displays a "Remember this terminal" checkbox
AND the checkbox is checked by default.

#### Scenario: Lost key affordance
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the form displays a `LOST KEY?` link.

#### Scenario: Login submit label
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the primary submit action is labeled `Open channel`.

### Requirement: Enrollment Form Fields
WHERE the authentication screen is in enrollment mode,
the system SHALL collect callsign, email, and access key values and offer mission-update opt-in.

#### Scenario: Enrollment fields displayed
GIVEN the authentication screen is in enrollment mode
WHEN the authentication form renders
THEN the form displays a Callsign input
AND displays an Email input
AND displays an Access key password input.

#### Scenario: Enrollment password hint
GIVEN the authentication screen is in enrollment mode
WHEN the Access key input is displayed
THEN the system displays the hint `Min 12 characters. Make it strange.`

#### Scenario: Mission updates opt-in
GIVEN the authentication screen is in enrollment mode
WHEN the authentication form renders
THEN the form displays a "Send me mission updates" checkbox
AND does not display the "Remember this terminal" checkbox.

#### Scenario: Enrollment submit label
GIVEN the authentication screen is in enrollment mode
WHEN the authentication form renders
THEN the primary submit action is labeled `Create operative file`.

### Requirement: Auth Submission Navigation
WHEN the user activates the primary authentication action,
the system SHALL validate the submitted form and navigate to the dashboard only after the authentication or enrollment operation succeeds.

#### Scenario: Login submission
GIVEN the authentication screen is in Sign in mode
AND the Email input contains a registered email
AND the Access key input contains the correct access key
WHEN the user activates `Open channel`
THEN the system creates an authenticated session
AND navigates to the dashboard screen
AND the dashboard is displayed inside the in-app shell.

#### Scenario: Enrollment submission
GIVEN the authentication screen is in enrollment mode
AND the Callsign input contains an available callsign
AND the Email input contains an unused valid email
AND the Access key input meets security requirements
WHEN the user activates `Create operative file`
THEN the system creates the learner account
AND creates an authenticated session
AND navigates to the dashboard screen
AND the dashboard is displayed inside the in-app shell.

### Requirement: Auth Brand Navigation
WHEN the user activates the Academy lockup on the authentication screen,
the system SHALL navigate back to the landing screen.

#### Scenario: Return to landing
GIVEN the user is viewing the authentication screen
WHEN the user activates the Academy lockup
THEN the system navigates to the landing screen
AND the landing screen is displayed without the in-app shell.

### Requirement: Auth Validation
WHEN the user submits the authentication form,
the system SHALL validate required fields and display actionable inline errors before performing authentication or enrollment.

#### Scenario: Empty login form is rejected
GIVEN the authentication screen is in Sign in mode
AND the Email input is empty
AND the Access key input is empty
WHEN the user activates `Open channel`
THEN the system keeps the user on the authentication screen
AND displays inline errors for the missing required fields
AND focuses the first invalid field.

#### Scenario: Empty enrollment form is rejected
GIVEN the authentication screen is in enrollment mode
AND the Callsign input is empty
AND the Email input is empty
AND the Access key input is empty
WHEN the user activates `Create operative file`
THEN the system keeps the user on the authentication screen
AND displays inline errors for the missing required fields
AND focuses the first invalid field.

#### Scenario: Invalid login credentials
GIVEN the authentication screen is in Sign in mode
AND the user submits credentials that do not match an active account
WHEN authentication fails
THEN the system keeps the user on the authentication screen
AND displays a non-revealing error with a clear next step
AND does not create an authenticated session.

#### Scenario: Duplicate enrollment email
GIVEN the authentication screen is in enrollment mode
AND the user submits an email that already belongs to an account
WHEN enrollment validation fails
THEN the system keeps the user on the authentication screen
AND displays an inline error next to the Email field
AND does not create a duplicate account.

#### Scenario: Weak access key
GIVEN the authentication screen is in enrollment mode
AND the Access key input does not meet current password policy
WHEN the user activates `Create operative file`
THEN the system keeps the user on the authentication screen
AND displays the unmet access-key requirements inline
AND does not submit the enrollment request.

### Requirement: Auth Request State
WHEN an authentication or enrollment request is in progress,
the system SHALL prevent duplicate submission while preserving user input and clear recovery paths.

#### Scenario: Submit pending
GIVEN the user has submitted a valid authentication form
AND the request has not completed
WHEN the authentication screen renders
THEN the primary action shows a pending state
AND duplicate submission is disabled.

#### Scenario: Request failure
GIVEN the user submits a valid authentication form
WHEN the request fails due to a recoverable service or network error
THEN the system keeps the user's entered values except the access key when appropriate
AND displays an error explaining that the user can retry.

### Requirement: Session Lifecycle
WHERE authentication succeeds,
the system SHALL create, maintain, expire, refresh, and revoke authenticated sessions without exposing credential secrets.

#### Scenario: Remembered terminal session
GIVEN the authentication screen is in Sign in mode
AND `Remember this terminal` is checked
WHEN login succeeds
THEN the system creates a remembered session according to the configured session policy
AND the learner remains signed in across browser restarts until expiry or revocation.

#### Scenario: Non-remembered terminal session
GIVEN the authentication screen is in Sign in mode
AND `Remember this terminal` is not checked
WHEN login succeeds
THEN the system creates a session scoped to the current browser session
AND the session does not persist after the browser session ends.

#### Scenario: Expired session
GIVEN an authenticated learner's session has expired
WHEN the learner requests a protected Academy screen
THEN the system clears authenticated shell state
AND redirects the learner to the authentication screen
AND preserves the intended destination for return after successful sign in.

#### Scenario: Logout revokes session
GIVEN an authenticated learner is signed in
WHEN the learner activates a sign-out action
THEN the system revokes the active session
AND clears local authenticated state
AND navigates to the landing screen.

### Requirement: Access Key Recovery
WHEN a user activates the lost-key affordance,
the system SHALL provide a safe account recovery flow that does not reveal whether an account exists.

#### Scenario: Lost key request
GIVEN the authentication screen is in Sign in mode
WHEN the user activates `LOST KEY?`
THEN the system opens an access-key recovery flow
AND asks for the account email address.

#### Scenario: Recovery submitted
GIVEN the user has entered an email in the access-key recovery flow
WHEN the user submits the request
THEN the system displays a generic confirmation that recovery instructions will be sent if the account can be verified
AND does not reveal whether the email belongs to an account.

#### Scenario: Recovery rate limited
GIVEN recovery requests exceed the configured abuse threshold
WHEN the user submits another recovery request
THEN the system delays or rejects the request
AND displays a retry-later message.

### Requirement: Authentication Abuse Controls
WHERE authentication, enrollment, or recovery requests are submitted,
the system SHALL apply abuse controls while preserving usable recovery for legitimate learners.

#### Scenario: Repeated failed login attempts
GIVEN repeated login attempts fail for the same account, terminal, or network fingerprint
WHEN the threshold is reached
THEN the system rate limits or temporarily locks further attempts
AND displays a non-revealing retry message.

#### Scenario: Locked account still supports recovery
GIVEN a learner is temporarily locked out because of failed attempts
WHEN the learner starts access-key recovery
THEN the system allows the recovery flow subject to its own abuse controls
AND does not bypass account verification.

### Requirement: Auth Entry Responsibility Boundary
The auth-entry capability SHALL own authentication screen presentation, form modes, field validation, submission state, session lifecycle entry behavior, access-key recovery, and authentication abuse feedback while delegating plan checkout, entitlement, and app-shell protected routing to their owning capabilities.

#### Scenario: Plan intent is consumed but not owned
- **GIVEN** the authentication screen receives a plan intent from landing or billing access
- **WHEN** the user completes enrollment
- **THEN** auth-entry carries the intent through account creation
- **AND** billing-access owns checkout, entitlement, and subscription behavior.

#### Scenario: Protected route return is shell-owned
- **GIVEN** an unauthenticated learner is redirected to authentication from a protected route
- **WHEN** authentication succeeds
- **THEN** auth-entry reports successful authentication
- **AND** academy-shell owns return-destination resolution.

#### Scenario: Auth visuals follow global design
- **GIVEN** auth-entry specifies authentication screen styling
- **WHEN** global colors, typography, geometry, or motion are applied
- **THEN** auth-entry follows academy-visual-design rather than redefining global visual rules.
