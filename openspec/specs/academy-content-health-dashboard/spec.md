# Academy Content Health Dashboard Specification

## Purpose

Define the Presstronic Academy content health dashboard capability.

This specification captures MVP-limited admin and instructor visibility into content health using stuck learner signals, repeated focused challenge failures, Code Prompt Delivery outcomes, revision loops, drop-off points, content version context, request states, and privacy-aware access. It does not specify final database schemas, event transport, metrics warehouses, charting libraries, alerts, exports, automated recommendations, AI-generated content edits, or B2B assessment analytics.

## Requirements

### Requirement: Content Health Overview
The system SHALL provide authorized admins and instructors with an MVP-limited overview of content health for published Academy content.

#### Scenario: Overview shows content health
GIVEN an authorized admin or instructor opens content health
WHEN the overview renders
THEN the system displays health summaries for tracks, courses, modules, lessons, focused coding challenges, and Code Prompts
AND includes published content identity and version context where available.

#### Scenario: Overview excludes draft content by default
GIVEN content exists only as draft, in review, archived, or unpublished
WHEN the health overview renders for normal operational review
THEN the system excludes that content from default health summaries
AND allows draft or unpublished context only through explicitly authorized admin workflows when product policy permits.

#### Scenario: Mission terminology is used carefully
GIVEN content health is displayed
WHEN Academy theming is applied
THEN the system may frame content issues as signals, incidents, or field reports
AND keeps operational metrics clear and unambiguous.

### Requirement: Health Signals
The system SHALL summarize learner outcome signals that indicate content may need review.

#### Scenario: Stuck learner signal
GIVEN learners spend excessive time, repeat attempts, abandon progress, or repeatedly request help on a content item
WHEN content health calculates stuck signals
THEN the system identifies the content item and signal category
AND distinguishes stuck signals from accepted completions.

#### Scenario: Focused challenge failure signal
GIVEN learners run focused challenge tests
WHEN test outcomes are summarized
THEN the system reports repeated failing tests, timeout or resource-limit results, sandbox infrastructure errors, reset frequency, and completion outcomes where available.

#### Scenario: Code Prompt Delivery signal
GIVEN learners submit Code Prompt Deliveries
WHEN Delivery outcomes are summarized
THEN the system reports accepted, needs-revision, failed, evaluation-error, and pending outcomes
AND reports revision loop counts where available.

#### Scenario: Drop-off signal
GIVEN learners start but do not complete a lesson, challenge, Code Prompt, or Delivery
WHEN content health summarizes progress
THEN the system identifies drop-off points by content identity and version
AND avoids treating incomplete in-progress work as failure before the configured threshold is reached.

### Requirement: Content Detail Drill-Down
The system SHALL allow authorized admins and instructors to inspect content-level health detail without owning the learner workflow.

#### Scenario: Lesson detail
GIVEN an authorized admin or instructor opens health detail for a lesson
WHEN lesson health renders
THEN the system displays starts, completions, drop-offs, stuck signals, related focused challenge outcomes, and active published version context.

#### Scenario: Focused challenge detail
GIVEN an authorized admin or instructor opens health detail for a focused challenge
WHEN challenge health renders
THEN the system displays test pass rates, repeated failing acceptance items, reset frequency, timeout or sandbox error frequency, completion rate, and related content version context.

#### Scenario: Code Prompt detail
GIVEN an authorized admin or instructor opens health detail for a Code Prompt
WHEN prompt health renders
THEN the system displays prompt starts, workspace resumes, Delivery submissions, evaluation outcomes, revision loops, accepted Delivery rate, and active published definition version.

#### Scenario: Detail links to content management
GIVEN an admin has content authoring permission
WHEN the admin views a content health detail
THEN the system provides a path to the corresponding content management record or version
AND content management remains responsible for edits, validation, preview, and publishing.

### Requirement: Version-Aware Health
The system SHALL preserve enough content version context to compare health signals before and after publication changes.

#### Scenario: Current version metrics
GIVEN a content item has a current published version
WHEN content health renders current metrics
THEN the system attributes eligible learner outcome signals to that published version where the source signal includes version context.

#### Scenario: Previous version comparison
GIVEN a content item has previous published versions with outcome signals
WHEN an authorized admin views version comparison
THEN the system can show current versus previous version health summaries
AND identifies when sample size or missing data limits the comparison.

#### Scenario: Rollback context
GIVEN content was rolled back in admin content management
WHEN content health renders the affected content
THEN the system preserves the health history of both the rolled-back-from version and the restored active version
AND does not rewrite historical outcomes.

### Requirement: Privacy-Aware Health Access
The system SHALL protect learner privacy when content health uses learner outcome signals.

#### Scenario: Aggregate default
GIVEN an authorized admin or instructor opens content health
WHEN health summaries render
THEN the system defaults to aggregate metrics and signal counts
AND does not expose learner names, private profile details, billing data, or unrelated account data.

#### Scenario: Learner-level support view
GIVEN an authorized instructor or support admin has permission to inspect learner-level content support details
WHEN the learner-level support view is opened
THEN the system exposes only the learner identity, content identity, attempt status, timestamps, and outcome details needed for support
AND does not expose unrelated learner data.

#### Scenario: Low sample warning
GIVEN a content health metric is based on too few learners or incomplete source data
WHEN the metric is displayed
THEN the system marks the metric as low-sample, incomplete, or unavailable
AND avoids presenting it as a reliable content quality conclusion.

### Requirement: Content Health Request States
The system SHALL handle loading, partial data, missing signals, and failures in content health views.

#### Scenario: Health loading
GIVEN content health data has not loaded
WHEN an authorized user opens the health dashboard
THEN the system displays a loading state
AND does not show stale health data from another context.

#### Scenario: Partial signal data
GIVEN some health signal sources are unavailable
WHEN content health renders
THEN the system displays available summaries
AND identifies unavailable or stale signal groups separately.

#### Scenario: Health load failure
GIVEN content health data cannot be retrieved
WHEN the dashboard renders
THEN the system displays a recoverable error
AND provides a retry path.

### Requirement: Content Health Responsibility Boundary
The content health dashboard capability SHALL own health signal presentation, summaries, drill-downs, version-aware health context, and privacy-aware health access while consuming source facts from their owning capabilities.

#### Scenario: Lesson challenge provides source facts
GIVEN focused challenge attempts, test runs, reset events, sandbox failures, or completion outcomes exist
WHEN content health summarizes those signals
THEN lesson challenge remains authoritative for the source facts
AND content health owns aggregation and presentation.

#### Scenario: Code Prompts provide source facts
GIVEN prompt attempts, Deliveries, evaluations, review reports, revisions, or accepted evidence exist
WHEN content health summarizes those signals
THEN Code Prompts and Deliveries remains authoritative for the source facts
AND content health owns aggregation and presentation.

#### Scenario: Admin content management provides content context
GIVEN content identity, lifecycle state, published version, rollback history, or authoring metadata is needed for health analysis
WHEN content health renders content context
THEN admin content management remains authoritative for content source and version context
AND content health owns health interpretation and presentation.

#### Scenario: Learner dashboard boundary
GIVEN learner-facing dashboard data is rendered
WHEN content health data exists
THEN the learner dashboard does not expose admin content health views
AND content health remains an admin/instructor operational capability.

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
