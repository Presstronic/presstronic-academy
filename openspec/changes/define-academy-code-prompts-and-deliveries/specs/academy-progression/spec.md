## ADDED Requirements

### Requirement: Delivery Evidence Progression Boundary
The progression capability SHALL consume accepted Delivery evidence for learner progress while delegating prompt evaluation and review details to Code Prompts and Deliveries.

#### Scenario: Accepted Delivery contributes progress
GIVEN a learner has an accepted Delivery
WHEN progression state is calculated
THEN academy-progression may count the accepted Delivery toward path progress, skill evidence, achievements, or clearance requirements
AND uses Delivery status provided by academy-code-prompts-deliveries.

#### Scenario: Non-accepted Delivery does not complete progress
GIVEN a Delivery has pending, needs-revision, failed, or evaluation-error status
WHEN progression state is calculated
THEN academy-progression does not treat that Delivery as accepted completion evidence
AND may display the derived status without owning the review report.

#### Scenario: Progression delegates review detail
GIVEN a learner views progress evidence from an accepted Delivery
WHEN the learner opens review details
THEN academy-progression links to the prompt review report
AND academy-code-prompts-deliveries remains authoritative for evaluation checks, feedback, and revision history.
