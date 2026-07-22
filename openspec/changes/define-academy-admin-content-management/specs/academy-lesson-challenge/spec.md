## ADDED Requirements

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
