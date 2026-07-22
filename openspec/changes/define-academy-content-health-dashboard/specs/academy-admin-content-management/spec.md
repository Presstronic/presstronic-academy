## ADDED Requirements

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
