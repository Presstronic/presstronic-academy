## ADDED Requirements

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
