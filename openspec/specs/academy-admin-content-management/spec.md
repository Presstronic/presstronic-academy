# Academy Admin Content Management Specification

## Purpose

Define the Presstronic Academy admin content management capability.

This specification captures admin/instructor authoring, validation, preview, review, publishing, unpublishing, archiving, restoration, versioning, rollback, role boundaries, and consumption boundaries for tracks, courses, modules, lessons, focused coding challenges, Code Prompts, and catalog metadata. It does not specify final database schemas, REST endpoints, rich text editor implementation, media storage, workflow notifications, content health analytics, or advanced CMS collaboration workflows.

## Requirements

### Requirement: Managed Content Types
The system SHALL allow authorized admins to manage the structured content types required for the first shippable Academy path.

#### Scenario: Content types are available
GIVEN an authorized admin opens content management
WHEN the admin creates or edits content
THEN the system supports tracks, courses, modules, lessons, focused coding challenges, Code Prompts, and catalog metadata
AND identifies relationships between those content types.

#### Scenario: Mission framing metadata
GIVEN an admin edits learner-facing content
WHEN the content supports mission framing
THEN the system allows mission title, brief, objective, constraints, and learner-facing operation language where applicable
AND keeps mission framing separate from validation-critical technical requirements.

#### Scenario: Relationship integrity
GIVEN content references another content item
WHEN the admin saves or validates the content
THEN the system detects missing, invalid, archived, or incompatible references
AND prevents publishing content with broken required relationships.

### Requirement: Content Lifecycle
The system SHALL manage content through draft, review, published, unpublished, archived, and restored states.

#### Scenario: Draft content
GIVEN an authorized author creates content
WHEN the content is saved
THEN the system stores it as draft by default
AND draft content is not visible to normal learners.

#### Scenario: Submit for review
GIVEN draft content passes required validation
WHEN an author submits it for review
THEN the system marks the content as in review
AND preserves the draft version being reviewed.

#### Scenario: Publish content
GIVEN content is in review and passes publish validation
WHEN an authorized publisher publishes it
THEN the system creates a published version
AND makes the content available to learner-facing capabilities according to access rules.

#### Scenario: Unpublish content
GIVEN content is published
WHEN an authorized publisher unpublishes it
THEN the system removes it from normal learner discovery
AND preserves existing learner history that references prior published versions.

#### Scenario: Archive and restore content
GIVEN content should no longer be edited or selected for new paths
WHEN an authorized admin archives it
THEN the system marks it archived
AND allows an authorized admin to restore it when product policy permits.

### Requirement: Content Validation
The system SHALL validate content for required fields, structure, references, publish readiness, and learner-surface compatibility.

#### Scenario: Required fields
GIVEN an admin saves or submits content
WHEN required title, slug, summary, body, relationship, mission, challenge, prompt, or catalog fields are missing
THEN the system identifies the missing fields
AND prevents review or publish when publish-critical fields are incomplete.

#### Scenario: Lesson validation
GIVEN an admin validates a lesson
WHEN lesson content contains invalid structure, missing objectives, broken media references, or unsupported learner-rendering blocks
THEN the system reports validation issues
AND prevents publishing until publish-critical issues are resolved.

#### Scenario: Focused challenge validation
GIVEN an admin validates a focused coding challenge
WHEN starter code, acceptance criteria, test definitions, reward metadata, or sandbox configuration is incomplete or invalid
THEN the system reports validation issues
AND prevents publishing until the focused challenge is runnable or explicitly marked unavailable by product policy.

#### Scenario: Code Prompt validation
GIVEN an admin validates a Code Prompt
WHEN mission brief, objective, constraints, starting point, Delivery checklist, required evidence, or evaluation expectations are incomplete
THEN the system reports validation issues
AND prevents publishing until the prompt can support a learner Delivery workflow.

### Requirement: Preview
The system SHALL allow authorized admins to preview learner-facing content before publication.

#### Scenario: Catalog preview
GIVEN an admin previews a track, course, module, or catalog offering
WHEN preview renders
THEN the system shows how the offering will appear in learner catalog or dashboard contexts
AND indicates that the preview is not published learner content.

#### Scenario: Lesson and challenge preview
GIVEN an admin previews a lesson or focused coding challenge
WHEN preview renders
THEN the system uses learner-facing layout and rendering rules where feasible
AND displays validation or availability warnings separately from learner content.

#### Scenario: Code Prompt preview
GIVEN an admin previews a Code Prompt
WHEN preview renders
THEN the system shows the mission brief, objective, constraints, starting point instructions, Delivery checklist, and evaluation expectations
AND does not create a learner attempt or workspace.

### Requirement: Versioning and Rollback
The system SHALL preserve content versions, publish history, change notes, and rollback targets for published content.

#### Scenario: Version is created
GIVEN content is published
WHEN the publication succeeds
THEN the system records a published version identifier
AND records publisher, timestamp, and change notes when provided.

#### Scenario: Edit published content
GIVEN content has a published version
WHEN an admin edits it
THEN the system creates or updates a draft without mutating the published version
AND learner-facing surfaces continue using the current published version until a new version is published.

#### Scenario: Roll back content
GIVEN a previous published version exists
WHEN an authorized publisher rolls back
THEN the system restores that version as the active published version
AND records the rollback event in publish history.

### Requirement: Admin Roles
The system SHALL distinguish authoring, review, publishing, and read-only permissions for content management.

#### Scenario: Author permissions
GIVEN a user has author permission
WHEN the user works in content management
THEN the system allows creating and editing drafts
AND does not allow publishing unless the user also has publisher permission.

#### Scenario: Reviewer permissions
GIVEN a user has reviewer permission
WHEN content is in review
THEN the system allows review feedback, approval, or request-changes actions according to product policy
AND does not require the reviewer to own the draft.

#### Scenario: Publisher permissions
GIVEN a user has publisher permission
WHEN content passes publish validation
THEN the system allows publishing, unpublishing, rollback, archive, and restore actions according to product policy.

#### Scenario: Read-only permissions
GIVEN a user has read-only admin permission
WHEN the user opens content management
THEN the system allows viewing content, validation results, previews, and publish history
AND prevents mutation actions.

### Requirement: Published Content Consumption Boundary
The admin content management capability SHALL own authoring, validation, preview, lifecycle, versioning, and publication while learner-facing capabilities consume published content.

#### Scenario: Catalog consumes published offerings
GIVEN content is published for learner discovery
WHEN catalog renders offerings
THEN catalog consumes the published offering data
AND does not own draft authoring, validation, or publication behavior.

#### Scenario: Lesson challenge consumes published lesson content
GIVEN a learner opens a lesson or focused challenge
WHEN lesson challenge renders
THEN lesson challenge consumes the published lesson and challenge version
AND does not own admin authoring or publish lifecycle.

#### Scenario: Code Prompts consume published prompt definitions
GIVEN a learner opens a Code Prompt
WHEN Code Prompts and Deliveries initializes the prompt
THEN it consumes the published prompt definition
AND does not own admin authoring, validation, preview, or publication behavior.

### Requirement: Admin Content Management Responsibility Boundary
The admin content management capability SHALL own content operations for MVP authoring and SHALL delegate learner experience, learner outcomes, and content health analytics to their owning capabilities.

#### Scenario: Learner surface boundary
GIVEN authored content is published
WHEN a learner interacts with it
THEN the learner-facing capability owns the learner interaction behavior
AND admin content management owns the content source, version, and publication state.

#### Scenario: Content health boundary
GIVEN learner attempts, failures, stuck signals, Delivery outcomes, or drop-off metrics are analyzed
WHEN content health is displayed
THEN content health dashboard owns health signal presentation
AND admin content management owns content identity and version context.

#### Scenario: Auth boundary
GIVEN a user performs content management actions
WHEN permissions are checked
THEN authentication and authorization systems provide identity and permission decisions
AND admin content management applies those decisions to content actions.

### Requirement: Content Health Context Boundary
The admin content management capability SHALL provide content identity, lifecycle, and version context for content health while not owning health signal presentation or analytics.

#### Scenario: Content identity provided to health
GIVEN published content exists
WHEN content health summarizes learner outcome signals
THEN admin content management provides the content identity and published version context needed to attribute signals
AND content health owns health summaries and drill-down presentation.

#### Scenario: Health links back to authoring
GIVEN an admin reviews a content health detail
WHEN the admin opens the associated content record
THEN admin content management owns the authoring, validation, preview, and publish workflow for any changes
AND content health remains responsible only for health signal interpretation.

#### Scenario: Health does not mutate content
GIVEN content health identifies a weak lesson, challenge, or Code Prompt
WHEN an admin reviews the signal
THEN content health does not directly mutate content state
AND any content revision, unpublish, rollback, or archive action belongs to admin content management.
