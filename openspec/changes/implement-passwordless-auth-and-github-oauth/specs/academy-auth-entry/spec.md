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

## REMOVED Requirements

### Requirement: Login Form Fields
**Reason**: The `Access key` password field, `Remember this terminal` checkbox, and `LOST KEY?` link no longer exist under a passwordless model. Login is now email-only with a magic-link or GitHub OAuth path. The replacement contract is captured by the new `Passwordless Login Form Fields` requirement below.

**Migration**: Any UI wired to `Access key`, `Remember this terminal`, or `LOST KEY?` is removed. Session persistence is now uniform (governed by the refresh-token lifetime); the "remember" affordance has no equivalent. The `Resend link` affordance on the "link sent" confirmation state (see `Magic Link Lifecycle` below) replaces `LOST KEY?`.

### Requirement: Enrollment Form Fields
**Reason**: The `Access key` password field and the "Min 12 characters. Make it strange." hint no longer exist under a passwordless model. Enrollment is now email-only with a magic-link or GitHub OAuth path. The replacement contract is captured by the new `Passwordless Enrollment Form Fields` requirement below.

**Migration**: The Access-key input and its password-policy hint are removed. The mission-updates opt-in is preserved in the replacement requirement.

### Requirement: Auth Submission Navigation
**Reason**: Direct-credential submission ("Open channel" and "Create operative file" completing auth in a single request) no longer exists. The two-step magic-link flow and the OAuth callback flow replace it. The replacement contract is captured by the new `Passwordless Auth Submission Navigation` requirement below.

**Migration**: Any UI or client code that treated the primary submit as "authenticate immediately" is rewritten to (a) submit a magic-link request and transition to the "link sent" confirmation, (b) consume a magic-link URL on a subsequent visit, or (c) hand off to GitHub OAuth. The dashboard-navigation outcome is preserved on successful consumption or callback.

### Requirement: Auth Validation
**Reason**: `Invalid login credentials` and `Weak access key` scenarios are meaningless without passwords. Non-revealing behavior is preserved and expanded into the new `Passwordless Auth Validation` requirement below.

**Migration**: Password-strength checks are removed from the frontend and no longer exist on the backend. Credential-mismatch feedback is replaced by uniform "link sent" confirmation regardless of whether the email is registered, keeping enumeration-resistance intact.

### Requirement: Session Lifecycle
**Reason**: The `Remember this terminal` semantics no longer exist because there is no per-session "remember" toggle — every authenticated session has a uniform lifetime governed by the refresh-token policy. Silent refresh is a new required behavior. The replacement contract is captured by the new `Passwordless Session Lifecycle` requirement below.

**Migration**: Any client code branching on a "remembered" flag is removed. Silent refresh is added; the frontend consumes it via `POST /auth/token/refresh` when an access token is rejected.

### Requirement: Access Key Recovery
**Reason**: There is no access key to recover under a passwordless model. The `Resend link` affordance on the "link sent" confirmation state (see `Magic Link Lifecycle` below) replaces this flow.

**Migration**: The `LOST KEY?` link, the recovery email form, and any backend password-reset endpoints are removed. Rate limiting on repeated resend attempts is covered by the new `Passwordless Abuse Controls` requirement below.

### Requirement: Authentication Abuse Controls
**Reason**: Password-attempt lockouts no longer apply. Abuse controls now target link-request flooding, link-consumption abuse, and OAuth-callback abuse. The replacement contract is captured by the new `Passwordless Abuse Controls` requirement below.

**Migration**: Any client copy or backend logic referencing "failed login attempts" or "temporarily locked" is rewritten to reference "too many link requests" / "too many attempts to use this link" per the replacement scenarios.

### Requirement: Auth Request State
**Reason**: The scenario `Request failure` referenced preserving values "except the access key when appropriate" — access-key semantics no longer exist. The replacement contract is captured by the new `Passwordless Auth Request State` requirement below.

**Migration**: Client code that special-cased the access-key input on failure is removed. The replacement preserves the email input on failure and adds an OAuth-callback failure scenario.

## ADDED Requirements

### Requirement: Passwordless Login Form Fields
WHERE the authentication screen is in Sign in mode,
the system SHALL collect an email address and offer a passwordless sign-in path plus a GitHub sign-in path.

#### Scenario: Login fields displayed
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the form displays an Email input
AND does not display an Access key input
AND does not display a Callsign input.

#### Scenario: GitHub sign-in affordance
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the form displays a `Continue with GitHub` action separated from the email path.

#### Scenario: Login submit label
GIVEN the authentication screen is in Sign in mode
WHEN the authentication form renders
THEN the primary submit action for the email path is labeled `Request access link`.

### Requirement: Passwordless Enrollment Form Fields
WHERE the authentication screen is in enrollment mode,
the system SHALL collect a callsign and an email address and offer mission-update opt-in and a GitHub enrollment path.

#### Scenario: Enrollment fields displayed
GIVEN the authentication screen is in enrollment mode
WHEN the authentication form renders
THEN the form displays a Callsign input
AND displays an Email input
AND does not display an Access key input.

#### Scenario: GitHub enrollment affordance
GIVEN the authentication screen is in enrollment mode
WHEN the authentication form renders
THEN the form displays a `Continue with GitHub` action separated from the email path.

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
the system SHALL validate the submitted form and either issue a magic link, initiate GitHub OAuth, or complete magic-link consumption and navigate to the dashboard only after account entry succeeds.

#### Scenario: Login link request
GIVEN the authentication screen is in Sign in mode
AND the Email input contains a syntactically valid email
WHEN the user activates `Request access link`
THEN the system submits a magic-link request for that email
AND the authentication screen transitions to a "link sent" confirmation state
AND does not navigate to the dashboard until the link is consumed.

#### Scenario: Enrollment link request
GIVEN the authentication screen is in enrollment mode
AND the Callsign input contains an available callsign
AND the Email input contains an unused syntactically valid email
WHEN the user activates `Send enrollment link`
THEN the system creates a pending enrollment record
AND submits an enrollment magic-link request for that email
AND the authentication screen transitions to a "link sent" confirmation state
AND does not navigate to the dashboard until the link is consumed.

#### Scenario: Magic-link consumption
GIVEN a user opens a valid, unexpired, unconsumed magic-link URL
WHEN the system consumes the link
THEN the system creates an authenticated session for the associated account
AND navigates to the dashboard screen
AND the dashboard is displayed inside the in-app shell.

#### Scenario: GitHub sign-in submission
GIVEN the authentication screen is displayed
WHEN the user activates `Continue with GitHub`
THEN the system starts the GitHub authorization code flow
AND on successful callback creates an authenticated session
AND navigates to the dashboard screen
AND the dashboard is displayed inside the in-app shell.

### Requirement: Passwordless Auth Validation
WHEN the user submits the authentication form,
the system SHALL validate required fields and display actionable inline errors before performing a magic-link request or enrollment.

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
AND does not submit a magic-link request.

#### Scenario: Empty enrollment form is rejected
GIVEN the authentication screen is in enrollment mode
AND the Callsign input is empty
AND the Email input is empty
WHEN the user activates `Send enrollment link`
THEN the system keeps the user on the authentication screen
AND displays inline errors for the missing required fields
AND focuses the first invalid field.

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
WHEN the magic-link request is processed
THEN the system displays the same "link sent" confirmation as for a registered email
AND does not reveal whether the email belongs to an account.

### Requirement: Passwordless Session Lifecycle
WHERE authentication succeeds,
the system SHALL create, maintain, expire, refresh, and revoke authenticated sessions without exposing session or refresh secrets to untrusted contexts.

#### Scenario: Magic-link session
GIVEN the user consumes a valid magic link
WHEN session creation succeeds
THEN the system creates an authenticated session according to the configured session policy
AND the learner remains signed in across browser restarts until expiry or revocation.

#### Scenario: GitHub session
GIVEN the user completes GitHub sign-in
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
GIVEN the user has submitted a valid magic-link request
AND the request has not completed
WHEN the authentication screen renders
THEN the primary action shows a pending state
AND duplicate submission is disabled.

#### Scenario: Request failure
GIVEN the user submits a valid magic-link request
WHEN the request fails due to a recoverable service or network error
THEN the system keeps the user's entered email
AND displays an error explaining that the user can retry.

#### Scenario: GitHub callback failure
GIVEN the user completed GitHub authorization
WHEN the OAuth callback fails validation, times out, or is rejected due to abuse controls
THEN the system returns the user to the authentication screen
AND displays a non-revealing error with a clear next step
AND does not create an authenticated session.

### Requirement: Magic Link Lifecycle
WHERE the system issues a magic link for sign in or enrollment,
the system SHALL bind the link to a single account intent, expire it on a short timeline, and consume it exactly once.

#### Scenario: Link is single-use
GIVEN a magic link has been consumed successfully
WHEN the same link URL is opened again
THEN the system rejects the second consumption
AND does not create an additional session.

#### Scenario: Link expiry
GIVEN a magic link was issued and its configured lifetime has elapsed
WHEN a user opens the expired link
THEN the system rejects consumption
AND offers a clear path to request a new link.

#### Scenario: Superseded link
GIVEN a user requests a second magic link for the same email intent while an earlier link is still unexpired
WHEN the newer link is issued
THEN the system invalidates the earlier link for that intent
AND only the newest link is consumable.

#### Scenario: Wrong-terminal consumption still authenticates the correct account
GIVEN a magic link is opened on a different browser or device from the one that requested it
WHEN the link is valid, unexpired, and unconsumed
THEN the system creates an authenticated session for the requesting account on the consuming browser
AND does not silently switch identities on the requesting browser.

#### Scenario: Resend link
GIVEN the authentication screen is showing the "link sent" confirmation state
WHEN the user activates a `Resend link` affordance within the configured cooldown policy
THEN the system issues a new magic link for the same email intent subject to abuse controls
AND displays confirmation that a new link has been sent.

### Requirement: GitHub OAuth Account Linking
WHERE a user completes GitHub sign-in,
the system SHALL resolve the returned identity to an existing account when GitHub asserts a verified email match and otherwise create a new account.

#### Scenario: Verified email matches an existing account
GIVEN a user completes GitHub authorization
AND GitHub returns a primary email marked as verified
AND an existing account already uses that email as its identity
WHEN the OAuth callback is processed
THEN the system links the `github` identity to that existing account
AND creates an authenticated session for the existing account
AND does not create a duplicate account.

#### Scenario: No matching account
GIVEN a user completes GitHub authorization
AND no existing account uses the returned verified email
WHEN the OAuth callback is processed
THEN the system creates a new account seeded from the GitHub profile
AND records the `github` identity as the initial identity for the new account
AND creates an authenticated session for the new account.

#### Scenario: Unverified GitHub email is not auto-linked
GIVEN a user completes GitHub authorization
AND GitHub does not return a verified email
WHEN the OAuth callback is processed
THEN the system does not auto-link to any existing account by email
AND either creates a new account with no email identity or prompts the user to verify an email before completing account creation, according to policy.

#### Scenario: GitHub identity already linked
GIVEN a user completes GitHub authorization
AND the returned GitHub user id is already linked to an existing account
WHEN the OAuth callback is processed
THEN the system creates an authenticated session for that existing account
AND does not create or relink another account.

### Requirement: Passwordless Abuse Controls
WHERE magic-link, enrollment, or GitHub OAuth requests are submitted,
the system SHALL apply abuse controls while preserving usable account entry for legitimate learners.

#### Scenario: Repeated magic-link requests
GIVEN repeated magic-link requests target the same email, terminal, or network fingerprint
WHEN the threshold is reached
THEN the system rate limits or temporarily rejects further magic-link requests for that scope
AND displays a non-revealing retry message.

#### Scenario: Repeated magic-link consumption failures
GIVEN repeated attempts submit invalid, expired, or previously consumed magic-link values
WHEN the threshold is reached
THEN the system rate limits or temporarily blocks further consumption attempts for that scope
AND displays a non-revealing retry message.

#### Scenario: OAuth callback abuse
GIVEN repeated GitHub OAuth callbacks fail state validation or exceed the abuse threshold
WHEN the threshold is reached
THEN the system rejects further callbacks for that scope
AND displays a non-revealing retry message.

#### Scenario: Rate-limited scope still supports later recovery
GIVEN a scope has been rate-limited due to repeated requests or failures
WHEN the configured cooldown elapses
THEN the system allows subsequent link requests, consumptions, or OAuth callbacks for that scope subject to normal abuse controls
AND does not bypass identity verification.
