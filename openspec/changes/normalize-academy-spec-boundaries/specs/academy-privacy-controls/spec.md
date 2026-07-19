## ADDED Requirements

### Requirement: Privacy Controls Responsibility Boundary
The privacy-controls capability SHALL be the authoritative owner for data export, account erasure, cookie preferences, consent persistence, privacy request state, verification requirements, and privacy feedback accessibility across public and authenticated Academy surfaces.

#### Scenario: Public surface delegates privacy behavior
- **GIVEN** a public surface exposes a privacy action
- **WHEN** the user starts that action
- **THEN** the shared privacy-controls capability owns the confirmation, request state, persistence, verification, and feedback behavior.

#### Scenario: Authenticated surface delegates privacy behavior
- **GIVEN** an authenticated surface exposes a privacy action
- **WHEN** the learner starts that action
- **THEN** the shared privacy-controls capability owns the confirmation, request state, persistence, verification, and feedback behavior.

#### Scenario: Surface-specific copy does not alter privacy policy
- **GIVEN** a surface describes a privacy action in its own words
- **WHEN** the privacy flow executes
- **THEN** the privacy-controls capability remains the source of truth for policy, consent, erasure, export, and accessibility requirements.
