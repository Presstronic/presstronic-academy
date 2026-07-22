## ADDED Requirements

### Requirement: Dashboard Content Health Boundary
The learner dashboard capability SHALL NOT expose admin content health views or become responsible for content health summaries.

#### Scenario: Learner dashboard excludes admin health
GIVEN a learner opens the authenticated dashboard
WHEN content health signals exist for the learner's path, lesson, challenge, or Code Prompt
THEN the learner dashboard does not display admin content health metrics
AND continues to show learner-facing progress, resume prompts, telemetry, and mission-log previews.

#### Scenario: Admin health remains separate
GIVEN an authorized admin or instructor needs content health information
WHEN the user opens an admin operational surface
THEN academy-content-health-dashboard owns the content health presentation
AND academy-dashboard remains responsible for learner dashboard presentation.
