# Academy Code Prompts and Deliveries Specification

## Purpose

Define project-style Code Prompts, learner workspaces, submitted Deliveries, attempt history, evaluation checks, review reports, revision flow, learner evidence integration, and the boundary with future hiring assessments.

This specification captures learner-MVP prompt and Delivery behavior. It does not specify final data schemas, API endpoints, runner implementation, cloud IDE behavior, prompt-authoring UI, content health dashboards, or B2B hiring assessment workflows.

## Requirements

### Requirement: Code Prompt Anatomy
The system SHALL define Code Prompts as mission-framed, project-style assignments that ask learners to ship a coherent engineering Delivery.

#### Scenario: Prompt brief is presented
GIVEN a learner opens a Code Prompt
WHEN the prompt renders
THEN the system presents a mission brief
AND presents the objective
AND presents constraints
AND presents starter project or workspace instructions
AND presents a Delivery checklist
AND presents evaluation expectations.

#### Scenario: Prompt supports different starting points
GIVEN a Code Prompt is configured
WHEN the prompt defines its starting point
THEN the prompt may start from a blank workspace, a starter project, a partial implementation, a failing project, or a refactoring target
AND the prompt identifies what the learner is expected to take to delivery.

#### Scenario: Prompt preserves CYOA framing
GIVEN a Code Prompt is displayed
WHEN mission language is applied
THEN the prompt frames work as an operation, incident, client request, field assignment, architecture review, or delivery mission
AND does not obscure the technical objective.

### Requirement: Prompt Workspace Lifecycle
The system SHALL provide a learner workspace lifecycle for starting, resuming, preserving, resetting, and submitting Code Prompt work.

#### Scenario: Start workspace
GIVEN a learner starts a Code Prompt
WHEN no active workspace exists for that learner and prompt
THEN the system creates a workspace from the prompt starting point
AND associates it with the learner, prompt, and attempt.

#### Scenario: Resume workspace
GIVEN a learner has an active prompt workspace
WHEN the learner returns to the prompt
THEN the system restores the latest saved workspace state
AND preserves learner work until the learner resets, submits, or the workspace expires according to product policy.

#### Scenario: Reset workspace
GIVEN a learner has an active prompt workspace
WHEN the learner resets the workspace
THEN the system starts from the configured prompt starting point
AND preserves prior attempt history separately from the new workspace state.

#### Scenario: Workspace failure
GIVEN workspace state cannot be loaded or saved
WHEN the learner opens or edits the prompt workspace
THEN the system displays recoverable feedback
AND avoids silently discarding learner work.

### Requirement: Delivery Submission
The system SHALL allow learners to submit a Delivery that contains the work and evidence required by a Code Prompt.

#### Scenario: Submit Delivery
GIVEN a learner has completed prompt work
WHEN the learner submits a Delivery
THEN the system records the submitted code or project changes
AND records implementation notes when provided
AND records assumptions or tradeoffs when provided
AND records required evidence defined by the prompt
AND associates the Delivery with the learner, prompt, workspace, and attempt.

#### Scenario: Required evidence missing
GIVEN a prompt requires specific Delivery evidence
WHEN the learner submits without that evidence
THEN the system blocks submission
AND identifies the missing Delivery requirements.

#### Scenario: Delivery snapshot
GIVEN a Delivery is submitted
WHEN evaluation begins
THEN the system evaluates a stable snapshot of the submitted work
AND later workspace edits do not mutate the evaluated Delivery snapshot.

### Requirement: Attempt History
The system SHALL maintain Code Prompt attempt history across workspace resets, Delivery submissions, evaluations, and revisions.

#### Scenario: Attempt timeline
GIVEN a learner works on a Code Prompt
WHEN the learner starts, submits, revises, resets, or receives evaluation feedback
THEN the system records the event in prompt attempt history
AND includes timestamp, status, prompt, learner, and relevant Delivery or evaluation identifiers.

#### Scenario: Attempt history remains available
GIVEN a learner has previous prompt attempts
WHEN the learner views the prompt history
THEN the system displays previous statuses, submitted Deliveries, evaluation summaries, and revision outcomes available to that learner.

#### Scenario: Attempt history supports admin visibility
GIVEN an authorized admin or instructor reviews learner prompt progress
WHEN prompt attempt history is requested
THEN the system exposes attempt status, evaluation summary, and timestamps needed for support or content health review
AND does not expose private learner data outside the authorized scope.

### Requirement: Evaluation Checks
The system SHALL evaluate Deliveries using configured checks appropriate to the prompt and record the results.

#### Scenario: Delivery checks run
GIVEN a Delivery is submitted
WHEN evaluation starts
THEN the system runs configured checks such as tests, hidden tests, lint, typecheck, build, static checks, or prompt-specific evaluation steps
AND records check status and output.

#### Scenario: Evaluation pending
GIVEN evaluation is still running
WHEN the learner views the Delivery
THEN the system displays pending evaluation state
AND prevents the pending state from being mistaken for accepted or failed.

#### Scenario: Evaluation failure
GIVEN evaluation infrastructure fails
WHEN the Delivery cannot be evaluated
THEN the system records an evaluation error
AND provides retry or support guidance without marking the Delivery as accepted.

#### Scenario: Hidden checks remain protected
GIVEN a prompt uses hidden checks
WHEN evaluation results are displayed
THEN the system reports outcome and actionable feedback
AND does not reveal hidden check implementation details that would compromise the prompt.

### Requirement: Basic Review Report
The system SHALL provide a basic review report for evaluated Deliveries with status, check outcomes, feedback, and revision guidance.

#### Scenario: Accepted Delivery report
GIVEN a Delivery passes required evaluation
WHEN the review report is displayed
THEN the report shows accepted status
AND summarizes passed checks or strengths
AND records the accepted Delivery as learner evidence.

#### Scenario: Needs revision report
GIVEN a Delivery is close but does not meet all prompt expectations
WHEN the review report is displayed
THEN the report shows needs-revision status
AND identifies failed checks, risks, missing evidence, or improvement guidance
AND allows the learner to revise and resubmit.

#### Scenario: Failed Delivery report
GIVEN a Delivery cannot satisfy required evaluation
WHEN the review report is displayed
THEN the report shows failed status
AND provides actionable feedback when available
AND preserves the failed Delivery in attempt history.

#### Scenario: Review report uses mission consequences
GIVEN review feedback is displayed
WHEN the prompt uses mission framing
THEN the report may describe consequences, risk, or unlocked follow-up work
AND keeps technical feedback clear and actionable.

### Requirement: Revision Flow
The system SHALL support revising a Delivery after evaluation feedback while preserving prior evaluated snapshots.

#### Scenario: Revise Delivery
GIVEN a Delivery receives needs-revision or failed status
WHEN the learner chooses to revise
THEN the system returns the learner to the associated workspace or a revision workspace
AND preserves the prior Delivery snapshot and review report.

#### Scenario: Resubmit revision
GIVEN a learner revises prompt work
WHEN the learner resubmits
THEN the system creates a new evaluated Delivery or revision attempt linked to the prompt history
AND does not overwrite prior evaluation history.

#### Scenario: Accepted revision
GIVEN a revised Delivery is accepted
WHEN learner evidence is updated
THEN the system records the accepted revision as the current accepted Delivery for the prompt
AND preserves earlier attempts for learning history.

### Requirement: Learner Evidence Integration
The system SHALL integrate accepted Deliveries into learner progress, basic skill evidence, and mission activity without making those capabilities own prompt evaluation internals.

#### Scenario: Progress evidence updated
GIVEN a Delivery is accepted
WHEN learner progress is updated
THEN the system records the accepted Delivery against the learner's progress
AND associates configured skill tags or path progress evidence.

#### Scenario: Mission log entry
GIVEN a Delivery changes status
WHEN status is accepted, needs revision, failed, or evaluation error
THEN the system may create a mission-log transmission or activity entry
AND links the entry back to the relevant prompt, Delivery, or review report.

#### Scenario: Evidence boundary
GIVEN progression or mission-log surfaces display Delivery information
WHEN they render Delivery evidence
THEN they display derived status and links
AND do not own prompt workspace, evaluation, or review report behavior.

### Requirement: Future Hiring Assessment Boundary
The system SHALL preserve compatibility with future hiring assessments while keeping company assessment workflows out of learner MVP scope.

#### Scenario: B2B workflow deferred
GIVEN a feature requires company tenants, candidate assignment links, candidate review packets, anti-cheating, plagiarism checks, custom company prompt libraries, or rubric editor workflows
WHEN the feature is proposed during learner MVP work
THEN it is classified as future/B2B
AND requires a separate OpenSpec proposal before implementation.

#### Scenario: Shared foundation preserved
GIVEN Code Prompt and Delivery behavior is designed
WHEN future hiring assessment needs are considered
THEN prompt, Delivery, evaluation, review, and attempt concepts remain general enough to support future candidate assessment use
AND learner MVP workflows are not forced to expose company assessment features.

### Requirement: Code Prompts Responsibility Boundary
The Code Prompts and Deliveries capability SHALL own prompt anatomy, workspace lifecycle, Delivery submission, prompt attempts, evaluation checks, review reports, revision flow, and prompt evidence boundaries.

#### Scenario: Lesson challenge delegates broad prompts
GIVEN a learning activity requires project-style Delivery evidence or multi-step prompt evaluation
WHEN the activity exceeds focused lesson challenge behavior
THEN the lesson challenge capability delegates that activity to Code Prompts and Deliveries.

#### Scenario: Progression consumes accepted evidence
GIVEN a Delivery is accepted
WHEN progression updates
THEN progression consumes accepted Delivery evidence
AND Code Prompts and Deliveries remains authoritative for prompt evaluation and review report details.

#### Scenario: Mission log consumes status events
GIVEN prompt or Delivery status changes
WHEN mission-log activity is created
THEN mission-log consumes prompt lifecycle events
AND Code Prompts and Deliveries remains authoritative for prompt, workspace, Delivery, evaluation, and revision behavior.

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
