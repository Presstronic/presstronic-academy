## ADDED Requirements

### Requirement: Catalog Responsibility Boundary
The catalog capability SHALL own offering discovery, filters, offering cards, catalog request state, catalog enrollment actions, and access-state display while delegating entitlement authority, story progression, and lesson execution to their owning capabilities.

#### Scenario: Catalog displays entitlement results
- **GIVEN** an offering requires paid access or clearance
- **WHEN** the catalog renders the offering
- **THEN** catalog displays the locked or available state
- **AND** billing-access and progression remain authoritative for entitlement and clearance rules.

#### Scenario: Catalog starts but does not own story progress
- **GIVEN** a learner starts or resumes a story offering from catalog
- **WHEN** navigation begins
- **THEN** catalog initiates the route
- **AND** academy-story owns checkpoints, branch state, and story progression.

#### Scenario: Catalog starts but does not own lesson execution
- **GIVEN** a learner opens a challenge offering from catalog
- **WHEN** navigation begins
- **THEN** catalog initiates the route
- **AND** academy-lesson-challenge owns test execution, draft safety, and sandbox behavior.
