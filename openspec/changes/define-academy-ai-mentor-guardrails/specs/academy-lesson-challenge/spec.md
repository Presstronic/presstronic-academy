## ADDED Requirements

### Requirement: Lesson Challenge Mentor Guardrail Boundary
The lesson challenge capability SHALL use AI mentor guardrails for mentor coaching behavior while retaining ownership of lesson challenge workflow and state.

#### Scenario: Lesson mentor uses guardrails
GIVEN a learner asks the mentor for help inside a lesson challenge
WHEN mentor behavior is invoked
THEN lesson challenge provides the relevant lesson, code, test, and attempt context within authorized scope
AND academy-ai-mentor-guardrails owns no-direct-answer, hint-ladder, scope, hidden-material, fallback, and request-state expectations.

#### Scenario: Challenge workflow remains lesson-owned
GIVEN mentor guidance is displayed in a lesson challenge
WHEN the learner edits code, runs tests, resets, or completes the challenge
THEN lesson challenge remains authoritative for code draft, test execution, sandbox safety, completion, and reward behavior
AND mentor guidance does not directly mutate challenge state.

#### Scenario: Mentor unavailable in lesson
GIVEN mentor help is unavailable inside a lesson challenge
WHEN the learner requests help
THEN lesson challenge presents the unavailable, retry, or authored-hint state defined by mentor guardrails
AND preserves the learner's current challenge draft and test results.
