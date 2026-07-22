## ADDED Requirements

### Requirement: Mentor Usage Health Boundary
The content health dashboard capability SHALL consume mentor usage signals only after mentor guardrails define allowed signal boundaries.

#### Scenario: Mentor usage contributes to health
GIVEN mentor usage facts exist for published lessons, focused challenges, or Code Prompts
WHEN content health summarizes help-seeking behavior
THEN content health may display aggregate mentor usage signals according to privacy and authorization rules
AND academy-ai-mentor-guardrails remains authoritative for mentor behavior policy.

#### Scenario: Mentor usage does not expose prompt content by default
GIVEN content health summarizes mentor usage
WHEN an admin views aggregate content health
THEN content health does not expose full learner mentor conversations by default
AND uses learner-level mentor details only through authorized support workflows.

#### Scenario: Guardrails remain separate from health analysis
GIVEN content health identifies high mentor usage for a content item
WHEN the signal is reviewed
THEN content health owns the operational interpretation
AND AI mentor guardrails owns changes to mentor coaching policy.
