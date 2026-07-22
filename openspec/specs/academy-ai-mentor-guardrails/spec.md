# Academy AI Mentor Guardrails Specification

## Purpose

Define the Presstronic Academy AI mentor guardrails capability.

This specification captures MVP-limited mentor coaching policy, no-direct-answer behavior, progressive hint ladders, scoped context, hidden-material protection, authored-hint fallback, request states, privacy and retention expectations, mentor usage signal boundaries, and ownership boundaries across lesson challenges and Code Prompts. It does not specify provider-specific prompts, model selection, token budgets, moderation tooling, database schemas, API endpoints, frontend implementation, or live AI integration.

## Requirements

### Requirement: Mentor Coaching Contract
The system SHALL provide AI mentor behavior that supports learning without completing the learner's work for them.

#### Scenario: Mentor gives coaching guidance
GIVEN a learner asks for help in a supported lesson or Code Prompt context
WHEN mentor guidance is available
THEN the mentor explains relevant concepts, asks diagnostic questions, points to observed evidence, and suggests next investigation steps
AND preserves learner responsibility for the final solution or Delivery.

#### Scenario: Mentor refuses direct answer request
GIVEN a learner asks the mentor for a complete solution, final code, hidden answer, or finished Delivery
WHEN the mentor responds
THEN the mentor refuses to provide the direct answer
AND redirects to a hint, explanation, debugging step, or smaller question the learner can act on.

#### Scenario: Mentor explains without solving
GIVEN a learner asks why something is failing
WHEN the mentor has enough task context
THEN the mentor explains the likely concept or failure mode
AND does not replace the learner's code, implementation notes, or Delivery evidence with a completed answer.

### Requirement: Hint Ladder
The system SHALL support progressive hint behavior that increases specificity without jumping directly to a solution.

#### Scenario: First hint is broad
GIVEN a learner asks for help before receiving prior hints for the same issue
WHEN the mentor responds
THEN the mentor starts with a conceptual or diagnostic hint
AND avoids implementation-level instructions unless the learner context requires basic orientation.

#### Scenario: Later hints become more specific
GIVEN a learner continues to struggle after earlier hints
WHEN the mentor responds again for the same issue
THEN the mentor may provide a more specific hint, targeted example, or debugging checklist
AND still avoids providing a complete solution.

#### Scenario: Hint ladder uses current signals
GIVEN the mentor has access to current code, test results, Delivery status, or evaluation feedback
WHEN the mentor chooses a hint level
THEN the mentor uses those signals to avoid repeating irrelevant generic advice
AND keeps the next step tied to the current learner task.

### Requirement: Scope and Context Limits
The system SHALL limit mentor assistance to the active learning context and disclosed learner work.

#### Scenario: Lesson context
GIVEN a learner asks for mentor help inside a lesson challenge
WHEN mentor context is prepared
THEN the system may include lesson content, challenge instructions, current code, latest test results, acceptance criteria, and relevant conversation history
AND excludes unrelated profile, billing, private account, and cross-course data by default.

#### Scenario: Code Prompt context
GIVEN a learner asks for mentor help inside a Code Prompt
WHEN mentor context is prepared
THEN the system may include prompt brief, objective, constraints, starting point, Delivery checklist, learner workspace context, evaluation feedback, and relevant conversation history
AND excludes unrelated learner data by default.

#### Scenario: Out-of-scope request
GIVEN a learner asks for help unrelated to the active lesson or prompt
WHEN the mentor responds
THEN the mentor redirects the learner back to the active task when possible
AND avoids giving unsupported broad advice that conflicts with the learning objective.

### Requirement: Hidden Material Protection
The system SHALL prevent mentor behavior from revealing protected answers, hidden checks, rubrics, or evaluation internals.

#### Scenario: Hidden tests are protected
GIVEN a challenge or Code Prompt uses hidden tests or protected checks
WHEN the learner asks about hidden test implementation
THEN the mentor does not reveal hidden test code, exact assertions, or protected fixtures
AND may explain the visible failure category or concept being assessed.

#### Scenario: Rubric internals are protected
GIVEN a Code Prompt has internal evaluation guidance or review rubrics
WHEN the learner asks the mentor for the rubric or scoring shortcut
THEN the mentor does not reveal protected rubric details
AND may summarize public evaluation expectations already visible to the learner.

#### Scenario: Solution material is protected
GIVEN authored solution code, reference implementations, or instructor-only notes exist
WHEN mentor context is prepared or mentor output is generated
THEN the system prevents those protected materials from being exposed to the learner.

### Requirement: Authored-Hint Fallback
The system SHALL support authored hints as a fallback or alternative to live AI mentor responses.

#### Scenario: Authored hint used
GIVEN a live mentor response is unavailable, disabled, rate-limited, or not approved for the current context
WHEN the learner requests help
THEN the system can provide an authored hint that matches the lesson, challenge, prompt, or current failure signal
AND indicates when only authored guidance is available.

#### Scenario: No matching authored hint
GIVEN no live mentor response is available
AND no matching authored hint exists
WHEN the learner requests help
THEN the system displays a recoverable unavailable state
AND suggests reviewing the current brief, tests, constraints, or visible feedback.

#### Scenario: Authored hints follow guardrails
GIVEN authored hints are configured for a lesson, challenge, or Code Prompt
WHEN a hint is displayed
THEN the hint follows no-direct-answer, hint-ladder, scope, and hidden-material protection requirements.

### Requirement: Mentor Request States
The system SHALL handle mentor availability, pending, cancellation, failure, retry, and usage-limit states.

#### Scenario: Mentor request pending
GIVEN the learner submits a mentor question
WHEN a mentor response is being generated or retrieved
THEN the system displays pending state
AND prevents duplicate sends for the same prompt.

#### Scenario: Mentor request canceled
GIVEN a mentor response is pending
WHEN cancellation is available and the learner cancels
THEN the system stops or abandons the response where feasible
AND preserves the learner's prompt text or conversation state.

#### Scenario: Mentor request failure
GIVEN a mentor request fails
WHEN the failure is displayed
THEN the system provides retryable feedback
AND does not invent mentor guidance or claim the request succeeded.

#### Scenario: Mentor usage limited
GIVEN mentor usage limits apply
WHEN the learner reaches a configured limit
THEN the system explains the limit
AND may offer authored hints or non-AI guidance when available.

### Requirement: Mentor Privacy and Retention
The system SHALL disclose mentor context sharing and handle mentor records according to privacy requirements.

#### Scenario: Context disclosure
GIVEN a learner uses mentor help
WHEN the mentor entry point or prompt area renders
THEN the system discloses the task context that may be shared with the mentor
AND avoids implying unrelated learner data is shared.

#### Scenario: Mentor records retained
GIVEN mentor conversation records are persisted
WHEN the records are stored
THEN the system associates them with the learner, task context, and attempt where applicable
AND applies retention, export, and erasure behavior defined by privacy controls.

#### Scenario: Sensitive data minimization
GIVEN a learner enters secrets, credentials, payment data, or unrelated personal data into a mentor prompt
WHEN mentor processing occurs
THEN the system minimizes, blocks, redacts, or warns according to product policy where feasible
AND does not require unrelated sensitive data for mentor help.

### Requirement: Mentor Signal Boundary
The system SHALL allow mentor usage facts to be consumed by content health only as aggregate or authorized support signals.

#### Scenario: Aggregate mentor usage signal
GIVEN mentor usage events exist for a lesson, challenge, or Code Prompt
WHEN content health summarizes help-seeking behavior
THEN content health may consume aggregate mentor usage counts, repeated-help indicators, and unresolved-help indicators
AND mentor guardrails remain authoritative for mentor behavior policy.

#### Scenario: Learner-level mentor support signal
GIVEN an authorized instructor or support admin views learner-level support context
WHEN mentor usage facts are included
THEN the system exposes only mentor metadata or conversation details allowed by privacy policy and authorization scope
AND does not expose unrelated learner data.

### Requirement: Mentor Responsibility Boundary
The AI mentor guardrails capability SHALL own mentor coaching policy, hint-ladder behavior, context limits, hidden-material protection, fallback guidance, request state expectations, privacy disclosure requirements, and mentor signal boundaries.

#### Scenario: Lesson challenge consumes guardrails
GIVEN a learner uses mentor help in a lesson challenge
WHEN mentor behavior is invoked
THEN lesson challenge owns the lesson UI, code draft, test execution, and challenge attempt state
AND AI mentor guardrails owns the coaching policy and mentor behavior boundaries.

#### Scenario: Code Prompts consume guardrails
GIVEN a learner uses mentor help in a Code Prompt
WHEN mentor behavior is invoked
THEN Code Prompts and Deliveries owns workspace, Delivery, evaluation, review, and revision behavior
AND AI mentor guardrails owns the coaching policy and mentor behavior boundaries.

#### Scenario: Advanced AI review remains separate
GIVEN a feature requires AI grading, autonomous Delivery acceptance, generated code review reports, adaptive remediation, or personalized curriculum generation
WHEN MVP scope is enforced
THEN that feature is deferred unless a later proposal accepts it
AND AI mentor guardrails remains focused on learner help behavior.
