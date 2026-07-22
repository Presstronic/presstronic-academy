# Academy Lesson Challenge Specification

## Purpose

Define the Presstronic Academy lesson and skill challenge experience.

This specification captures the challenge briefing, acceptance checklist, code editor, test run and reset controls, AI mentor panel, grading, progress updates, sandbox safety expectations, draft handling, and navigation back to the story. It does not specify provider-specific sandbox or model internals.

## Requirements

### Requirement: Lesson Shell Context
WHERE the lesson screen is displayed,
the system SHALL render the lesson challenge inside the in-app Academy shell.

#### Scenario: Lesson uses app shell
GIVEN the current screen is `lesson`
WHEN the application renders
THEN the lesson challenge content is displayed inside the app shell
AND the sidebar is displayed
AND the in-app top bar is displayed.

#### Scenario: Lesson heading
GIVEN the lesson screen is displayed
WHEN the page heading renders
THEN the system displays the section label `// SKILL CHALLENGE`
AND displays the lesson title
AND displays the branch context badge `Branch B - do it right`.

### Requirement: Challenge Briefing
WHERE the lesson challenge is displayed,
the system SHALL explain the concept and challenge objective.

#### Scenario: Briefing visible
GIVEN the lesson screen is displayed
WHEN the briefing card renders
THEN the system displays the section label `// BRIEFING`
AND explains what a poison message is
AND explains that forever retries block later work.

#### Scenario: Dead-letter queue explanation
GIVEN the briefing card is displayed
WHEN the learner reads the fix explanation
THEN the system explains counting attempts
AND explains parking messages in a dead-letter queue after a limit
AND identifies dead-letter queue as the key concept.

### Requirement: Acceptance Checklist
WHERE the lesson challenge is displayed,
the system SHALL show challenge acceptance tests and their current execution state.

#### Scenario: Acceptance heading
GIVEN the lesson screen is displayed
WHEN the acceptance card renders
THEN the system displays the section label `// ACCEPTANCE`.

#### Scenario: Initial test status
GIVEN the lesson screen has initialized
AND no persisted test run exists for the current challenge attempt
WHEN the acceptance checklist renders
THEN each acceptance item displays `WAIT`.

#### Scenario: Ran test status
GIVEN the user has run tests
WHEN the acceptance checklist renders
THEN each acceptance item displays `PASS` when its configured result passes
AND displays `FAIL` when its configured result fails.

#### Scenario: Acceptance item names
GIVEN the acceptance checklist renders
WHEN test names are displayed
THEN the system includes `parks message after 3 retries`
AND includes `preserves message payload in DLQ`
AND includes `does not block subsequent messages`.

### Requirement: Lesson Story Navigation
WHERE the lesson challenge is displayed,
the system SHALL provide actions for returning to the story context.

#### Scenario: Rewatch briefing
GIVEN the lesson screen is displayed
WHEN the user activates `Rewatch briefing - 01:32`
THEN the system navigates to the story screen.

#### Scenario: Back to story
GIVEN the lesson screen is displayed
WHEN the user activates `Back to the story`
THEN the system navigates to the story screen.

### Requirement: Code Pane
WHERE the lesson challenge is displayed,
the system SHALL present an editable code workspace for the challenge file.

#### Scenario: File label
GIVEN the lesson screen is displayed
WHEN the code pane header renders
THEN the system displays the file path `src/worker.ts`.

#### Scenario: Code lines
GIVEN the lesson screen is displayed
WHEN the code workspace renders
THEN the system displays the configured code lines
AND displays line numbers
AND applies syntax-token styling
AND allows the learner to edit the code.

#### Scenario: Code pane terminal styling
GIVEN the lesson screen is displayed
WHEN the code pane renders
THEN the system uses dark terminal styling
AND may include subtle scanline styling.

#### Scenario: Code typography
GIVEN the code workspace renders
WHEN typography is applied
THEN code, line numbers, test labels, and terminal output use mono typography.

### Requirement: Test Run
WHEN the user runs or resets tests,
the system SHALL execute the challenge tests against the learner's current code and display test output.

#### Scenario: Run tests
GIVEN tests have not been run for the current challenge attempt
WHEN the user activates `Run tests`
THEN the system executes the challenge test suite
AND displays individual PASS and FAIL statuses in the acceptance checklist
AND displays summary output explaining the current result.

#### Scenario: Reset tests
GIVEN tests have been run for the current challenge attempt
WHEN the user activates `Reset`
THEN the system restores the starter code
AND displays `WAIT` for each acceptance item
AND displays summary output `RUN TESTS TO EVALUATE`.

#### Scenario: Reward display
GIVEN the lesson screen is displayed
WHEN the code pane footer renders
THEN the system displays reward text `REWARD +120 XP`.

### Requirement: AI Mentor Panel
WHERE the lesson challenge is displayed,
the system SHALL show an AI mentor panel with contextual chips, sample exchange, prompt input, and live indicator.

#### Scenario: Mentor header
GIVEN the lesson screen is displayed
WHEN the AI mentor panel renders
THEN the system displays the section label `// PROXY - AI MENTOR`
AND displays a live indicator.

#### Scenario: Mentor context chips before tests
GIVEN tests have not been run for the current challenge attempt
WHEN the mentor context chips render
THEN the system displays `LESSON: DEAD-LETTER QUEUES`
AND displays `FILE: worker.ts`
AND displays `TESTS: NOT RUN`.

#### Scenario: Mentor context chips after tests
GIVEN tests have been run for the current challenge attempt
WHEN the mentor context chips render
THEN the system displays `LESSON: DEAD-LETTER QUEUES`
AND displays `FILE: worker.ts`
AND displays `TESTS: 2 / 3 PASSING`.

#### Scenario: Sample mentor exchange
GIVEN the AI mentor panel is displayed
WHEN the message area renders
THEN the system displays a sample learner question about the third test
AND displays a mentor response explaining that the catch block still requeues every failure
AND references tracking message attempts and sending to a dead-letter queue after the third attempt.

#### Scenario: Mentor prompt input
GIVEN the AI mentor panel is displayed
WHEN the prompt area renders
THEN the system displays an input with placeholder `Ask about this lesson or your code...`
AND displays a `Send` action
AND explains that the mentor sees the lesson, editor, and test results.

### Requirement: Lesson Data Source
WHERE the lesson challenge renders content,
the system SHALL derive lesson details from the authored lesson and challenge data source.

#### Scenario: Lesson fields
GIVEN the lesson screen is displayed
WHEN challenge content renders
THEN the system reads lesson title, challenge text, starter code, and test definitions from lesson data.

#### Scenario: Test results
GIVEN the user runs tests
WHEN test statuses render
THEN the system reads pass and fail outcomes from the latest executed test run.

### Requirement: Lesson Challenge Persistence
WHERE the lesson challenge handles learner work,
the system SHALL persist challenge attempts, code edits, test results, mentor context, and earned rewards to the learner account.

#### Scenario: Code edits persist
GIVEN the lesson screen is displayed
WHEN the learner edits the challenge code
THEN the system preserves the current draft across page reloads
AND associates the draft with the current challenge attempt.

#### Scenario: Tests execute
GIVEN the user activates `Run tests`
WHEN test state updates
THEN the system displays results from the executed challenge tests
AND stores the latest run result.

#### Scenario: Mentor send uses current context
GIVEN the AI mentor panel is displayed
WHEN the learner sends a mentor question
THEN the system sends the lesson, current code, and latest test results as context
AND displays the mentor response in the conversation.

#### Scenario: XP is awarded on completion
GIVEN the lesson screen displays `REWARD +120 XP`
WHEN the learner completes the challenge according to its acceptance criteria
THEN the system awards the configured XP once
AND updates learner progression.

### Requirement: Challenge Sandbox Safety
WHEN the learner runs challenge tests,
the system SHALL execute learner code in an isolated, resource-limited environment.

#### Scenario: Runtime isolation
GIVEN the learner activates `Run tests`
WHEN the challenge test suite executes
THEN the system runs learner code outside the application process
AND prevents access to unauthorized network, filesystem, environment, and credential resources.

#### Scenario: Resource limits
GIVEN learner code enters an infinite loop or consumes excessive resources
WHEN the challenge test suite executes
THEN the system stops execution at configured CPU, memory, and wall-clock limits
AND displays a timeout or resource-limit result instead of hanging the lesson screen.

#### Scenario: Sandbox failure
GIVEN the test sandbox cannot start or returns an infrastructure error
WHEN the learner runs tests
THEN the system preserves the learner's draft
AND displays a retryable service error
AND does not award or revoke XP.

### Requirement: Challenge Draft Safety
WHERE the learner has unsaved or changed challenge code,
the system SHALL protect the learner from accidental draft loss.

#### Scenario: Draft autosaves
GIVEN the learner edits challenge code
WHEN the draft changes
THEN the system periodically saves the draft to the current challenge attempt
AND indicates whether the latest draft is saved or pending save.

#### Scenario: Navigate with unsaved draft
GIVEN the learner has unsaved code changes
WHEN the learner activates `Back to the story` or `Rewatch briefing - 01:32`
THEN the system warns that changes may be lost
AND lets the learner continue navigation or stay on the challenge.

#### Scenario: Reset changed draft
GIVEN the learner's current draft differs from starter code
WHEN the learner activates `Reset`
THEN the system asks for confirmation before restoring starter code.

### Requirement: Mentor Safety and Request State
WHEN the learner interacts with the AI mentor,
the system SHALL disclose context sharing, handle request state, and avoid unbounded mentor usage.

#### Scenario: Mentor send pending
GIVEN the learner sends a mentor question
WHEN the mentor response is in progress
THEN the system disables duplicate sends for that prompt
AND provides a cancel or stop-generating affordance when streaming is available.

#### Scenario: Mentor failure
GIVEN a mentor request fails
WHEN the mentor panel renders the result
THEN the system displays a retryable error
AND preserves the learner's unsent or failed prompt text.

#### Scenario: Mentor privacy boundary
GIVEN the AI mentor panel is displayed
WHEN the prompt area renders
THEN the system explains that the mentor receives the lesson, current code, latest test results, and conversation context
AND does not send unrelated learner profile, billing, or private account data.

### Requirement: Lesson Visual Design
WHERE the lesson challenge screen renders briefing, editor, tests, and mentor panels,
the system SHALL preserve the Academy terminal-workbench visual language.

#### Scenario: Terminal treatment restraint
GIVEN the code pane or test output pane renders
WHEN cyberpunk treatment is applied
THEN scanlines are limited to dark terminal panes
AND the same element does not also receive HUD corners, neon top edge, hazard stripes, and glow.

#### Scenario: Test status color
GIVEN test results are displayed
WHEN result styling is applied
THEN passing results use the Academy success color
AND failing results use the Academy destructive color
AND waiting or pending results use neutral or cyan status treatment.

#### Scenario: No movement hover
GIVEN a lesson action, test row, checklist row, or mentor chip is interactive
WHEN hover or press styling is applied
THEN the system changes color, fill, border, or opacity only
AND does not lift, translate, or scale the element.

### Requirement: Lesson Challenge Responsibility Boundary
The lesson-challenge capability SHALL own coding challenge presentation, challenge drafts, test execution expectations, mentor interactions, sandbox safety, and challenge completion behavior while delegating story branch decisions and global progression rules to their owning capabilities.

#### Scenario: Challenge receives story context
- **GIVEN** a learner enters a challenge from a story branch
- **WHEN** the challenge initializes
- **THEN** lesson-challenge uses the provided story and attempt context
- **AND** academy-story remains authoritative for branch choice and checkpoint state.

#### Scenario: Challenge completion reports progression event
- **GIVEN** a learner completes a challenge
- **WHEN** XP, clearance, or achievements may change
- **THEN** lesson-challenge records or emits the completion result
- **AND** academy-progression owns derived progression and award integrity rules.

#### Scenario: Challenge visual treatment references global design
- **GIVEN** challenge panes specify terminal, test, mentor, or code styling
- **WHEN** global colors, typography, geometry, or motion are applied
- **THEN** lesson-challenge follows academy-visual-design
- **AND** only defines challenge-specific presentation constraints.

### Requirement: Lesson Challenge Code Prompt Boundary
The lesson challenge capability SHALL own focused lesson-level coding challenges and SHALL delegate project-style prompt work to the Code Prompts and Deliveries capability.

#### Scenario: Focused challenge remains lesson-owned
GIVEN a learner works on a lesson challenge
WHEN the activity evaluates a focused exercise, code pane, acceptance checklist, test run, draft, or mentor interaction local to the lesson
THEN academy-lesson-challenge owns the challenge behavior.

#### Scenario: Project-style prompt delegates
GIVEN a learner activity requires a mission brief, starter project, Delivery checklist, implementation notes, broad evidence, review report, or revision lifecycle
WHEN the activity is presented from a lesson or path
THEN academy-lesson-challenge delegates that activity to academy-code-prompts-deliveries.

#### Scenario: Lesson can link to prompt
GIVEN a lesson introduces a Code Prompt
WHEN the learner activates the prompt entry point
THEN the lesson challenge surface may navigate to or embed the Code Prompt entry point
AND does not own prompt workspace, Delivery evaluation, or review report behavior.

### Requirement: Lesson Challenge Published Content Boundary
The lesson challenge capability SHALL consume published lesson and focused challenge content from admin content management and SHALL NOT own admin authoring or publish lifecycle.

#### Scenario: Lesson renders published version
GIVEN a learner opens a lesson challenge
WHEN lesson content renders
THEN the lesson challenge uses the published lesson and challenge version selected for that learner path
AND preserves learner attempts against that version.

#### Scenario: Draft content excluded from learner challenge
GIVEN a lesson or challenge exists only as draft, in review, archived, or unpublished
WHEN a normal learner requests it
THEN the lesson challenge does not render it as available learner content
AND follows not-found, unavailable, or access behavior defined by learner-facing specs.

#### Scenario: Authoring delegated
GIVEN an admin edits lesson body, starter code, tests, acceptance criteria, or challenge metadata
WHEN the edit is saved, validated, previewed, or published
THEN academy-admin-content-management owns that content operation
AND lesson challenge consumes the resulting published content.

### Requirement: Lesson Challenge Health Signal Boundary
The lesson challenge capability SHALL expose focused challenge attempt, test, reset, sandbox, and completion source facts for content health while not owning health aggregation or presentation.

#### Scenario: Challenge outcomes available for health
GIVEN learners run focused challenge tests
WHEN content health requests challenge source facts
THEN lesson challenge can provide attempt identity, content identity, content version when available, test outcomes, reset events, sandbox failures, completion status, and timestamps within authorized scope.

#### Scenario: Health aggregation delegated
GIVEN challenge outcome source facts exist
WHEN repeated failures, stuck signals, or completion summaries are displayed
THEN content health owns aggregation and presentation
AND lesson challenge remains authoritative for individual attempt and test execution facts.

#### Scenario: Learner workflow unaffected by health
GIVEN content health processing is delayed or unavailable
WHEN a learner runs tests or completes a focused challenge
THEN lesson challenge preserves the learner workflow
AND does not require the health dashboard to be available for challenge execution.

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
