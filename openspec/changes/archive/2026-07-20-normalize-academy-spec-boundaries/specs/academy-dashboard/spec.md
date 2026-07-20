## ADDED Requirements

### Requirement: Dashboard Responsibility Boundary
The dashboard capability SHALL own dashboard presentation, resume prompts, summary panels, and preview cards while deriving data from the capabilities that own progression, catalog enrollment, story checkpoints, and mission-log transmissions.

#### Scenario: Dashboard displays derived progression
- **GIVEN** dashboard displays XP, clearance, streak, or path progress
- **WHEN** progression data changes
- **THEN** dashboard reflects the derived values
- **AND** academy-progression remains authoritative for progression rules and event-backed changes.

#### Scenario: Dashboard resume delegates destination behavior
- **GIVEN** dashboard displays a resume mission action
- **WHEN** the learner activates it
- **THEN** dashboard initiates navigation
- **AND** academy-story owns checkpoint restoration and branch state.

#### Scenario: Dashboard mission-log preview delegates log behavior
- **GIVEN** dashboard displays recent transmissions
- **WHEN** the learner interacts with a transmission
- **THEN** dashboard routes to the relevant destination
- **AND** academy-mission-log owns read state, grouping, counts, and log persistence.
