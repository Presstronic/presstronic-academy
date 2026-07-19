## ADDED Requirements

### Requirement: Mission Log Responsibility Boundary
The mission-log capability SHALL own transmissions, grouping, tabs, unread/read state, counts, empty states, log request state, and action routing entry points while delegating destination screen behavior to the target capability.

#### Scenario: Mission log owns read state
- **GIVEN** a transmission is displayed in mission log
- **WHEN** the learner marks it read or marks all read
- **THEN** mission-log owns persisted read state and count recalculation.

#### Scenario: Mission log routes but does not own destinations
- **GIVEN** a transmission has an action destination
- **WHEN** the learner activates the action
- **THEN** mission-log initiates navigation to the configured destination
- **AND** the destination capability owns the resulting screen behavior.

#### Scenario: Dashboard preview does not own mission log state
- **GIVEN** another surface previews transmissions
- **WHEN** the learner interacts with the preview
- **THEN** mission-log remains authoritative for read state, grouping, counts, and log persistence.
