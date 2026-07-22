## ADDED Requirements

### Requirement: Mentor Privacy Boundary
The privacy controls capability SHALL define privacy expectations for mentor context, conversation records, retention, export, and erasure without owning mentor coaching behavior.

#### Scenario: Mentor context uses privacy policy
GIVEN learner task context is shared with mentor behavior
WHEN privacy requirements are applied
THEN privacy controls remain authoritative for consent, export, erasure, retention, and sensitive-data handling expectations
AND AI mentor guardrails remains authoritative for mentor coaching behavior.

#### Scenario: Export includes mentor records
GIVEN a learner requests a data export
WHEN exportable learner records include persisted mentor prompts, responses, or metadata
THEN the export includes those records according to privacy policy
AND does not include protected system prompts, hidden checks, rubrics, or other learners' data.

#### Scenario: Erasure affects mentor records
GIVEN a learner's personal data is erased according to policy
WHEN mentor records exist for that learner
THEN the system deletes or anonymizes learner-identifying mentor records according to the erasure policy
AND may retain aggregate non-identifying usage counts when policy permits.
