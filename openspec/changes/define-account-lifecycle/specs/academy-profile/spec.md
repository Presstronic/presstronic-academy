## MODIFIED Requirements

### Requirement: Profile Validation and Request State
WHEN the learner edits profile data,
the system SHALL validate editable fields, expose pending state, and preserve recoverable user input.

#### Scenario: Save pending
GIVEN the learner activates `Save changes`
AND the profile update request is in progress
WHEN the profile form renders
THEN the save action displays pending state
AND duplicate save submissions are disabled.

#### Scenario: Invalid profile fields
GIVEN the learner enters invalid profile data
WHEN the learner activates `Save changes`
THEN the system keeps the learner on the profile screen
AND displays inline errors for invalid fields
AND focuses the first invalid field.

#### Scenario: Email change requires verification
GIVEN the learner changes the Email field
WHEN the learner saves valid profile data
THEN the system starts the account-security email change flow for the new address
AND does not treat the new address as verified until that flow confirms it
AND saves the other profile changes independently of the email change.

#### Scenario: Save failure
GIVEN the learner submits valid profile changes
WHEN the save request fails
THEN the system preserves the edited values
AND displays a retryable error.

#### Scenario: Unsaved profile navigation
GIVEN the learner has unsaved profile changes
WHEN the learner attempts to navigate away
THEN the system warns that changes may be lost
AND lets the learner stay or discard changes.

#### Scenario: Avatar constraints
GIVEN the learner uploads or selects a new avatar
WHEN the avatar update flow validates the image
THEN the system enforces configured file type, size, and safety constraints
AND displays actionable errors for invalid avatar updates.

### Requirement: Profile Responsibility Boundary
The profile capability SHALL own learner profile presentation, editable identity fields, avatar entry points, terminal preferences, validation, profile persistence, and danger-zone entry points while delegating account erasure behavior to privacy controls and email change, sign-in methods, and session management to account security.

#### Scenario: Profile opens but does not own erasure
- **GIVEN** the profile danger zone exposes account deletion
- **WHEN** the learner starts deletion
- **THEN** profile opens or routes to the shared erasure flow
- **AND** academy-privacy-controls owns confirmation, verification, scheduling, cancellation, retention exceptions, and request failure behavior.

#### Scenario: Theme preference coordinates with shell
- **GIVEN** profile exposes a dark mode preference
- **WHEN** the learner changes that preference
- **THEN** profile owns preference presentation and persistence request
- **AND** academy-shell owns document-level theme application and shell synchronization.

#### Scenario: Profile does not own auth credential recovery
- **GIVEN** profile exposes identity or email updates
- **WHEN** authentication, re-verification, or credential recovery is required
- **THEN** auth-entry or the relevant authentication capability owns credential verification behavior.

#### Scenario: Profile links to sign-in and security
- **GIVEN** the profile screen is displayed
- **WHEN** the learner wants to manage sign-in methods or sessions
- **THEN** profile provides an entry point to the sign-in and security panel
- **AND** academy-account-security owns the panel's behavior.
