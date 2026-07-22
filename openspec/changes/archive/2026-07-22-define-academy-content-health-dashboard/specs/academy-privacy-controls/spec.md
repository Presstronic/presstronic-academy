## ADDED Requirements

### Requirement: Content Health Privacy Boundary
The privacy controls capability SHALL define privacy expectations for learner data used in content health views without owning content health presentation.

#### Scenario: Health uses minimized learner data
GIVEN learner outcome signals are used for content health
WHEN content health metrics are generated or displayed
THEN the system minimizes learner-identifying data according to privacy policy
AND privacy controls remain authoritative for data export, erasure, consent, and privacy request behavior.

#### Scenario: Erasure affects health data
GIVEN a learner's personal data is erased according to policy
WHEN content health uses historical outcome signals
THEN the system removes or anonymizes learner-identifying data according to the erasure policy
AND may retain aggregate non-identifying content health statistics when policy permits.

#### Scenario: Export includes applicable health records
GIVEN a learner requests a data export
WHEN exportable learner records include content health source facts tied to that learner
THEN the export includes those records according to privacy policy
AND does not include aggregate metrics about other learners.
