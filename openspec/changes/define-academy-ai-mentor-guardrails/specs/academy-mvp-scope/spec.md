## ADDED Requirements

### Requirement: MVP AI Mentor Guardrails Boundary
The MVP scope SHALL treat AI mentor guardrails as MVP-lite learning support and SHALL defer advanced AI review or automation.

#### Scenario: Guardrails remain MVP-lite
GIVEN MVP implementation planning begins
WHEN mentor behavior is planned
THEN no-direct-answer, hint-ladder, lesson-or-prompt scope, explain-don't-solve, authored-hint fallback, context disclosure, and request-state behavior are included as MVP-lite scope
AND provider-specific live AI implementation is not required before the learner loop is proven.

#### Scenario: Advanced AI review is deferred
GIVEN AI grading, autonomous Delivery acceptance, generated code review reports, adaptive remediation, mistake memory, or personalized curriculum generation is proposed
WHEN MVP scope is enforced
THEN those features are deferred unless a later proposal accepts them
AND basic mentor guardrails do not become a broad AI product surface.

#### Scenario: Implementation scaffolding follows guardrails
GIVEN frontend, backend, or contract scaffolding includes mentor-related surfaces
WHEN implementation work begins
THEN the implementation references accepted AI mentor guardrails
AND does not define conflicting mentor behavior inside implementation-only changes.
