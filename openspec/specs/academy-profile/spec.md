# Academy Profile Specification

## Purpose

Define the Presstronic Academy profile and operative-file experience.

This specification captures the learner identity summary, editable identity form, terminal preference toggles, avatar action, danger-zone presentation, persisted profile updates, preference storage, and account-erasure entry point. It does not specify backend storage schemas or image-processing implementation details.

## Requirements

### Requirement: Profile Shell Context
WHERE the profile screen is displayed,
the system SHALL render the profile view inside the in-app Academy shell.

#### Scenario: Profile uses app shell
GIVEN the current screen is `profile`
WHEN the application renders
THEN the profile content is displayed inside the app shell
AND the sidebar is displayed
AND the in-app top bar is displayed.

#### Scenario: Profile heading
GIVEN the profile screen is displayed
WHEN the page heading renders
THEN the system displays the section label `// OPERATIVE FILE`
AND displays the heading `Profile`.

### Requirement: Operative Summary Card
WHEN the profile screen displays the learner summary,
the system SHALL show avatar initials, name, callsign, clearance badge, and avatar-change affordance.

#### Scenario: Summary identity
GIVEN the profile screen is displayed
WHEN the operative summary card renders
THEN the system displays the learner initials
AND displays the learner name
AND displays the learner callsign.

#### Scenario: Summary clearance
GIVEN the profile screen is displayed
WHEN the operative summary card renders
THEN the system displays the learner's current clearance level and clearance name.

#### Scenario: Change avatar action
GIVEN the profile screen is displayed
WHEN the operative summary card renders
THEN the system displays a `Change avatar` action.

### Requirement: Identity Form
WHERE the profile screen is displayed,
the system SHALL show identity fields for learner profile details.

#### Scenario: Name fields
GIVEN the profile screen is displayed
WHEN the identity form renders
THEN the system displays a First name input
AND displays a Last name input.

#### Scenario: Email field
GIVEN the profile screen is displayed
WHEN the identity form renders
THEN the system displays an Email input.

#### Scenario: Primary track field
GIVEN the profile screen is displayed
WHEN the identity form renders
THEN the system displays a Primary track select
AND offers Backend engineering, Frontend engineering, and Security as choices.

#### Scenario: Bio field
GIVEN the profile screen is displayed
WHEN the identity form renders
THEN the system displays a Bio input.

#### Scenario: Persisted form values
GIVEN the profile screen is displayed
WHEN the identity form renders
THEN the First name field displays the learner's persisted first name
AND the Last name field displays the learner's persisted last name
AND the Email field displays the learner's persisted email
AND the Bio field displays the learner's persisted bio.

### Requirement: Profile Form Actions
WHERE the profile identity form is displayed,
the system SHALL provide save and discard actions.

#### Scenario: Save action visible
GIVEN the profile screen is displayed
WHEN the identity form renders
THEN the system displays a `Save changes` action.

#### Scenario: Discard action visible
GIVEN the profile screen is displayed
WHEN the identity form renders
THEN the system displays a `Discard` action.

### Requirement: Terminal Preferences
WHERE the profile screen is displayed,
the system SHALL show terminal preference toggles.

#### Scenario: Preferences heading
GIVEN the profile screen is displayed
WHEN the terminal preferences card renders
THEN the system displays the section label `// TERMINAL PREFERENCES`.

#### Scenario: Dark mode preference
GIVEN the terminal preferences card is displayed
WHEN preferences render
THEN the system displays a Dark mode switch
AND the switch reflects the learner's persisted theme preference.

#### Scenario: Type-on narration preference
GIVEN the terminal preferences card is displayed
WHEN preferences render
THEN the system displays a Type-on narration switch
AND the switch reflects the learner's persisted narration preference.

#### Scenario: Weekly digest preference
GIVEN the terminal preferences card is displayed
WHEN preferences render
THEN the system displays a Weekly mission digest switch.

### Requirement: Danger Zone
WHERE the profile screen is displayed,
the system SHALL show a danger-zone section for account deletion.

#### Scenario: Danger zone visible
GIVEN the profile screen is displayed
WHEN the danger-zone card renders
THEN the system displays the section label `// DANGER ZONE`
AND displays copy warning that paths, XP, and achievements are erased.

#### Scenario: Delete account action visible
GIVEN the profile screen is displayed
WHEN the danger-zone card renders
THEN the system displays a `Delete account` destructive action.

### Requirement: Profile Data Source
WHERE the profile screen renders learner content,
the system SHALL derive displayed profile identity, form defaults, and preferences from the learner account.

#### Scenario: Learner summary
GIVEN the profile screen is displayed
WHEN the operative summary card renders
THEN the system reads learner name and callsign from the learner account.

#### Scenario: Persisted identity defaults
GIVEN the profile screen is displayed
WHEN the identity form renders
THEN the system displays the persisted values for first name, last name, email, primary track, bio, and preferences.

### Requirement: Profile Persistence
WHERE the profile screen handles learner profile interactions,
the system SHALL persist valid profile changes, avatar changes, and terminal preferences to the learner account.

#### Scenario: Save persists changes
GIVEN the profile identity form is displayed
WHEN the user activates `Save changes`
THEN the system validates the editable fields
AND persists valid profile data
AND displays a save confirmation.

#### Scenario: Discard restores persisted data
GIVEN the profile identity form is displayed
WHEN the user activates `Discard`
THEN the system restores the fields to the last persisted profile values
AND clears unsaved local changes.

#### Scenario: Avatar change persists
GIVEN the profile screen is displayed
WHEN the user activates `Change avatar`
THEN the system opens an avatar update flow
AND persists a valid avatar update to the learner account.

#### Scenario: Preference toggles persist
GIVEN the terminal preferences card is displayed
WHEN the user toggles a preference
THEN the system persists the preference change
AND preserves it across sessions.

#### Scenario: Delete account opens erasure flow
GIVEN the profile screen is displayed
WHEN the user activates `Delete account`
THEN the system opens the shared account-erasure confirmation flow
AND does not submit deletion until the user explicitly confirms.

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
THEN the system starts email verification for the new address
AND does not treat the new address as verified until confirmation succeeds.

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
The profile capability SHALL own learner profile presentation, editable identity fields, avatar entry points, terminal preferences, validation, profile persistence, and danger-zone entry points while delegating account erasure behavior to privacy controls.

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
