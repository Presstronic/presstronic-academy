## ADDED Requirements

### Requirement: Staff Passkey Sign-In
WHEN a user signs in to the admin application,
the system SHALL require a passkey assertion with user verification from an account that holds an active staff grant.

#### Scenario: Passkey sign-in succeeds
GIVEN an account holds an active staff grant
AND the account has a registered passkey
WHEN the user activates `Sign in with passkey` on the admin sign-in screen and completes the passkey prompt with user verification
THEN the system creates an admin session for that account
AND displays the admin application.

#### Scenario: Other sign-in methods do not grant admin access
GIVEN a user is signed in to the learner application by email link, one-time code, GitHub, or Google
WHEN the user opens the admin application
THEN the system shows the admin sign-in screen
AND does not treat the learner session as an admin session.

#### Scenario: Account without a staff grant
GIVEN a passkey assertion succeeds for an account with no active staff grant
WHEN the system evaluates admin access
THEN the system does not create an admin session
AND displays a message that the account does not have admin access.

#### Scenario: Failed passkey assertion
GIVEN the user cancels the passkey prompt or the assertion fails verification
WHEN the admin sign-in completes
THEN the system does not create an admin session
AND displays a retryable, non-revealing error
AND records the failed attempt.

#### Scenario: Sign-in attempts are rate limited
GIVEN repeated failed admin sign-in attempts come from the same network fingerprint
WHEN the configured threshold is reached
THEN the system temporarily rejects further attempts from that scope
AND displays a retry-later message.

### Requirement: Staff Grants
The system SHALL grant admin access only through an explicit, auditable staff grant on an existing account that records the roles the account holds.

#### Scenario: Grant carries roles
GIVEN a staff manager grants admin access to an account
WHEN the grant is created
THEN it records one or more of the author, reviewer, publisher, read-only, support, and staff-manager roles
AND records who granted it and when.

#### Scenario: Roles reach authorization
GIVEN a staff member has an admin session
WHEN an admin action is authorized
THEN the roles on the active grant are available to the authorization decision
AND the admin capability that owns the action decides whether those roles permit it.

#### Scenario: Revoking a grant ends admin sessions
GIVEN a staff member has one or more admin sessions
WHEN a staff manager revokes the staff grant
THEN every admin session for that account is revoked immediately
AND the account's learner sessions are not affected.

#### Scenario: Last staff manager is protected
GIVEN an account holds the only active staff-manager role
WHEN a revocation would leave no active staff manager
THEN the system rejects the revocation
AND explains that another staff manager must exist first.

### Requirement: Staff Passkey Enrollment
The system SHALL let a staff member register a passkey only through a single-use enrollment invite bound to their account, redeemed after the account proves control of its verified email.

#### Scenario: Invite redemption
GIVEN a staff manager issued an enrollment invite for an account
AND the invited person is signed in to that account in the learner application
WHEN they open the invite, complete step-up re-verification, and register a passkey
THEN the system stores the passkey for that account
AND marks the invite as redeemed.

#### Scenario: Invite used by another account
GIVEN an enrollment invite was issued for one account
WHEN a different signed-in account opens the invite
THEN the system rejects the invite
AND does not register a passkey.

#### Scenario: Invite expiry and reuse
GIVEN an enrollment invite has expired or was already redeemed
WHEN anyone opens it
THEN the system rejects the invite
AND tells the user to ask a staff manager for a new one.

#### Scenario: Additional passkeys
GIVEN a staff member is signed in to the admin application with a recent passkey assertion
WHEN they register another passkey
THEN the system stores the additional passkey
AND records an audit event.

#### Scenario: First staff account bootstrap
GIVEN no active staff-manager grant exists in an environment
WHEN an operator runs the server-side bootstrap command for an email address
THEN the system grants the staff-manager role to the account with that verified email
AND issues a single-use enrollment invite for it
AND the command refuses to run while any active staff manager exists.

### Requirement: Staff Access Recovery
The system SHALL recover staff access only by re-enrollment issued by another staff manager or the operator bootstrap path, never by email alone.

#### Scenario: Lost passkeys
GIVEN a staff member has lost access to every registered passkey
WHEN they ask for access to be restored
THEN a staff manager can revoke the lost passkeys and issue a new enrollment invite
AND the staff member cannot restore admin access through an email link or code alone.

### Requirement: Admin Session Lifecycle
WHERE a staff member has an admin session,
the system SHALL keep it separate from learner sessions and bound it with an idle timeout and an absolute lifetime.

#### Scenario: Sessions are separate
GIVEN a user has both a learner session and an admin session
WHEN either session is used against the other application's endpoints
THEN the system rejects the request as unauthenticated.

#### Scenario: Idle timeout
GIVEN an admin session has had no activity for the configured idle timeout
WHEN the staff member next uses the admin application
THEN the system requires a new passkey sign-in.

#### Scenario: Absolute lifetime
GIVEN an admin session has reached the configured absolute lifetime
WHEN the staff member next uses the admin application
THEN the system requires a new passkey sign-in regardless of recent activity.

#### Scenario: Admin sign-out
GIVEN a staff member is signed in to the admin application
WHEN they sign out
THEN the system revokes the admin session
AND leaves any learner session unchanged.

### Requirement: Admin Step-Up
WHERE a staff member performs a high-impact action,
the system SHALL require a passkey assertion within the configured step-up window before performing it.

#### Scenario: Step-up required
GIVEN a staff member's last passkey assertion is older than the step-up window
WHEN they grant or revoke staff access, change roles, publish, unpublish, or roll back content
THEN the system does not perform the action
AND prompts for a passkey assertion
AND performs the original action after the assertion succeeds.

#### Scenario: Step-up cancelled
GIVEN the step-up prompt is displayed
WHEN the staff member cancels or the assertion fails
THEN the system does not perform the action
AND keeps the admin session active.

### Requirement: Staff Authentication Audit
The system SHALL record an audit event for every staff sign-in, failed sign-in, passkey registration or removal, enrollment invite creation or redemption, staff grant change, step-up, and admin session revocation.

#### Scenario: Audit event recorded
GIVEN any staff authentication event listed by this requirement occurs
WHEN the event completes or fails
THEN the system records the account, event type, outcome, time, source network, and user agent
AND the record cannot be edited through the admin application.
