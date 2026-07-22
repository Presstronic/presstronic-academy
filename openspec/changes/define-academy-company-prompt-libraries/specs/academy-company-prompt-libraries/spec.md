## ADDED Requirements

### Requirement: Company Prompt Library Boundary
The system SHALL treat company prompt libraries as future/B2B tenant-owned prompt collections that remain separate from Academy learner curriculum.

#### Scenario: Company prompt remains tenant-scoped
GIVEN a company prompt exists
WHEN prompt visibility is reviewed
THEN the prompt is visible only to authorized company or Academy roles according to tenant access rules
AND does not appear in learner catalog or Academy curriculum unless a later promotion workflow is accepted.

### Requirement: Code Prompt Compatibility
Company prompts SHALL reuse the accepted Code Prompt foundation where practical while adding company-specific ownership and assignment constraints.

#### Scenario: Company prompt is assigned
GIVEN a company prompt is used for an assessment
WHEN candidate work is requested
THEN the prompt can provide mission brief, objective, constraints, starter instructions, delivery checklist, and evaluation expectations
AND company-specific ownership and visibility rules are preserved.

### Requirement: Company Prompt Lifecycle
Company prompt libraries SHALL define draft, review, approved, archived, and assigned lifecycle boundaries before implementation.

#### Scenario: Prompt version is assigned
GIVEN a company prompt is assigned to candidates
WHEN the assignment is created
THEN a stable prompt version or snapshot is used
AND later prompt edits do not silently alter existing candidate assignments.

#### Scenario: Prompt is archived
GIVEN a company prompt should no longer be assigned
WHEN the prompt is archived
THEN it is unavailable for new assignments
AND existing assessment records retain the version used.

### Requirement: Company Prompt Governance
Company prompt libraries SHALL define ownership, review, validation, and import/export boundaries before tenant content workflows are implemented.

#### Scenario: Prompt requires review
GIVEN a company prompt is created or imported
WHEN it becomes eligible for assignment
THEN validation and review requirements are satisfied according to company prompt governance
AND unsafe or incomplete prompts are not assignable.
