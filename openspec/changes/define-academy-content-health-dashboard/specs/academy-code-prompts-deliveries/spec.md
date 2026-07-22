## ADDED Requirements

### Requirement: Code Prompt Health Signal Boundary
The Code Prompts and Deliveries capability SHALL expose prompt attempt, Delivery, evaluation, review, revision, and accepted-evidence source facts for content health while not owning health aggregation or presentation.

#### Scenario: Prompt outcomes available for health
GIVEN learners work on Code Prompts
WHEN content health requests prompt source facts
THEN Code Prompts and Deliveries can provide prompt identity, published definition version when available, attempt status, workspace lifecycle events, Delivery status, evaluation outcomes, review report status, revision counts, accepted evidence status, and timestamps within authorized scope.

#### Scenario: Health aggregation delegated
GIVEN prompt and Delivery source facts exist
WHEN accepted rates, needs-revision rates, failed Delivery rates, evaluation-error rates, or revision loops are displayed
THEN content health owns aggregation and presentation
AND Code Prompts and Deliveries remains authoritative for individual prompt, Delivery, evaluation, review, and revision facts.

#### Scenario: Evaluation workflow unaffected by health
GIVEN content health processing is delayed or unavailable
WHEN a learner submits a Delivery or receives an evaluation result
THEN Code Prompts and Deliveries preserves the learner workflow
AND does not require the health dashboard to be available for prompt evaluation or review.
