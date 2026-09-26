# Spec Delta

## MODIFIED Requirements

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
THEN the system displays the security footer text `PROTECTED BY RATE LIMITING · PASSWORDLESS · TLS 1.3`.

### Requirement: Auth Entry Responsibility Boundary
The auth-entry capability SHALL own authentication screen presentation, form modes, field validation, submission state, magic-link and one-time-code account entry, OAuth account entry and account linking at sign-in, session lifecycle entry behavior, step-up re-verification, and authentication abuse feedback while delegating plan checkout, entitlement, app-shell protected routing, post-sign-in account management, and staff authentication to their owning capabilities.

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

#### Scenario: Account management is delegated
- **GIVEN** a signed-in learner changes their email, connects or disconnects a sign-in method, signs out other devices, or needs support-assisted recovery
- **WHEN** that behavior is specified
- **THEN** academy-account-security owns it
- **AND** auth-entry supplies the step-up re-verification those flows require.

#### Scenario: Staff authentication is delegated
- **GIVEN** a user signs in to the admin application
- **WHEN** admin sign-in behavior is specified
- **THEN** academy-admin-authentication owns it
- **AND** auth-entry does not grant admin access.

## REMOVED Requirements

### Requirement: Login Form Fields
**Reason**: The `Access key` password field, `Remember this terminal` checkbox, and `LOST KEY?` link no longer exist under a passwordless model. Login is now email-only with a magic-link, one-time-code, or OAuth path. The replacement contract is captured by the new `Passwordless Login Form Fields` requirement below.

**Migration**: Any UI wired to `Access key`, `Remember this terminal`, or `LOST KEY?` is removed. Session persistence is now uniform (governed by the refresh-token lifetime); the "remember" affordance has no equivalent. The `Resend link` affordance on the "link sent" confirmation state (see `Magic Link and Code Lifecycle` below) replaces `LOST KEY?`.

### Requirement: Enrollment Form Fields
**Reason**: The `Access key` password field and the "Min 12 characters. Make it strange." hint no longer exist under a passwordless model. Enrollment is now email-only with a magic-link, one-time-code, or OAuth path. The replacement contract is captured by the new `Passwordless Enrollment Form Fields` requirement below.

**Migration**: The Access-key input and its password-policy hint are removed. The mission-updates opt-in is preserved in the replacement requirement.

### Requirement: Auth Submission Navigation
**Reason**: Direct-credential submission ("Open channel" and "Create operative file" completing auth in a single request) no longer exists. The magic-link and one-time-code flow and the OAuth callback flow replace it. The replacement contract is captured by the new `Passwordless Auth Submission Navigation` requirement below.

**Migration**: Any UI or client code that treated the primary submit as "authenticate immediately" is rewritten to (a) submit a magic-link request and transition to the "link sent" confirmation, (b) consume a magic link or enter the one-time code, or (c) hand off to GitHub or Google OAuth. The dashboard-navigation outcome is preserved on successful consumption or callback.

### Requirement: Auth Validation
**Reason**: `Invalid login credentials` and `Weak access key` scenarios are meaningless without passwords. Non-revealing behavior is preserved and expanded into the new `Passwordless Auth Validation` requirement below.

**Migration**: Password-strength checks are removed from the frontend and no longer exist on the backend. Credential-mismatch feedback is replaced by uniform "link sent" confirmation regardless of whether the email is registered, keeping enumeration-resistance intact.

### Requirement: Session Lifecycle
**Reason**: The `Remember this terminal` semantics no longer exist because there is no per-session "remember" toggle — every authenticated session has a uniform lifetime governed by the refresh-token policy. Silent refresh is a new required behavior. The replacement contract is captured by the new `Passwordless Session Lifecycle` requirement below.

**Migration**: Any client code branching on a "remembered" flag is removed. Silent refresh is added; the frontend consumes it via `POST /auth/token/refresh` when an access token is rejected.

### Requirement: Access Key Recovery
**Reason**: There is no access key to recover under a passwordless model. The `Resend link` affordance on the "link sent" confirmation state (see `Magic Link and Code Lifecycle` below) replaces this flow. Recovery when a learner loses access to every sign-in method is owned by `academy-account-security`.

**Migration**: The `LOST KEY?` link, the recovery email form, and any backend password-reset endpoints are removed. Rate limiting on repeated resend attempts is covered by the new `Passwordless Abuse Controls` requirement below.

### Requirement: Authentication Abuse Controls
**Reason**: Password-attempt lockouts no longer apply. Abuse controls now target link-request flooding, link-consumption abuse, one-time-code guessing, and OAuth-callback abuse. The replacement contract is captured by the new `Passwordless Abuse Controls` requirement below.

**Migration**: Any client copy or backend logic referencing "failed login attempts" or "temporarily locked" is rewritten to reference "too many link requests" / "too many attempts to use this link or code" per the replacement scenarios.

### Requirement: Auth Request State
**Reason**: The scenario `Request failure` referenced preserving values "except the access key when appropriate" — access-key semantics no longer exist. The replacement contract is captured by the new `Passwordless Auth Request State` requirement below.

**Migration**: Client code that special-cased the access-key input on failure is removed. The replacement preserves the email input on failure and adds an OAuth-callback failure scenario.

## ADDED Requirements

### Requirement: Passwordless Login Form Fields
WHERE the authentication screen is in Sign in mode,
the system SHALL collect an email address and offer a passwordless sign-in path plus GitHub and Google sign-in paths.

#### Scenario: Login fields displayed
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the form displays an Email input
AND does not display an Access key input
AND does not display a Callsign input.

#### Scenario: OAuth sign-in affordances
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the form displays a `Continue with GitHub` action and a `Continue with Google` action
AND both actions are visually separated from the email path.

#### Scenario: Login submit label
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the primary submit action for the email path is labeled `Request access link`.

### Requirement: Passwordless Enrollment Form Fields
WHERE the authentication screen is in enrollment mode,
the system SHALL collect a callsign and an email address and offer mission-update opt-in plus GitHub and Google enrollment paths.

#### Scenario: Enrollment fields displayed
GIVEN the authentication screen is in enrollment mode
WHEN the authentication form renders
THEN the form displays a Callsign input
AND displays an Email input
AND does not display an Access key input.

#### Scenario: OAuth enrollment affordances
GIVEN the authentication screen is in enrollment mode
WHEN the authentication form renders
THEN the form displays a `Continue with GitHub` action and a `Continue with Google` action
AND both actions are visually separated from the email path.

#### Scenario: Mission updates opt-in
GIVEN the authentication screen is in enrollment mode
WHEN the authentication form renders
THEN the form displays a "Send me mission updates" checkbox
AND does not display the "Remember this terminal" checkbox.

#### Scenario: Enrollment submit label
GIVEN the authentication screen is in enrollment mode
WHEN the authentication form renders
THEN the primary submit action for the email path is labeled `Send enrollment link`.

### Requirement: Passwordless Auth Submission Navigation
WHEN the user activates the primary authentication action,
the system SHALL validate the submitted form and either issue a sign-in email, initiate OAuth, or complete link or code verification, and SHALL navigate to the dashboard only after account entry succeeds.

#### Scenario: Login link request
GIVEN the authentication screen is in Sign in mode
AND the Email input contains a syntactically valid email
WHEN the user activates `Request access link`
THEN the system submits a sign-in email request for that email
AND the authentication screen transitions to a "link sent" confirmation state
AND does not navigate to the dashboard until the link is consumed or the code is verified.

#### Scenario: Enrollment link request
GIVEN the authentication screen is in enrollment mode
AND the Callsign input contains an available callsign
AND the Email input contains an unused syntactically valid email
WHEN the user activates `Send enrollment link`
THEN the system creates a pending enrollment record
AND submits an enrollment email request for that email
AND the authentication screen transitions to a "link sent" confirmation state
AND does not navigate to the dashboard until the link is consumed or the code is verified.

#### Scenario: Magic-link consumption
GIVEN a user opens a valid, unexpired, unconsumed magic-link URL
WHEN the system consumes the link
THEN the system creates an authenticated session for the associated account
AND navigates to the dashboard screen
AND the dashboard is displayed inside the in-app shell.

#### Scenario: One-time code verification
GIVEN the authentication screen is showing the "link sent" confirmation state
AND the user enters the valid, unexpired one-time code from the sign-in email
WHEN the user submits the code
THEN the system creates an authenticated session for the associated account on the current browser
AND navigates to the dashboard screen
AND the dashboard is displayed inside the in-app shell.

#### Scenario: OAuth sign-in submission
GIVEN the authentication screen is displayed
WHEN the user activates `Continue with GitHub` or `Continue with Google`
THEN the system starts the authorization code flow for that provider
AND on successful callback creates an authenticated session
AND navigates to the dashboard screen
AND the dashboard is displayed inside the in-app shell.

### Requirement: Passwordless Auth Validation
WHEN the user submits the authentication form,
the system SHALL validate required fields and display actionable inline errors before performing a sign-in email request, code verification, or enrollment.

#### Scenario: Empty login form is rejected
GIVEN the authentication screen is in Sign in mode
AND the Email input is empty
WHEN the user activates `Request access link`
THEN the system keeps the user on the authentication screen
AND displays an inline error for the missing Email field
AND focuses the Email input.

#### Scenario: Malformed email is rejected
GIVEN the authentication screen is in Sign in mode
AND the Email input contains a value that is not a syntactically valid email
WHEN the user activates `Request access link`
THEN the system keeps the user on the authentication screen
AND displays an inline email-format error
AND does not submit a sign-in email request.

#### Scenario: Empty enrollment form is rejected
GIVEN the authentication screen is in enrollment mode
AND the Callsign input is empty
AND the Email input is empty
WHEN the user activates `Send enrollment link`
THEN the system keeps the user on the authentication screen
AND displays inline errors for the missing required fields
AND focuses the first invalid field.

#### Scenario: Malformed code is rejected
GIVEN the authentication screen is showing the "link sent" confirmation state
AND the code input does not contain the configured number of digits
WHEN the user submits the code
THEN the system keeps the user on the confirmation state
AND displays an inline code-format error
AND does not count the submission as a failed verification attempt.

#### Scenario: Duplicate enrollment email
GIVEN the authentication screen is in enrollment mode
AND the user submits an email that already belongs to an account
WHEN enrollment validation fails
THEN the system keeps the user on the authentication screen
AND does not create a duplicate account
AND either displays an inline hint to sign in instead or transitions to the "link sent" confirmation without revealing whether the email is registered, according to the abuse-controls policy.

#### Scenario: Non-revealing link-request feedback
GIVEN the authentication screen is in Sign in mode
AND the user submits an email that is not associated with any account
WHEN the sign-in email request is processed
THEN the system displays the same "link sent" confirmation as for a registered email
AND does not reveal whether the email belongs to an account.

### Requirement: Passwordless Session Lifecycle
WHERE authentication succeeds,
the system SHALL create, maintain, expire, refresh, and revoke authenticated sessions without exposing session or refresh secrets to untrusted contexts.

#### Scenario: Email session
GIVEN the user consumes a valid magic link or verifies a valid one-time code
WHEN session creation succeeds
THEN the system creates an authenticated session according to the configured session policy
AND the learner remains signed in across browser restarts until expiry or revocation.

#### Scenario: OAuth session
GIVEN the user completes GitHub or Google sign-in
WHEN session creation succeeds
THEN the system creates an authenticated session according to the configured session policy
AND the learner remains signed in across browser restarts until expiry or revocation.

#### Scenario: Expired session
GIVEN an authenticated learner's session has expired
AND the refresh path cannot renew the session
WHEN the learner requests a protected Academy screen
THEN the system clears authenticated shell state
AND redirects the learner to the authentication screen
AND preserves the intended destination for return after successful sign in.

#### Scenario: Silent session refresh
GIVEN an authenticated learner has an unexpired refresh path
WHEN the active session token nears expiry
THEN the system renews the session without user interaction
AND rotates the refresh material so a stolen refresh value is single-use.

#### Scenario: Logout revokes session
GIVEN an authenticated learner is signed in
WHEN the learner activates a sign-out action
THEN the system revokes the active session and its refresh material
AND clears local authenticated state
AND navigates to the landing screen.

### Requirement: Passwordless Auth Request State
WHEN an authentication or enrollment request is in progress,
the system SHALL prevent duplicate submission while preserving user input and clear recovery paths.

#### Scenario: Submit pending
GIVEN the user has submitted a valid sign-in email request or one-time code
AND the request has not completed
WHEN the authentication screen renders
THEN the primary action shows a pending state
AND duplicate submission is disabled.

#### Scenario: Request failure
GIVEN the user submits a valid sign-in email request
WHEN the request fails due to a recoverable service or network error
THEN the system keeps the user's entered email
AND displays an error explaining that the user can retry.

#### Scenario: OAuth callback failure
GIVEN the user completed GitHub or Google authorization
WHEN the OAuth callback fails validation, times out, or is rejected due to abuse controls
THEN the system returns the user to the authentication screen
AND displays a non-revealing error with a clear next step
AND does not create an authenticated session.

### Requirement: Magic Link and Code Lifecycle
WHERE the system issues a sign-in or enrollment email,
the system SHALL include both a magic link and a one-time code bound to a single account intent, expire them on a shared short timeline, and allow exactly one of them to be used exactly once.

#### Scenario: Email carries a link and a code
GIVEN the user requests a sign-in or enrollment email
WHEN the email is issued
THEN it contains a magic link and a numeric one-time code
AND both share the same account intent and expiry.

#### Scenario: Using one invalidates the other
GIVEN a sign-in email has been issued
WHEN the user consumes the magic link or verifies the one-time code
THEN the system invalidates the other credential from the same email
AND neither can be used again.

#### Scenario: Link is single-use
GIVEN a magic link has been consumed successfully
WHEN the same link URL is opened again
THEN the system rejects the second consumption
AND does not create an additional session.

#### Scenario: Link and code expiry
GIVEN a sign-in email was issued and its configured lifetime has elapsed
WHEN a user opens the expired link or submits the expired code
THEN the system rejects the attempt
AND offers a clear path to request a new email.

#### Scenario: Superseded email
GIVEN a user requests a second sign-in email for the same email intent while an earlier one is still unexpired
WHEN the newer email is issued
THEN the system invalidates the link and code from the earlier email
AND only the newest link and code are usable.

#### Scenario: Code is bound to the requesting browser
GIVEN a sign-in email was requested from one browser
WHEN its one-time code is submitted from a different browser
THEN the system rejects the code with the same non-revealing error used for an incorrect code
AND the magic link remains the path for signing in on a different device.

#### Scenario: Incorrect code attempts are capped
GIVEN a sign-in email has been issued
WHEN incorrect codes are submitted for it the configured maximum number of times
THEN the system invalidates both the link and the code from that email
AND tells the user to request a new email.

#### Scenario: Link opened on another device
GIVEN a magic link is opened on a different browser or device from the one that requested it
WHEN the link is valid, unexpired, and unconsumed
THEN the system creates an authenticated session for the requesting account on the consuming browser
AND does not silently switch identities on the requesting browser.

#### Scenario: Resend link
GIVEN the authentication screen is showing the "link sent" confirmation state
WHEN the user activates a `Resend link` affordance within the configured cooldown policy
THEN the system issues a new sign-in email for the same email intent subject to abuse controls
AND displays confirmation that a new email has been sent.

### Requirement: OAuth Account Linking
WHERE a user completes GitHub or Google sign-in,
the system SHALL resolve the returned identity to an existing account only when the provider is trusted to assert the matching email, SHALL ensure every account has at least one verified email, and SHALL NOT silently create a duplicate account when the match is ambiguous.

#### Scenario: Provider identity already linked
GIVEN a user completes GitHub or Google authorization
AND the returned provider user id is already linked to an existing account
WHEN the OAuth callback is processed
THEN the system creates an authenticated session for that existing account
AND does not create or relink another account.

#### Scenario: Trusted verified email matches an existing account
GIVEN a user completes GitHub or Google authorization
AND the provider returns a verified email that the provider is trusted to assert under the per-provider trust policy
AND exactly one existing account uses that email
WHEN the OAuth callback is processed
THEN the system links the provider identity to that existing account
AND records an audit event for the new link
AND creates an authenticated session for the existing account
AND does not create a duplicate account.

#### Scenario: No matching account
GIVEN a user completes GitHub or Google authorization
AND the provider returns a trusted verified email
AND no existing account uses that email
WHEN the OAuth callback is processed
THEN the system creates a new account seeded from the provider profile
AND records the provider identity and the verified email identity on the new account
AND creates an authenticated session for the new account.

#### Scenario: Provider email is missing or not trusted
GIVEN a user completes GitHub or Google authorization
AND the provider returns no verified email or only an email it is not trusted to assert
WHEN the OAuth callback is processed
THEN the system does not link to any existing account by email
AND asks the user for an email address, prefilled with the provider email when one exists
AND completes account entry only after the user verifies that email with a one-time code
AND links to an existing account if the verified email belongs to one, or otherwise creates a new account.

#### Scenario: Ambiguous email match
GIVEN a user completes GitHub authorization
AND the provider's verified emails match more than one existing account
WHEN the OAuth callback is processed
THEN the system does not link or create an account
AND tells the user to sign in with email and connect the provider from account settings.

### Requirement: Step-Up Re-Verification
WHERE a capability requires recent verification before a sensitive action,
the system SHALL let a signed-in user re-verify with a one-time code sent to the account's verified email and SHALL resume the sensitive action only after verification succeeds.

#### Scenario: Re-verification prompt
GIVEN a signed-in user starts an action that its owning capability marks as sensitive
AND the user's session has not been verified within the configured recent-verification window
WHEN the action is submitted
THEN the system does not perform the action
AND prompts the user to re-verify
AND sends a one-time code to the account's verified email.

#### Scenario: Re-verification success
GIVEN the re-verification prompt is displayed
WHEN the user submits the valid one-time code
THEN the system marks the current session as recently verified
AND lets the user complete the original action without re-entering its inputs.

#### Scenario: Re-verification cancelled or failed
GIVEN the re-verification prompt is displayed
WHEN the user cancels, the code expires, or incorrect codes reach the configured maximum
THEN the system does not perform the sensitive action
AND keeps the user signed in.

#### Scenario: Recent verification is not extended by refresh
GIVEN a session was last verified outside the recent-verification window
WHEN the session is silently refreshed
THEN the session remains not recently verified
AND a sensitive action still requires re-verification.

#### Scenario: Sensitive actions are owned elsewhere
GIVEN a capability such as privacy controls or account security defines a sensitive action
WHEN recent verification is required
THEN that capability decides which actions require it
AND auth-entry owns only the re-verification prompt and the recent-verification signal.

### Requirement: Passwordless Abuse Controls
WHERE sign-in email, code verification, enrollment, re-verification, or OAuth requests are submitted,
the system SHALL apply abuse controls while preserving usable account entry for legitimate learners.

#### Scenario: Repeated sign-in email requests
GIVEN repeated sign-in email requests target the same email, terminal, or network fingerprint
WHEN the threshold is reached
THEN the system rate limits or temporarily rejects further requests for that scope
AND displays a non-revealing retry message.

#### Scenario: Repeated link or code failures
GIVEN repeated attempts submit invalid, expired, or previously used magic links or one-time codes
WHEN the threshold is reached
THEN the system rate limits or temporarily blocks further attempts for that scope
AND displays a non-revealing retry message.

#### Scenario: OAuth callback abuse
GIVEN repeated GitHub or Google OAuth callbacks fail state validation or exceed the abuse threshold
WHEN the threshold is reached
THEN the system rejects further callbacks for that scope
AND displays a non-revealing retry message.

#### Scenario: Rate-limited scope still supports later recovery
GIVEN a scope has been rate-limited due to repeated requests or failures
WHEN the configured cooldown elapses
THEN the system allows subsequent requests, verifications, or OAuth callbacks for that scope subject to normal abuse controls
AND does not bypass identity verification.
