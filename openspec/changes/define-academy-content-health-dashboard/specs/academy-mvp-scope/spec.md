## ADDED Requirements

### Requirement: MVP Content Health Operations Boundary
The MVP scope SHALL treat content health as limited operational scope for improving the first shippable learner path.

#### Scenario: Content health remains MVP-limited
GIVEN MVP implementation planning begins
WHEN content health is planned
THEN content health includes aggregate stuck signals, failed challenge signals, Delivery outcome summaries, revision loops, drop-off points, and content version context
AND excludes broad BI, cohort analytics, predictive recommendations, alerts, exports, and automated content edits unless accepted by a later proposal.

#### Scenario: Content health supports content iteration
GIVEN admins or instructors review the first shippable path
WHEN content health identifies weak lessons, challenges, or Code Prompts
THEN the information supports content review and iteration
AND content revisions still flow through admin content management.

#### Scenario: AI mentor guardrails remain separate
GIVEN help or mentor behavior contributes learner signals
WHEN AI mentor behavior is planned
THEN AI mentor guardrails remain a separate proposal
AND content health may later consume mentor usage signals only after those guardrails are accepted.
