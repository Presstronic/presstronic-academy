## ADDED Requirements

### Requirement: Lesson Challenge Health Signal Boundary
The lesson challenge capability SHALL expose focused challenge attempt, test, reset, sandbox, and completion source facts for content health while not owning health aggregation or presentation.

#### Scenario: Challenge outcomes available for health
GIVEN learners run focused challenge tests
WHEN content health requests challenge source facts
THEN lesson challenge can provide attempt identity, content identity, content version when available, test outcomes, reset events, sandbox failures, completion status, and timestamps within authorized scope.

#### Scenario: Health aggregation delegated
GIVEN challenge outcome source facts exist
WHEN repeated failures, stuck signals, or completion summaries are displayed
THEN content health owns aggregation and presentation
AND lesson challenge remains authoritative for individual attempt and test execution facts.

#### Scenario: Learner workflow unaffected by health
GIVEN content health processing is delayed or unavailable
WHEN a learner runs tests or completes a focused challenge
THEN lesson challenge preserves the learner workflow
AND does not require the health dashboard to be available for challenge execution.
