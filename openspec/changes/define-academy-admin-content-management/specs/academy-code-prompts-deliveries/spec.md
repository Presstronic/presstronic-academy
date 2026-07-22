## ADDED Requirements

### Requirement: Code Prompt Published Definition Boundary
The Code Prompts and Deliveries capability SHALL consume published Code Prompt definitions from admin content management and SHALL NOT own prompt authoring, validation, preview, publication, or versioning.

#### Scenario: Prompt uses published definition
GIVEN a learner opens a Code Prompt
WHEN the prompt initializes
THEN Code Prompts and Deliveries uses the published prompt definition selected for that learner path
AND creates learner workspace, Delivery, attempt, evaluation, and review behavior from that published definition.

#### Scenario: Draft prompt excluded from learner workflow
GIVEN a Code Prompt exists only as draft, in review, archived, or unpublished
WHEN a normal learner requests it
THEN Code Prompts and Deliveries does not create a learner workspace or Delivery flow for that prompt
AND follows not-found, unavailable, or access behavior defined by learner-facing specs.

#### Scenario: Prompt authoring delegated
GIVEN an admin edits mission brief, objective, constraints, starting point, Delivery checklist, required evidence, or evaluation expectations
WHEN the edit is saved, validated, previewed, or published
THEN academy-admin-content-management owns that prompt-definition operation
AND Code Prompts and Deliveries consumes the resulting published definition.
