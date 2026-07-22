## ADDED Requirements

### Requirement: Delivery Evaluation Runner Integration
The Code Prompts and Deliveries capability SHALL allow Delivery evaluation to consume accepted code-runner job results without making runner output the sole owner of product acceptance.

#### Scenario: Delivery consumes run results
GIVEN a Delivery requires automated execution or tests
WHEN code-runner results are available
THEN the Delivery evaluation can reference job state, test output, execution metadata, and failure categories
AND presents safe feedback to the learner or reviewer.

#### Scenario: Acceptance remains product-owned
GIVEN a code-runner job succeeds
WHEN Delivery acceptance is determined
THEN acceptance may consider runner results, rubric checks, manual review, and prompt requirements
AND runner success alone does not imply product acceptance unless the prompt evaluation contract explicitly says so.
