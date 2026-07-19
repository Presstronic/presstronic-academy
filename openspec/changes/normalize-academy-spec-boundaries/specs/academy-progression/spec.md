## ADDED Requirements

### Requirement: Progression Responsibility Boundary
The progression capability SHALL own clearance, XP, achievements, completion navigation entry points, read-only progression display, and progression integrity while delegating certificate record presentation and issuance details to certificate.

#### Scenario: Progression owns award integrity
- **GIVEN** a lesson, challenge, story, or administrative action reports a completion event
- **WHEN** XP, clearance, or achievement state may change
- **THEN** academy-progression owns duplicate prevention, corrections, and derived progression values.

#### Scenario: Completion record navigation delegates certificate details
- **GIVEN** progression displays a completion record link
- **WHEN** the learner opens the completion record
- **THEN** progression initiates navigation
- **AND** academy-certificate owns certificate presentation, sharing, verification, and access privacy.

#### Scenario: Dashboard values derive from progression
- **GIVEN** another surface displays XP, clearance, achievements, or progress summaries
- **WHEN** progression state changes
- **THEN** the other surface derives display from academy-progression rather than defining independent progression rules.
