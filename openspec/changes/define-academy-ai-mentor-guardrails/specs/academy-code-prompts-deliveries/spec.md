## ADDED Requirements

### Requirement: Code Prompt Mentor Guardrail Boundary
The Code Prompts and Deliveries capability SHALL use AI mentor guardrails for prompt help while retaining ownership of workspace, Delivery, evaluation, review, and revision behavior.

#### Scenario: Prompt mentor uses guardrails
GIVEN a learner asks for mentor help inside a Code Prompt
WHEN mentor behavior is invoked
THEN Code Prompts and Deliveries provides relevant prompt, workspace, Delivery checklist, evaluation, and attempt context within authorized scope
AND academy-ai-mentor-guardrails owns no-direct-answer, hint-ladder, scope, hidden-material, fallback, and request-state expectations.

#### Scenario: Delivery remains learner-authored
GIVEN mentor guidance is displayed during Code Prompt work
WHEN the learner prepares or submits a Delivery
THEN Code Prompts and Deliveries remains authoritative for the workspace and Delivery submission
AND mentor guidance does not create, submit, or accept a Delivery on behalf of the learner.

#### Scenario: Prompt evaluation remains protected
GIVEN a Code Prompt uses hidden checks, protected rubrics, or internal review guidance
WHEN mentor help is requested
THEN Code Prompts and Deliveries provides only allowed learner-visible evaluation context
AND AI mentor guardrails prevents exposing protected evaluation material.
