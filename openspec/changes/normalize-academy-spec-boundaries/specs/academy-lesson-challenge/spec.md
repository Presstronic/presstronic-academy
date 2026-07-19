## ADDED Requirements

### Requirement: Lesson Challenge Responsibility Boundary
The lesson-challenge capability SHALL own coding challenge presentation, challenge drafts, test execution expectations, mentor interactions, sandbox safety, and challenge completion behavior while delegating story branch decisions and global progression rules to their owning capabilities.

#### Scenario: Challenge receives story context
- **GIVEN** a learner enters a challenge from a story branch
- **WHEN** the challenge initializes
- **THEN** lesson-challenge uses the provided story and attempt context
- **AND** academy-story remains authoritative for branch choice and checkpoint state.

#### Scenario: Challenge completion reports progression event
- **GIVEN** a learner completes a challenge
- **WHEN** XP, clearance, or achievements may change
- **THEN** lesson-challenge records or emits the completion result
- **AND** academy-progression owns derived progression and award integrity rules.

#### Scenario: Challenge visual treatment references global design
- **GIVEN** challenge panes specify terminal, test, mentor, or code styling
- **WHEN** global colors, typography, geometry, or motion are applied
- **THEN** lesson-challenge follows academy-visual-design
- **AND** only defines challenge-specific presentation constraints.
