## ADDED Requirements

### Requirement: Email Change
WHEN a signed-in learner changes their account email,
the system SHALL require step-up re-verification, confirm the new address with a one-time code, and give the previous address a time-limited way to revert the change.

#### Scenario: Email change requires recent verification
GIVEN a signed-in learner's session is not recently verified
WHEN the learner submits a new email address
THEN the system requires step-up re-verification before starting the change.

#### Scenario: New address is confirmed
GIVEN a recently verified learner submits a new email address
WHEN the learner enters the one-time code sent to the new address
THEN the system makes the new address the account's primary verified email
AND removes the previous address as a sign-in email
AND sends the previous address a notice with a revert option.

#### Scenario: Unconfirmed change has no effect
GIVEN a learner started an email change
WHEN the code is not confirmed before it expires
THEN the account email is unchanged
AND the previous address still signs in.

#### Scenario: Address already in use
GIVEN the new address already belongs to another account
WHEN the learner confirms the code
THEN the system declines the change without altering either account
AND tells the learner the address cannot be used and support can help merge accounts.

#### Scenario: Revert from the previous address
GIVEN an email change completed within the configured revert window
WHEN the revert option from the notice to the previous address is used
THEN the system restores the previous address as the primary verified email
AND removes the new address
AND revokes every session for the account
AND asks the user to sign in again.

### Requirement: Sign-In Method Management
WHERE a signed-in learner opens the sign-in and security panel,
the system SHALL list the account's sign-in methods and let the learner connect or disconnect GitHub and Google while always keeping at least one verified email.

#### Scenario: Methods are listed
GIVEN a signed-in learner opens the sign-in and security panel
WHEN the panel renders
THEN the system lists each verified email and each connected GitHub or Google identity
AND shows when each was added.

#### Scenario: Connect a provider
GIVEN a recently verified learner activates `Connect GitHub` or `Connect Google`
AND the provider identity is not linked to any account
WHEN the provider authorization completes
THEN the system links the provider identity to the current account
AND sends a security notice to the account's verified email.

#### Scenario: Provider already linked elsewhere
GIVEN a learner tries to connect a provider identity that is linked to a different account
WHEN the provider authorization completes
THEN the system does not change either account
AND tells the learner support can help merge the accounts.

#### Scenario: Disconnect a provider
GIVEN a recently verified learner has a connected GitHub or Google identity
WHEN the learner disconnects it
THEN the system removes that identity
AND the provider can no longer be used to sign in to the account
AND sends a security notice.

#### Scenario: Last verified email is protected
GIVEN an account has exactly one verified email
WHEN the learner tries to remove it
THEN the system refuses
AND explains that an account must keep at least one verified email.

#### Scenario: Add a secondary email
GIVEN a recently verified learner adds another email address
WHEN the learner confirms the one-time code sent to that address
THEN the address becomes an additional verified sign-in email for the account.

### Requirement: Sign Out Everywhere
WHEN a signed-in learner chooses to sign out everywhere,
the system SHALL revoke every session for the account, including the current one and open real-time connections.

#### Scenario: All sessions revoked
GIVEN a learner is signed in on several browsers or devices
WHEN the learner activates `Sign out everywhere`
THEN every session and its refresh material is revoked
AND open real-time connections for those sessions are closed
AND the current browser returns to the landing screen
AND the account's verified email receives a security notice.

### Requirement: Account Suspension
WHERE support staff suspend an account,
the system SHALL end the account's sessions immediately and prevent new sessions while revealing the suspension only to someone who has proven control of the account.

#### Scenario: Suspension revokes access
GIVEN a staff member with the support role suspends an account
WHEN the suspension is saved
THEN every session for the account is revoked
AND refresh attempts for the account fail
AND the action is recorded with the staff member and reason.

#### Scenario: Suspended sign-in
GIVEN an account is suspended
WHEN someone completes sign-in verification for it by link, code, GitHub, or Google
THEN the system does not create a session
AND shows that the account is suspended and how to contact support.

#### Scenario: Suspension is not enumerable
GIVEN an account is suspended
WHEN someone requests a sign-in email for its address
THEN the response is identical to the response for any other address.

#### Scenario: Reinstatement
GIVEN an account is suspended
WHEN support staff reinstate it
THEN the learner can sign in normally again.

### Requirement: Sessions During Account Erasure
WHERE privacy controls schedule or complete account erasure,
the system SHALL restrict and then remove the account's sessions and identities while letting the owner cancel during the grace period.

#### Scenario: Erasure scheduled
GIVEN a learner schedules account erasure through privacy controls
WHEN the erasure is scheduled
THEN every other session for the account is revoked
AND the account can still be signed in to during the grace period only to cancel erasure or sign out.

#### Scenario: Erasure completed
GIVEN the erasure grace period has elapsed
WHEN erasure executes
THEN all sessions, refresh material, pending sign-in credentials, and identities for the account are removed
AND the account's email addresses and provider identities can be used to enroll a new account.

### Requirement: Support-Assisted Recovery
WHEN a learner has lost access to every sign-in method,
the system SHALL route them to a support recovery process that changes the account only through audited staff action and notifies the previous address.

#### Scenario: Recovery request
GIVEN the authentication screen is displayed
WHEN the user activates `Can't sign in?` and submits the recovery form
THEN the system records a support case
AND shows the same confirmation whether or not an account matches the details
AND does not change any account.

#### Scenario: Staff replaces the email
GIVEN a staff member with the support role has verified a recovery case
WHEN they replace the account's verified email after admin step-up
THEN the system revokes every session for the account
AND sends the previous address a notice with a revert option valid for the configured window
AND records the staff member, case, and change.

### Requirement: Support-Assisted Merge
WHEN a learner has two accounts that belong to them,
the system SHALL merge them only after the learner proves control of both and a support staff member completes the merge.

#### Scenario: Learner confirms from both accounts
GIVEN a learner requests a merge from one account
WHEN the learner signs in to the other account and confirms the same request within the configured window
THEN the request becomes eligible for support review.

#### Scenario: Staff completes the merge
GIVEN a merge request is eligible
WHEN a staff member with the support role completes it after admin step-up
THEN the identities of the closing account move to the surviving account
AND the closing account's sessions are revoked and the account is closed
AND both accounts' verified emails receive a notice.

### Requirement: Account Security Notices
WHEN an email change, revert, sign-in method change, sign out everywhere, suspension, recovery, or merge occurs,
the system SHALL send a security notice to the affected verified addresses that cannot be disabled by marketing preferences.

#### Scenario: Notice sent
GIVEN an event listed by this requirement completes
WHEN notices are dispatched
THEN each affected verified address receives a notice describing the change and how to get help
AND the notice is sent even when the learner opted out of mission updates.

### Requirement: Account Security Responsibility Boundary
The account-security capability SHALL own post-sign-in changes to how an account is reached and who can reach it, while delegating sign-in screens and step-up re-verification to auth-entry, erasure scheduling to privacy controls, profile presentation to profile, and staff sign-in to admin authentication.

#### Scenario: Step-up comes from auth-entry
- **GIVEN** an account-security action requires recent verification
- **WHEN** the learner is not recently verified
- **THEN** auth-entry's step-up re-verification runs
- **AND** account-security resumes the action afterwards.

#### Scenario: Erasure scheduling stays with privacy controls
- **GIVEN** a learner deletes their account
- **WHEN** erasure is confirmed, scheduled, or cancelled
- **THEN** academy-privacy-controls owns that behavior
- **AND** account-security owns only the session and identity consequences.
